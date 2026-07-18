import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '@fonebox/types';

export const requirePermission = (action: string, resource: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.user.role === Role.SUPER_ADMIN) {
      return next(); // Super admin bypass
    }

    const hasPermission = req.user.permissions.some(
      (p: any) => p.action === action && p.resource === resource
    );

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
