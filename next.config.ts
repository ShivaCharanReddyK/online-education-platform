
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // This is to avoid the 'child_process' error with mongodb
    if (!isServer) {
        config.externals = [
            ...config.externals,
            'mongodb-client-encryption',
            'aws4',
            'kerberos',
            'snappy',
            'snappy/package.json',
            'gcp-metadata',
            'child_process'
        ];
    }
    return config;
  },
};

export default nextConfig;
