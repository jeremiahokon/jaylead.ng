/**
 * The Studio desk, organised by page: each page lists exactly the documents
 * that feed it, in the order they appear, so an editor can answer "what can
 * I change on this page?" from the sidebar. Everything is also listed once
 * by type under "All content", and leads sit at the bottom as one board:
 * New, Contacted, Closed, newest first.
 *
 * Keep in step with the routes in src/app/(site) and with
 * src/sanity/presentation.ts. Filtered lists create documents through the
 * templates in src/sanity/templates.ts, so a new FAQ under "Invest" is
 * already in the Investing group.
 */
import type {
  ListItemBuilder,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure';

import type { FaqGroup, VideoPlacement } from '@/lib/types';

/** Structure ids allow letters, digits, - and _ only (no "/" or spaces). */
const idOf = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'home';

const singleton = (
  S: StructureBuilder,
  type: string,
  title: string
): ListItemBuilder =>
  S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

const faqs = (S: StructureBuilder, group: FaqGroup) =>
  S.listItem()
    .title(`Questions: ${group}`)
    .id(`faq-${idOf(group)}`)
    .schemaType('faqItem')
    .child(
      S.documentTypeList('faqItem')
        .title(group)
        .filter('_type == "faqItem" && group == $group')
        .params({ group })
        .defaultOrdering([{ field: 'order', direction: 'asc' }])
        .initialValueTemplates([
          S.initialValueTemplateItem('faqItem-in-group', { group }),
        ])
    );

const videos = (
  S: StructureBuilder,
  placement: VideoPlacement,
  title: string
) =>
  S.listItem()
    .title(title)
    .id(`videos-${placement}`)
    .schemaType('videoEmbed')
    .child(
      S.documentTypeList('videoEmbed')
        .title(title)
        .filter('_type == "videoEmbed" && $placement in placements')
        .params({ placement })
        .defaultOrdering([{ field: 'publishedOn', direction: 'desc' }])
        .initialValueTemplates([
          S.initialValueTemplateItem('videoEmbed-at', { placement }),
        ])
    );

const typeList = (S: StructureBuilder, type: string, title: string) =>
  S.documentTypeListItem(type).title(title);

const page = (
  S: StructureBuilder,
  title: string,
  path: string,
  items: ListItemBuilder[]
) =>
  S.listItem()
    .title(title)
    .id(`page-${idOf(path)}`)
    .child(S.list().title(`${title} (${path})`).items(items));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Jaylead')
    .items([
      singleton(S, 'siteSettings', 'Site settings (every page)'),
      S.divider(),

      page(S, 'Home', '/', [
        typeList(S, 'plot', 'Plots: the offer and "From ₦…" price'),
        videos(S, 'proof-strip', 'Field record videos'),
        videos(S, 'founder-story', 'Founder video'),
        S.listItem()
          .title('Questions shown on Home')
          .id('faq-home')
          .schemaType('faqItem')
          .child(
            S.documentTypeList('faqItem')
              .title('Shown on Home')
              .filter('_type == "faqItem" && showOnHome == true')
              .defaultOrdering([{ field: 'order', direction: 'asc' }])
          ),
        typeList(S, 'stat', 'Market stats'),
        typeList(S, 'post', 'Latest from the farm (posts)'),
      ]),

      page(S, 'Marketplace', '/marketplace', [
        typeList(S, 'estate', 'Palm Grove Estate'),
        typeList(S, 'plot', 'Plots and prices'),
        typeList(S, 'documentType', 'Title documents'),
        faqs(S, 'Owning a plot'),
      ]),

      page(S, 'Why us', '/why-us', [
        typeList(S, 'credential', 'Credentials'),
        videos(S, 'how-it-works', 'How it works video'),
        faqs(S, 'Company and trust'),
      ]),

      page(S, 'About', '/about', [
        typeList(S, 'teamMember', 'Leadership (team)'),
        typeList(S, 'department', 'Departments'),
        videos(S, 'founder-story', 'Our story video'),
        videos(S, 'about-office', 'Office videos'),
      ]),

      page(S, 'Invest', '/invest', [
        singleton(S, 'investPage', 'Figures switch and risk disclosure'),
        typeList(S, 'investOption', 'Options A and B'),
        faqs(S, 'Investing in the project'),
      ]),

      page(S, 'Become a realtor', '/become-a-realtor', [faqs(S, 'Realtors')]),

      page(S, 'NYSC', '/nysc', [
        typeList(S, 'credential', 'NYSC accreditation (credential)'),
        typeList(S, 'department', 'Departments'),
        faqs(S, 'NYSC'),
      ]),

      page(S, 'Contact', '/contact', [
        faqs(S, 'Visiting and contact'),
        faqs(S, 'Company and trust'),
      ]),

      page(S, 'Blog', '/blog', [
        typeList(S, 'post', 'Posts'),
        typeList(S, 'category', 'Categories'),
        typeList(S, 'author', 'Authors'),
      ]),

      S.divider(),

      S.listItem()
        .title('All content, by type')
        .id('all-content')
        .child(
          S.list()
            .title('All content')
            .items([
              typeList(S, 'estate', 'Estates'),
              typeList(S, 'plot', 'Plots'),
              typeList(S, 'documentType', 'Title documents'),
              typeList(S, 'investOption', 'Invest options'),
              typeList(S, 'credential', 'Credentials'),
              typeList(S, 'post', 'Posts'),
              typeList(S, 'category', 'Categories'),
              typeList(S, 'author', 'Authors'),
              typeList(S, 'videoEmbed', 'Videos'),
              typeList(S, 'faqItem', 'FAQ'),
              typeList(S, 'stat', 'Market stats'),
              typeList(S, 'teamMember', 'Team'),
              typeList(S, 'department', 'Departments'),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Leads')
        .id('leads')
        .child(
          S.list()
            .title('Leads')
            .items([
              ...(
                [
                  ['new', 'New: reply to these'],
                  ['contacted', 'Contacted'],
                  ['closed', 'Closed'],
                ] as const
              ).map(([status, title]) =>
                S.listItem()
                  .title(title)
                  .id(`leads-${status}`)
                  .child(
                    S.documentList()
                      .title(title)
                      .filter('_type == "lead" && status == $status')
                      .params({ status })
                      .defaultOrdering([
                        { field: 'createdAt', direction: 'desc' },
                      ])
                  )
              ),
              S.divider(),
              S.listItem()
                .title('All leads, newest first')
                .id('leads-all')
                .child(
                  S.documentTypeList('lead')
                    .title('All leads')
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
            ])
        ),
    ]);
