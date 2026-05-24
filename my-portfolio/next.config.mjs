// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // disables ESLint errors blocking build
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//     ],
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/Susan_Adhikari_CV_v3.pdf",
//         destination: "/Susan_Adhikari_CV_v3.pdf",
//       },
//       {
//         source: '/api/:path*',
//         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/Susan_Adhikari_CV_v3.pdf",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
          {
            key: "Content-Disposition",
            value: "inline; filename=Susan_Adhikari_CV_v3.pdf",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;