import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: any;
  sessionId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.fbcrm_session || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const payload = verifyAccessToken(token);

    // Verify session isn't revoked
    const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
    if (!session || session.isRevoked) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Session revoked' });
    }

    // Load full user context for RBAC
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { permissions: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found or inactive' });
    }

    // Update last activity asynchronously
    prisma.session.update({
      where: { id: payload.sessionId },
      data: { lastActivity: new Date() }
    }).catch(err => console.error('Failed to update session activity', err));

    req.user = user;
    req.sessionId = payload.sessionId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};
