export const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-for-dev-only',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-for-dev-only',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
    cookieName: 'fbcrm_session',
    cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
  }
};
