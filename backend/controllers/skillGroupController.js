import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (req, res, next) => {
  try {
    const groups = await prisma.skillGroup.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return ApiResponse.success(res, groups);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const group = await prisma.skillGroup.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!group) throw ApiError.notFound('Skill group not found');
    return ApiResponse.success(res, group);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const group = await prisma.skillGroup.create({ data: req.body });
    return ApiResponse.created(res, group, 'Skill group created');
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const group = await prisma.skillGroup.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    if (!group) throw ApiError.notFound('Skill group not found');
    return ApiResponse.success(res, group, 'Skill group updated');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.skillGroup.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    return ApiResponse.noContent(res);
  } catch (error) {
    if (error.code === 'P2025') {
      return next(ApiError.notFound('Skill group not found'));
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
        prisma.skillGroup.update({
          where: { id: parseInt(item.id, 10) },
          data: { order: item.order },
        })
      )
    );

    return ApiResponse.success(res, null, 'Skill groups reordered');
  } catch (error) {
    next(error);
  }
};
