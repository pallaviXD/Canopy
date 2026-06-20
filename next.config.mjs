/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker / Cloud Run deployments
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
