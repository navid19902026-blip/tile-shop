import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Next.js's webpack bundling breaks ws's optional bufferutil/utf-8-validate
  // fallback (require() gets statically resolved to an empty stub instead of
  // throwing, so ws's try/catch never falls back to its pure-JS path). These
  // packages need to stay real Node.js requires at runtime.
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless", "ws", "bufferutil", "utf-8-validate"],
  },
};

export default withNextIntl(nextConfig);
