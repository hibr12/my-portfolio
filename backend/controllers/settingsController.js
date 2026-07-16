import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';

const DEFAULT_SETTINGS = {
  hero: {
    name: 'Hibru Yitayew',
    title: 'Computer Science Student at Bahir Dar University',
    bio: 'I am a passionate Computer Science student focused on building modern web and mobile applications using React, Node.js, and databases.',
    avatar: '/assets/image/hib2.jpg',
    stats: ['Projects', 'Certificates', 'Passionate learner'],
  },
  about: {
    eyebrow: 'About',
    heading: 'Building practical software while learning deeply',
    description: 'I am a Computer Science student at Bahir Dar University with strong interest in full-stack development and mobile app development. I enjoy building real-world applications and solving problems using technology.',
    cards: [
      {
        title: 'Education',
        text: 'Studying core computer science subjects including data structures and algorithms, database systems, software engineering, android app development and web development.',
      },
      {
        title: 'Goals',
        text: 'My goal is to become a capable full-stack developer who can design, build, and maintain reliable applications for real users.',
      },
      {
        title: 'Focus',
        text: 'I am currently improving my React, Node.js, REST API, MySQL, and MongoDB skills through hands-on portfolio projects.',
      },
    ],
  },
  footer: {
    name: 'Hibru Yitayew',
    title: 'Computer Science Student',
    subtitle: 'at Bahir Dar University',
  },
  seo: {
    title: 'Hibru Yitayew | Computer Science Student',
    description: 'Personal portfolio for a Computer Science student focused on full-stack web and mobile app development.',
    keywords: ['portfolio', 'web developer', 'react', 'node.js', 'full-stack'],
  },
  contact: {
    email: '12hibr13@gmail.com',
    phone: '+251 926 673 294',
  },
  social: {
    github: 'https://github.com/hibr12',
    linkedin: '',
    twitter: '',
  },
  navigation: {
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Certificates', href: '#certificates' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};

export const get = async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const result = { ...DEFAULT_SETTINGS };

    settings.forEach((s) => {
      result[s.key] = s.value;
    });

    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getByKey = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });
    const value = setting ? setting.value : DEFAULT_SETTINGS[req.params.key];
    return ApiResponse.success(res, value);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return ApiResponse.success(res, setting.value, 'Settings updated');
  } catch (error) {
    next(error);
  }
};

export const updateMany = async (req, res, next) => {
  try {
    const { settings } = req.body;

    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return ApiResponse.success(res, null, 'Settings updated');
  } catch (error) {
    next(error);
  }
};
