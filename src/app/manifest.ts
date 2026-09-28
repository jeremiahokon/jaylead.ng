/** Web app manifest: the logo mark, the logo's deep green and the bone ground. */
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jaylead AgriEstate',
    short_name: 'Jaylead',
    description:
      'Titled oil-palm farmland in Osun State, planted and managed by Jaylead.',
    start_url: '/',
    display: 'browser',
    background_color: '#f1ecdf',
    theme_color: '#0d3924',
    icons: [
      {
        src: '/brand/jaylead-mark-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/jaylead-mark-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/brand/jaylead-mark-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
