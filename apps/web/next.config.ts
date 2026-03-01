import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
// import remarkGfm from 'remark-gfm'
// import removeImportsF from "next-remove-imports";
// const removeImports = removeImportsF();
// const removeImports = require('next-remove-imports')();

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  // reactStrictMode: false, // 开发下关，生产默认开
  reactCompiler: true, // 自动处理 memoization（记忆化）, 减少不必要的重新渲染(react 的机制是 ui = f(state), 因此 state 变化时, ui 会变化, ui 包括 被嵌套的 ui, 因此相当于 子组件 会跟着重新渲染), 不用手动写 useMemo, useCallback, React.memo 等优化代码

  // pageExtensions: ["js", "jsx",  "ts", "tsx"],
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // 在客户端打包时不包含这些Node.js模块
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       dns: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "raw.githubusercontent.com",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "cdn.modrinth.com",
      },
      {
        hostname: "pub-c119a9293e98420d82099567e7ecd825.r2.dev",
      },
      {
        hostname: "heroui.com",
      },
      {
        hostname: "ui-avatars.com",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     // {
  //     //   source: "/api/py/:path*",
  //     //   destination: isProd
  //     //     ? "https://api.nahida-aa.us.kg/api/py/:path*" // 代理到外部 API
  //     //     : "http://127.0.0.1:8000/api/py/:path*",
  //     // },
  //     {
  //       source: "/api/:path*",
  //       destination: isProd
  //         ? "https://api.nahida-aa.us.kg/api/:path*" // 代理到外部 API
  //         : "http://127.0.0.1:3333/api/:path*",
  //     },
  //   ];
  // },
  // redirects: async () => [
  //   {
  //     source: '/',
  //     destination: '/openapi',
  //     permanent: true,
  //   },
  // ],
  // output: "standalone", // 会输出 一个 server.js , standalone模式不能和 custom server 一起用
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      // Without options
      // remarkGfm,
      "remark-gfm",
      // With options
      // ['remark-toc', { heading: 'The Table' }],
    ],
    rehypePlugins: [
      // Without options
      // "rehype-slug",
      // With options
      // ['rehype-katex', { strict: true, throwOnError: true }],
    ],
  },
});

const withNextIntl = createNextIntlPlugin();
// Merge MDX config with Next.js config
export default withNextIntl(withMDX(nextConfig));
