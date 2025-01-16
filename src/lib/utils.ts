import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const commitCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

export const fetchWithCache = async (url: string, cacheTime = 5 * 60 * 1000) => {
  const cached = commitCache.get(url);
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }

  const response = await fetch(url);
  const data = await response.json();
  
  commitCache.set(url, {
    data,
    timestamp: Date.now()
  });

  return data;
};