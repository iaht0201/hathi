/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "picsum.photos",
      "vn4u.vn",
      "beco.vn",
      "drive.google.com",
      "pub-a0b631c4fd82477f902622125e9b99d3.r2.dev",
    ],
  },
};
module.exports = nextConfig;
