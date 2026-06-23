import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function supabaseImageRemotePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return [];
  }

  try {
    const hostname = new URL(url).hostname;
    return [
      {
        protocol: "https" as const,
        hostname,
        pathname: "/storage/v1/object/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB rejects most phone photos before uploadDailyLogPhotos runs.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: supabaseImageRemotePattern(),
  },
};

export default withNextIntl(nextConfig);
