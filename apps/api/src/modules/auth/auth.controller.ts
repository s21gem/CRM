import { Request, Response } from 'express';
import { AuthService, loginSchema } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { config } from '@fonebox/config';
import { ApiResponse } from '@fonebox/types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: 'Invalid input', error: parsed.error.message } as ApiResponse);
      }

      const meta = { ipAddress: req.ip, userAgent: req.headers['user-agent'] };
      const { user, tokens, session } = await AuthService.login(parsed.data, meta);

      // Set cookie for Future HttpOnly, and also return for client storage depending on frontend strategy
      res.cookie(config.auth.cookieName, tokens.accessToken, {
        httpOnly: true,
        secure: config.env === 'production',
        domain: config.auth.cookieDomain,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 mins
      });

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
          },
          accessToken: tokens.accessToken, // Kept here so frontend has options
          refreshToken: tokens.refreshToken,
          session: {
            id: session.id,
            userId: session.userId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            lastActivity: session.lastActivity,
            expiresAt: session.expiresAt
          }
        }
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message } as ApiResponse);
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      if (req.sessionId && req.user) {
        const meta = { ipAddress: req.ip, userAgent: req.headers['user-agent'] };
        await AuthService.logout(req.sessionId, req.user.id, meta);
      }

      res.clearCookie(config.auth.cookieName);
      return res.status(200).json({ success: true, message: 'Logged out successfully' } as ApiResponse);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Internal server error' } as ApiResponse);
    }
  }

  static async me(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const response: ApiResponse = {
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        permissions: req.user.permissions,
      }
    };
    return res.status(200).json(response);
  }
}
