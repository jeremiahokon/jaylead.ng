/**
 * The Studio desk: singletons first, then the catalogue, content and people,
 * and a Leads view sorted newest first with one list per enquiry type, so
 * the team can work through WhatsApp follow-ups by type.
 */
import type { StructureResolver } from 'sanity/structure';

const leadTypes: [string, string][] = [
  ['plot-enquiry', 'Plot enquiries'],
  ['inspection', 'Site inspections'],
  ['invest-a', 'Invest: Option A'],
  ['invest-b', 'Invest: Option B'],
  ['realtor', 'Realtor applications'],
  ['nysc', 'NYSC'],
  ['contact', 'Contact form'],
  ['media', 'Media'],
  ['brochure-callback', 'Brochure call-backs'],
  ['newsletter', 'Farm updates sign-ups'],
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Jaylead')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('estate').title('Estates'),
      S.documentTypeListItem('plot').title('Plots'),
      S.listItem()
        .title('Invest page')
        .id('investPage')
        .child(S.document().schemaType('investPage').documentId('investPage')),
      S.documentTypeListItem('investOption').title('Invest options'),
      S.documentTypeListItem('credential').title('Credentials'),
      S.documentTypeListItem('documentType').title('Documents'),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.documentTypeListItem('videoEmbed').title('Videos'),
      S.documentTypeListItem('faqItem').title('FAQ'),
      S.documentTypeListItem('stat').title('Market stats'),
      S.divider(),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('department').title('Departments'),
      S.divider(),
      S.listItem()
        .title('Leads')
        .child(
          S.list()
            .title('Leads')
            .items([
              S.listItem()
                .title('All leads, newest first')
                .child(
                  S.documentTypeList('lead')
                    .title('All leads')
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
              S.listItem()
                .title('New (not yet contacted)')
                .child(
                  S.documentList()
                    .title('New leads')
                    .filter('_type == "lead" && status == "new"')
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
              S.divider(),
              ...leadTypes.map(([type, title]) =>
                S.listItem()
                  .title(title)
                  .child(
                    S.documentList()
                      .title(title)
                      .filter('_type == "lead" && type == $type')
                      .params({ type })
                      .defaultOrdering([
                        { field: 'createdAt', direction: 'desc' },
                      ])
                  )
              ),
            ])
        ),
    ]);
