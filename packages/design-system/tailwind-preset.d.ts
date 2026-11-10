/**
 * The preset is plain CommonJS so Tailwind's config loader can read it without
 * a build step. The shape is intentionally loose here; consumers cast it to
 * Tailwind's `Config` when composing their own config.
 */
declare const preset: {
  darkMode?: unknown;
  theme?: Record<string, unknown>;
  plugins?: unknown[];
};
export default preset;
