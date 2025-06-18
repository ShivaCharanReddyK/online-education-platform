
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
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side bundle, exclude modules that are Node.js specific
      // or optional dependencies of mongodb that cause issues.
      // Ensure config.externals is an array to push new externals.
      // If config.externals is undefined or not an array, initialize it.
      if (!Array.isArray(config.externals)) {
        config.externals = config.externals ? [config.externals] : [];
      }
      
      config.externals.push(
        // This module uses 'child_process', so making it external for client bundle.
        'mongodb-client-encryption',
        // Other optional native dependencies of mongodb that can cause issues if not used.
        'kerberos',
        'snappy',
        'bson-ext',
        // For AWS IAM authentication which might be pulled in
        'aws4',
        '@aws-sdk/credential-providers'
      );

      // Fallbacks for Node.js core modules if direct imports are attempted in client code.
      // This effectively tells webpack that these modules don't exist in the browser.
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
