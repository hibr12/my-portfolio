import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import emailService from '../utils/email.js';

export const submit = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    emailService.sendContactThankYou(name, email).catch(() => {});
    emailService.sendAdminNotification(name, email, message).catch(() => {});

    return ApiResponse.created(res, contactMessage, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.contactMessage.count({ where });
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      take: parseInt(limit, 10),
    });

    return ApiResponse.paginated(res, messages, total, parseInt(page, 10), parseInt(limit, 10));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!message) throw ApiError.notFound('Message not found');

    if (message.status === 'unread') {
      await prisma.contactMessage.update({
        where: { id: message.id },
        data: { status: 'read', readAt: new Date() },
      });
      message.status = 'read';
      message.readAt = new Date();
    }

    return ApiResponse.success(res, message);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const data = { status };
    if (status === 'read') data.readAt = new Date();
    if (status === 'replied') data.repliedAt = new Date();

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id, 10) },
      data,
    });

    if (!message) throw ApiError.notFound('Message not found');
    return ApiResponse.success(res, message, 'Status updated');
  } catch (error) {
    if (error.code === 'P2025') {
      return next(ApiError.notFound('Message not found'));
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    return ApiResponse.noContent(res);
  } catch (error) {
    if (error.code === 'P2025') {
      return next(ApiError.notFound('Message not found'));
    }
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const total = await prisma.contactMessage.count();
    const unread = await prisma.contactMessage.count({ where: { status: 'unread' } });
    const read = await prisma.contactMessage.count({ where: { status: 'read' } });
    const replied = await prisma.contactMessage.count({ where: { status: 'replied' } });

    return ApiResponse.success(res, { total, unread, read, replied });
  } catch (error) {
    next(error);
  }
};
