/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    domains: ["picsum.photos", "placehold.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  basePath: "/lechiluan.github.io",
  assetPrefix: "/lechiluan.github.io/",
};

export default nextConfig;