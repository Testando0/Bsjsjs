/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isso permite que você use imagens externas (do Replicate) no componente <img /> do Next
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
};

export default nextConfig;
