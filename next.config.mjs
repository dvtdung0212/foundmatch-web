import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/**
 * @param {string} phase
 * @param {NodeJS.ProcessEnv} environment
 * @returns {import('next').NextConfig}
 */
export function createNextConfig(phase, environment = process.env) {
  const localSupabaseUrl = new URL(
    environment.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:55421",
  );

  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: localSupabaseUrl.protocol.slice(0, -1),
          hostname: localSupabaseUrl.hostname,
          port: localSupabaseUrl.port,
          pathname: "/storage/v1/object/public/**",
        },
        {
          protocol: "https",
          hostname: "*.supabase.co",
          pathname: "/storage/v1/object/public/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  };
}

export default (phase) => createNextConfig(phase);
