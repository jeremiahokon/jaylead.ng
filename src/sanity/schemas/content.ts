/**
 * Editorial and operational schemas: blog, FAQ, team, departments, videos
 * and leads (brief 5.9 to 5.14). The videoEmbed URL is validated with the
 * same utils.embed.parse the site uses, so a Studio paste either works on the
 * site or is refused here.
 */
import { defineArrayMember, defineField, defineType } from 'sanity';

import { utils } from '@/lib/utils';

import { imageField, richText, seoField, slugField } from './fields';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({ name: 'description', type: 'text', rows: 2 }),
  ],
});

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    slugField('name'),
    defineField({ name: 'role', type: 'string' }),
    imageField('photo', 'Photo'),
  ],
});

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(240),
    }),
    imageField('coverImage', 'Cover image', { required: true, realFlag: true }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'recordedOn',
      title: 'Recorded on (Farm Updates)',
      type: 'date',
    }),
    defineField({
      name: 'recordedAt',
      title: 'Recorded at (place)',
      type: 'string',
      description: 'Label Malete material "Malete, Kwara State".',
    }),
    richText('body', 'Body', true),
    defineField({
      name: 'faq',
      title: 'Post FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string' }),
            defineField({ name: 'answer', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
    seoField,
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'newest',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'coverImage' },
  },
});

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (r) => r.required(),
    }),
    richText('answer', 'Answer'),
    defineField({
      name: 'group',
      type: 'string',
      description:
        'Decides the page: Company and trust → Why us and Contact · Owning a plot → Marketplace and plot pages · Investing → Invest · Realtors → Become a realtor · NYSC → NYSC · Visiting and contact → Contact.',
      options: {
        list: [
          'Company and trust',
          'Owning a plot',
          'Investing in the project',
          'Realtors',
          'NYSC',
          'Visiting and contact',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({
      name: 'showOnHome',
      title: 'Also show on Home',
      type: 'boolean',
      initialValue: false,
      description: 'Home, "07 Questions". Keep it to about six.',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'question', subtitle: 'group' } },
});

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'role', type: 'string' }),
    imageField('photo', 'Photo'),
    defineField({ name: 'bio', type: 'text', rows: 4 }),
    defineField({ name: 'order', type: 'number' }),
  ],
});

export const department = defineType({
  name: 'department',
  title: 'Department',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
});

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Instagram, TikTok or YouTube link',
      type: 'string',
      description:
        'Paste the link (or Instagram’s embed code). Tracking parts like ?igsh= are removed for you.',
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            utils.embed.parse(value as string)
              ? true
              : 'Paste a link to an Instagram post or reel, a TikTok video, or a YouTube video.'
          ),
    }),
    imageField('poster', 'Poster (optional)'),
    defineField({
      name: 'aspect',
      type: 'string',
      options: { list: ['9:16', '4:5', '1:1', '16:9'] },
      initialValue: '9:16',
    }),
    defineField({
      name: 'duration',
      type: 'string',
      description: 'For example 0:26',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      description:
        'What is said or shown. Required when the video has speech: it is the text for people who cannot play video.',
    }),
    defineField({ name: 'publishedOn', type: 'date' }),
    defineField({
      name: 'account',
      type: 'string',
      options: { list: ['brand', 'founder'] },
      initialValue: 'brand',
    }),
    defineField({
      name: 'placements',
      title: 'Show on',
      type: 'array',
      description:
        'Where the video appears. With none, it is only used inside blog posts.',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Home + About: founder story', value: 'founder-story' },
          { title: 'Home: field record (newest two)', value: 'proof-strip' },
          { title: 'Why us: how it works', value: 'how-it-works' },
          { title: 'About: our office', value: 'about-office' },
        ],
      },
    }),
    defineField({
      name: 'relatedPost',
      title: 'Related post',
      type: 'reference',
      to: [{ type: 'post' }],
      weak: true,
      description:
        'Home field record: the card links to this post and uses its title.',
      hidden: ({ document }) =>
        !(document?.placements as string[] | undefined)?.includes(
          'proof-strip'
        ),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'url', media: 'poster' } },
});

export const lead = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          'plot-enquiry',
          'inspection',
          'invest-a',
          'invest-b',
          'realtor',
          'nysc',
          'contact',
          'media',
          'brochure-callback',
          'newsletter',
        ],
      },
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['new', 'contacted', 'closed'] },
      initialValue: 'new',
    }),
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'location', type: 'string', readOnly: true }),
    defineField({ name: 'preferredDate', type: 'date', readOnly: true }),
    defineField({ name: 'plot', type: 'string', readOnly: true }),
    defineField({ name: 'interest', type: 'string', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'experience', type: 'string', readOnly: true }),
    defineField({ name: 'sourcePage', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'newest',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare: ({ name, type, status, createdAt }) => ({
      title: `${name ?? 'Unnamed'} (${type ?? 'lead'})`,
      subtitle: `${status ?? 'new'} · ${createdAt ? new Date(createdAt).toLocaleString('en-GB') : ''}`,
    }),
  },
});
