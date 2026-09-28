/**
 * Shared field builders for the schemas: an image that must carry alt text
 * and says whether it is a real Jaylead photo, the SEO pair, a slug, and
 * the rich-text body used by posts, estates and FAQ answers.
 */
import { defineArrayMember, defineField } from 'sanity';

export const imageField = (
  name: string,
  title: string,
  opts: { required?: boolean; realFlag?: boolean } = {}
) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    validation: opts.required ? (r) => r.required() : undefined,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description:
          'Describe what is really in the picture. Read aloud by screen readers and used by Google.',
        validation: (r) => r.required().max(180),
      }),
      ...(opts.realFlag
        ? [
            defineField({
              name: 'isRealSitePhoto',
              title: 'Real Jaylead photo',
              type: 'boolean',
              description:
                'Untick for stock or AI images. They are shown with the caption "Illustration".',
              initialValue: true,
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ]
        : []),
    ],
  });

export const seoField = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Under 60 characters. Leave empty to use the title.',
      validation: (r) =>
        r.max(70).warning('Long titles get cut off in Google.'),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description:
        '140 to 160 characters. Leave empty to use the summary or excerpt.',
      validation: (r) =>
        r.max(170).warning('Long descriptions get cut off in Google.'),
    }),
  ],
});

export const slugField = (source = 'title') =>
  defineField({
    name: 'slug',
    title: 'URL slug',
    type: 'slug',
    description:
      'Set once. Changing it later breaks links people have already shared.',
    options: { source, maxLength: 80 },
    validation: (r) => r.required(),
  });

export const richText = (name = 'body', title = 'Body', withEmbeds = false) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Paragraph', value: 'normal' },
          { title: 'Heading', value: 'h2' },
          { title: 'Subheading', value: 'h3' },
          { title: 'Quote', value: 'blockquote' },
        ],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            defineArrayMember({
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({
                  name: 'href',
                  type: 'string',
                  title: 'URL or path',
                  validation: (r) => r.required(),
                }),
              ],
            }),
          ],
        },
      }),
      ...(withEmbeds
        ? [
            defineArrayMember({
              ...imageField('image', 'Image', { realFlag: true }),
              type: 'image',
            }),
            defineArrayMember({
              name: 'videoRef',
              type: 'reference',
              title: 'Video',
              to: [{ type: 'videoEmbed' }],
            }),
            defineArrayMember({
              name: 'callout',
              type: 'object',
              title: 'Callout',
              fields: [
                defineField({
                  name: 'text',
                  type: 'text',
                  rows: 3,
                  validation: (r) => r.required(),
                }),
              ],
            }),
          ]
        : []),
    ],
  });
