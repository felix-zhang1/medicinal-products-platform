import type { Config } from "@react-router/dev/config";

// Import Vercel preset for React Router + Vite builds
// It configures output paths and SSR settings for Vercel deployment
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,

  // Apply Vercel build preset for correct SSR deployment on Vercel platform
  presets: [vercelPreset()],
} satisfies Config;
