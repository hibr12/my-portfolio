import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const userSelect = { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true };

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return ApiResponse.success(res, {
      token,
      user: sanitizeUser(user),
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  return ApiResponse.success(res, req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (avatar !== undefined) data.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userSelect,
    });

    return ApiResponse.success(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true },
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    const rounds = parseInt(env.BCRYPT_ROUNDS, 10) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, rounds);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return ApiResponse.success(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw ApiError.conflict('A user with this email already exists');
    }

    const rounds = parseInt(env.BCRYPT_ROUNDS, 10) || 12;
    const hashedPassword = await bcrypt.hash(password, rounds);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: userSelect,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return ApiResponse.created(res, {
      token,
      user,
    }, 'Admin registered successfully');
  } catch (error) {
    next(error);
  }
};
