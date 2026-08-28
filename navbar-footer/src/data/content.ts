import type { Content } from "@/lib/types";
import generated from "./generated/content.json";

/**
 * Homepage content, extracted from the static mirror at build time.
 * Regenerate with `npm run extract` after changing the mirror.
 */
export const content = generated as unknown as Content;

export default content;
