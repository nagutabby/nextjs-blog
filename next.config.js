/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    loader: 'custom'
  },
}

module.exports = nextConfig
