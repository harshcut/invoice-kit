/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['iconv-lite'] = false;
    return config;
  },
};

module.exports = nextConfig;
