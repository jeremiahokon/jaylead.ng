/**
 * The year for the copyright line, fixed at build/revalidation time so the
 * footer stays static under Cache Components (a bare new Date() would make
 * every page dynamic).
 */
import { cacheLife } from 'next/cache';

export async function buildYear(): Promise<number> {
  'use cache';
  cacheLife('weeks');

  return new Date().getFullYear();
}
