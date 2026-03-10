import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a deterministic pastel color based on a string.
 * High lightness and medium saturation ensure it looks good on light/glass themes.
 */
export function stringToPastelColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Keep hue between 0 and 360
  const h = Math.abs(hash) % 360;
  // Saturation between 60% and 80%
  const s = 60 + (Math.abs(hash) % 20);
  // Lightness between 80% and 90%
  const l = 80 + (Math.abs(hash) % 10);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Gets a slightly darker text color for the pastel background
 */
export function stringToDarkColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 30%)`;
}
