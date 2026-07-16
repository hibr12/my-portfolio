import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return ApiResponse.success(res, projects);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!project) throw ApiError.notFound('Project not found');
    return ApiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    return ApiResponse.created(res, project, 'Project created');
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    if (!project) throw ApiError.notFound('Project not found');
    return ApiResponse.success(res, project, 'Project updated');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.project.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    return ApiResponse.noContent(res);
  } catch (error) {
    if (error.code === 'P2025') {
      return next(ApiError.notFound('Project not found'));
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
        prisma.project.update({
          where: { id: parseInt(item.id, 10) },
          data: { order: item.order },
        })
      )
    );

    return ApiResponse.success(res, null, 'Projects reordered');
  } catch (error) {
    next(error);
  }
};
