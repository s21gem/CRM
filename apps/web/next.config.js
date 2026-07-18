/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fonebox/ui', '@fonebox/utils', '@fonebox/types', '@fonebox/config'],
};

module.exports = nextConfig;
