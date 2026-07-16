import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (req, res, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return ApiResponse.success(res, certificates);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!certificate) throw ApiError.notFound('Certificate not found');
    return ApiResponse.success(res, certificate);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const certificate = await prisma.certificate.create({ data: req.body });
    return ApiResponse.created(res, certificate, 'Certificate created');
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const certificate = await prisma.certificate.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    if (!certificate) throw ApiError.notFound('Certificate not found');
    return ApiResponse.success(res, certificate, 'Certificate updated');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.certificate.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    return ApiResponse.noContent(res);
  } catch (error) {
    if (error.code === 'P2025') {
      return next(ApiError.notFound('Certificate not found'));
    }
    next(error);
  }
};

export const reorder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) throw ApiError.badRequest('Items array is required');

    await prisma.$transaction(
      items.map((item) =>
        prisma.certificate.update({
          where: { id: parseInt(item.id, 10) },
          data: { order: item.order },
        })
      )
    );

    return ApiResponse.success(res, null, 'Certificates reordered');
  } catch (error) {
    next(error);
  }
};
