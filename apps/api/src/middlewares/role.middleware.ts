import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '@prisma/client';

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.user.role === Role.SUPER_ADMIN) {
      return next(); // Super admin bypass
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
