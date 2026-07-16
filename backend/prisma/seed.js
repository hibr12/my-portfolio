import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    const bcrypt = (await import('bcryptjs')).default;

    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    await prisma.analytics.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.skillGroup.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, rounds);

    await prisma.user.create({
      data: {
        name: 'Hibru Yitayew',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);

    await prisma.project.createMany({
      data: [
        { title: 'Memory Game', description: 'A two-player memory game built with React, featuring a grid of cards that players flip to find matching pairs, with score tracking and a reset option.', technologies: ['React', 'Node.js'], github: 'https://github.com/hibr12/memorygame.git', demo: 'https://e-learning-platform-bp4t.vercel.app', image: '/assets/image/memorygame.png', order: 0, featured: false },
        { title: 'Online Library System', description: 'CRUD system for managing books and patrons with database integration and clean admin workflows.', technologies: ['React', 'Node.js', 'Express', 'MySQL'], github: 'https://github.com/hibr12/onlinelibrary.git', demo: 'https://onlinelibrary-seven.vercel.app', image: '/assets/image/onlinelibrary.png', order: 1, featured: true },
        { title: 'Bankers Algorithm & CPU Scheduling', description: 'Web-based bankers algorithm and CPU scheduling simulation implementation.', technologies: ['C++', 'Dart', 'HTML'], github: 'https://github.com/hibr12/calculator-app.git', demo: 'https://cpu-scheduling-and-bankers-algorith.vercel.app', image: '/assets/image/calculator.png', order: 2, featured: false },
        { title: 'E-learning UI', description: 'Responsive e-learning frontend with course filtering, reusable cards, and layout design.', technologies: ['React', 'CSS', 'JavaScript'], github: 'https://github.com/hibr12/e-learning-platform-hibrlearn.git', demo: 'https://e-learning-2-livid.vercel.app', image: '/assets/image/e-learning.png', order: 3, featured: false },
        { title: 'Portfolio Website', description: 'Personal portfolio website showcasing skills, certificates, contact details, and projects.', technologies: ['React', 'CSS'], github: 'https://github.com/hibr12/my-portfolio.git', demo: 'https://my-portfolio-mu-rosy-93.vercel.app', order: 4, featured: false },
      ],
    });
    console.log('5 projects seeded');

    await prisma.skillGroup.createMany({
      data: [
        { title: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Flutter'], order: 0 },
        { title: 'Backend', skills: ['Node.js', 'Express'], order: 1 },
        { title: 'Database', skills: ['MongoDB', 'PostgreSQL'], order: 2 },
        { title: 'Tools', skills: ['Git', 'GitHub'], order: 3 },
      ],
    });
    console.log('4 skill groups seeded');

    await prisma.certificate.createMany({
      data: [
        { title: 'React Fundamentals Course Completion', issuer: 'Bit-career Development Center', year: '2025', image: '/assets/image/certeficate1.png', order: 0 },
        { title: 'BDU AI Hackathon Two Days Web Development Challenge', issuer: 'BDU AI Hackathon Center and Faculty of Computing', year: '2025', image: '/assets/image/certeficate2.png', order: 1 },
        { title: 'Programming Fundamentals', issuer: 'UDACITY', year: '2026', image: '/assets/image/certeficate3.jpg', order: 2 },
        { title: 'Android Developer Fundamentals', issuer: 'UDACITY', year: '2026', image: '/assets/image/certeficate4.jpg', order: 3 },
      ],
    });
    console.log('4 certificates seeded');

    await prisma.siteSetting.createMany({
      data: [
        { key: 'hero', value: { name: 'Hibru Yitayew', title: 'Computer Science Student at Bahir Dar University', bio: 'I am a passionate Computer Science student focused on building modern web and mobile applications using React, Node.js, and databases.', avatar: '/assets/image/hib2.jpg', stats: ['Projects', 'Certificates', 'Passionate learner'] } },
        { key: 'seo', value: { title: 'Hibru Yitayew | Computer Science Student', description: 'Personal portfolio for a Computer Science student focused on full-stack web and mobile app development.', keywords: ['portfolio', 'web developer', 'react', 'node.js', 'full-stack'] } },
        { key: 'social', value: { github: 'https://github.com/hibr12', linkedin: '', twitter: '' } },
        { key: 'contact', value: { email: '12hibr13@gmail.com', phone: '+251 926 673 294' } },
      ],
    });
    console.log('4 site settings seeded');

    console.log('Database seeded successfully');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
