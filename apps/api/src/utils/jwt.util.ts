import jwt from 'jsonwebtoken';
import { config } from '@fonebox/config';

export interface JwtPayload {
  userId: string;
  role: string;
  sessionId: string;
}

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(payload, config.auth.jwtRefreshSecret, {
    expiresIn: config.auth.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.auth.jwtRefreshSecret) as JwtPayload;
};
