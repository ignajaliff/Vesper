import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Al conectar Supabase Storage, descomentar y completar el host del proyecto:
    // remotePatterns: [
    //   { protocol: "https", hostname: "<project-id>.supabase.co", pathname: "/storage/v1/object/public/**" },
    // ],
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
