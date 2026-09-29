/**
 * Tells the Studio's Presentation tool which page each document appears on,
 * so opening a document shows "Used on" links, and browsing the preview opens
 * the document behind the page. Keep in step with the routes in src/app/(site).
 */
import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';

const home = { title: 'Home', href: '/' };
const marketplace = { title: 'Marketplace', href: '/marketplace' };
const whyUs = { title: 'Why Us', href: '/why-us' };
const about = { title: 'About', href: '/about' };
const blog = { title: 'Blog', href: '/blog' };
const invest = { title: 'Invest', href: '/invest' };
const contact = { title: 'Contact', href: '/contact' };
const nysc = { title: 'NYSC', href: '/nysc' };
const realtor = { title: 'Become a realtor', href: '/become-a-realtor' };

/** Documents with no page of their own, listed with the pages that show them. */
const shownOn = (...locations: { title: string; href: string }[]) =>
  defineLocations({ locations });

/** The pages each FAQ group appears on (see the FaqItem `group` field). */
const faqPages: Record<string, { title: string; href: string }[]> = {
  'Company and trust': [whyUs, contact],
  'Owning a plot': [marketplace],
  'Investing in the project': [invest],
  Realtors: [realtor],
  NYSC: [nysc],
  'Visiting and contact': [contact],
};

/** The pages each video placement appears on. */
const videoPages: Record<string, { title: string; href: string }[]> = {
  'founder-story': [home, about],
  'proof-strip': [home],
  'how-it-works': [whyUs],
  'about-office': [about],
};

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/blog/:slug',
      filter: `_type == "post" && slug.current == $slug`,
    },
    {
      route: '/blog/category/:slug',
      filter: `_type == "category" && slug.current == $slug`,
    },
    {
      route: '/marketplace/:slug',
      filter: `_type == "plot" && slug.current == $slug`,
    },
    { route: '/marketplace', filter: `_type == "estate"` },
    { route: '/invest', filter: `_id == "investPage"` },
  ]),

  locations: {
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {
                  title: doc.title || 'Untitled post',
                  href: `/blog/${doc.slug}`,
                },
                blog,
              ],
            }
          : null,
    }),
    category: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {
                  title: doc.title || 'Category',
                  href: `/blog/category/${doc.slug}`,
                },
                blog,
              ],
            }
          : null,
    }),
    plot: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {
                  title: doc.title || 'Plot',
                  href: `/marketplace/${doc.slug}`,
                },
                marketplace,
                home,
              ],
            }
          : null,
    }),
    estate: shownOn(marketplace, home, whyUs),
    investPage: shownOn(invest, {
      title: 'Risk disclosure',
      href: '/legal/risk-disclosure',
    }),
    investOption: shownOn(invest),
    siteSettings: shownOn(home, contact, about),
    faqItem: defineLocations({
      select: { group: 'group', showOnHome: 'showOnHome' },
      resolve: (doc) => ({
        locations: [
          ...(doc?.showOnHome
            ? [{ title: 'Home: questions', href: '/#questions' }]
            : []),
          ...(faqPages[doc?.group as string] ?? []),
        ],
      }),
    }),
    videoEmbed: defineLocations({
      select: { placements: 'placements' },
      resolve: (doc) => {
        const pages = ((doc?.placements as string[] | undefined) ?? []).flatMap(
          (p) => videoPages[p] ?? []
        );

        return {
          locations: pages.length
            ? [...new Map(pages.map((l) => [l.href, l])).values()]
            : [blog],
        };
      },
    }),
    credential: shownOn(home, whyUs, nysc, marketplace),
    documentType: shownOn(marketplace),
    stat: shownOn(home),
    teamMember: shownOn(about),
    department: shownOn(about, nysc, home),
    author: shownOn(blog),
  },
};
