/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/DanilAgafonov/aws-cli-ai",
        permanent: false,
      },
    ];
  },
};
