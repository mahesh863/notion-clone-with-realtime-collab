/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['ibrttdntunpreehxvsau.supabase.co'],
  },
};

module.exports = nextConfig;
