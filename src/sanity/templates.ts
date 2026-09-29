/**
 * New-document templates used by the page lists in src/sanity/structure.ts:
 * a question created under a page starts in that page's FAQ group, and a
 * video created under a section starts with that placement ticked.
 */
import type { Template } from 'sanity';

export const templates: Template[] = [
  {
    id: 'faqItem-in-group',
    title: 'Question in this group',
    schemaType: 'faqItem',
    parameters: [{ name: 'group', type: 'string' }],
    value: (params: { group: string }) => ({ group: params.group }),
  },
  {
    id: 'videoEmbed-at',
    title: 'Video in this section',
    schemaType: 'videoEmbed',
    parameters: [{ name: 'placement', type: 'string' }],
    value: (params: { placement: string }) => ({
      placements: [params.placement],
    }),
  },
];
