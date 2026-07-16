import prisma from '../config/prisma.js';
import ApiResponse from '../utils/ApiResponse.js';

export const track = async (req, res, next) => {
  try {
    const {
      visitorId,
      browser,
      os,
      device,
      screen,
      language,
      referrer,
      landingPage,
      events,
      isReturning,
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newEvents = events || [];

    const existing = await prisma.analytics.findUnique({
      where: { visitorId_date: { visitorId, date: today } },
    });

    let session;

    if (existing) {
      const mergedEvents = [...(existing.events || []), ...newEvents];
      session = await prisma.analytics.update({
        where: { id: existing.id },
        data: { events: mergedEvents },
      });
    } else {
      session = await prisma.analytics.create({
        data: {
          visitorId,
          date: today,
          browser: browser || null,
          os: os || null,
          device: device || null,
          screen: screen || null,
          language: language || null,
          referrer: referrer || null,
          landingPage: landingPage || null,
          isReturning: isReturning || false,
          events: newEvents,
        },
      });
    }

    return ApiResponse.success(res, session);
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const { visitorId, sessionDuration, scrollDepth } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.updateMany({
      where: {
        visitorId,
        date: { gte: today },
      },
      data: {
        sessionDuration: sessionDuration || 0,
        scrollDepth: scrollDepth || 0,
      },
    });

    return ApiResponse.success(res, null, 'Session updated');
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days, 10));
    startDate.setHours(0, 0, 0, 0);

    const totalVisitors = await prisma.analytics.count({
      where: { date: { gte: startDate } },
    });

    const allVisits = await prisma.analytics.findMany({
      where: { date: { gte: startDate } },
      select: { date: true, browser: true, device: true, events: true, isReturning: true, sessionDuration: true },
      orderBy: { date: 'asc' },
    });

    const dailyVisitsMap = {};
    const browserMap = {};
    const deviceMap = {};
    const pageMap = {};
    let returningVisitors = 0;
    let totalDuration = 0;

    for (const visit of allVisits) {
      const dateStr = visit.date.toISOString().split('T')[0];
      dailyVisitsMap[dateStr] = (dailyVisitsMap[dateStr] || 0) + 1;

      if (visit.browser) browserMap[visit.browser] = (browserMap[visit.browser] || 0) + 1;
      if (visit.device) deviceMap[visit.device] = (deviceMap[visit.device] || 0) + 1;

      if (visit.isReturning) returningVisitors++;

      totalDuration += visit.sessionDuration || 0;

      const eventsArray = Array.isArray(visit.events) ? visit.events : [];
      for (const event of eventsArray) {
        if (event && event.type === 'pageview' && event.page) {
          pageMap[event.page] = (pageMap[event.page] || 0) + 1;
        }
      }
    }

    const dailyVisits = Object.entries(dailyVisitsMap)
      .map(([date, visitors]) => ({ _id: date, visitors }))
      .sort((a, b) => a._id.localeCompare(b._id));

    const browserStats = Object.entries(browserMap)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count);

    const deviceStats = Object.entries(deviceMap)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count);

    const topPages = Object.entries(pageMap)
      .map(([page, count]) => ({ _id: page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return ApiResponse.success(res, {
      totalVisitors,
      returningVisitors,
      newVisitors: totalVisitors - returningVisitors,
      avgSessionDuration: totalVisitors > 0 ? Math.round(totalDuration / totalVisitors) : 0,
      dailyVisits,
      browserStats,
      deviceStats,
      topPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getVisitors = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const total = await prisma.analytics.count();
    const visitors = await prisma.analytics.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      take: parseInt(limit, 10),
    });

    return ApiResponse.paginated(res, visitors, total, parseInt(page, 10), parseInt(limit, 10));
  } catch (error) {
    next(error);
  }
};
