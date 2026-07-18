import { PrismaClient, AuthEvent } from '@prisma/client';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateTokens } from '../../utils/jwt.util';
import crypto from 'crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthService {
  static async login(data: z.infer<typeof loginSchema>, meta: { ipAddress?: string; userAgent?: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.isActive) {
      if (user) {
        await this.logEvent(user.id, AuthEvent.LOGIN_FAILED, meta);
      }
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      await this.logEvent(user.id, AuthEvent.LOGIN_FAILED, meta);
      throw new Error('Invalid credentials');
    }

    // Generate sessionId
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomBytes(32).toString('hex'), // Internal unique tracking
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    const tokens = generateTokens({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    });

    // Store hashed refresh token
    const hashedToken = await hashPassword(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    await this.logEvent(user.id, AuthEvent.LOGIN_SUCCESS, meta);

    return { user, tokens, session };
  }

  static async logout(sessionId: string, userId: string, meta: { ipAddress?: string; userAgent?: string }) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true }
    });

    // We can also revoke active refresh tokens for the user here if required, or keep it per session.
    // For simplicity, we just revoke the session.
    
    await this.logEvent(userId, AuthEvent.LOGOUT, meta);
  }

  static async logEvent(userId: string | null, event: AuthEvent, meta: { ipAddress?: string; userAgent?: string; details?: string }) {
    await prisma.auditLog.create({
      data: {
        userId,
        event,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: meta.details,
      }
    });
  }
}
