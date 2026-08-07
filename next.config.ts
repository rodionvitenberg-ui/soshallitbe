import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Static assets (engine.js, lusion.css, models, textures) live in /public.
 * No bundling of the production engine — it is a patched vendor module script.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
