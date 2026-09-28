/**
 * The primary navigation (brief 7.1): seven direct links. Invest goes
 * straight to /invest (the owner removed the dropdown; the page itself opens
 * with "own a plot or fund the project").
 */
export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Invest', href: '/invest' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Become a Realtor', href: '/become-a-realtor' },
  { label: 'Contact', href: '/contact' },
];
