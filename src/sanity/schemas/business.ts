/**
 * Business schemas: site settings, estates, plots, invest options and the
 * invest page switch, credentials, documents, stats (brief 5.1 to 5.8).
 * Validation rules carry the brief's compliance rules so the Studio refuses
 * content that would break them.
 */
import { defineArrayMember, defineField, defineType } from 'sanity';

import { imageField, richText, seoField, slugField } from './fields';

const templateKeys = [
  'general',
  'brochure',
  'plot',
  'plot-pricing',
  'inspection',
  'office-visit',
  'invest-a',
  'invest-b',
  'invest-compare',
  'realtor',
  'nysc',
  'post',
  'faq',
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'company', title: 'Company', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'whatsapp', title: 'WhatsApp' },
    { name: 'trust', title: 'Payment safety' },
    { name: 'extras', title: 'Extras' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      type: 'string',
      group: 'company',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'legalName',
      type: 'string',
      group: 'company',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rcNumber',
      title: 'RC number',
      type: 'string',
      group: 'company',
    }),
    defineField({ name: 'mission', type: 'text', rows: 3, group: 'company' }),
    defineField({
      name: 'missionShort',
      title: 'Mission (short, for the footer)',
      type: 'string',
      group: 'company',
    }),
    defineField({ name: 'tagline', type: 'string', group: 'company' }),
    defineField({ name: 'positioningLine', type: 'string', group: 'company' }),
    defineField({
      name: 'pricesUpdated',
      title: 'Prices updated',
      type: 'date',
      group: 'company',
      description:
        'Shown as "Prices updated September 2026" next to every price.',
    }),
    defineField({
      name: 'cacVerifyUrl',
      title: 'CAC verification link',
      type: 'url',
      group: 'company',
    }),
    defineField({ name: 'phoneDisplay', type: 'string', group: 'contact' }),
    defineField({
      name: 'phoneE164',
      title: 'Phone (+234 format)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number (digits only)',
      type: 'string',
      group: 'contact',
      validation: (r) => r.regex(/^\d{10,15}$/),
    }),
    defineField({ name: 'email', type: 'string', group: 'contact' }),
    defineField({ name: 'salesEmail', type: 'string', group: 'contact' }),
    defineField({ name: 'hrEmail', type: 'string', group: 'contact' }),
    defineField({ name: 'mediaEmail', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'line1', type: 'string' }),
        defineField({ name: 'landmarkDirections', type: 'string' }),
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'state', type: 'string' }),
        defineField({
          name: 'mapsUrl',
          title: 'Google Maps link',
          type: 'url',
        }),
        imageField('mapImage', 'Static map image'),
        defineField({
          name: 'geo',
          type: 'geopoint',
          description: 'Confirm with the client before filling.',
        }),
      ],
    }),
    defineField({
      name: 'officeHours',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'days', type: 'string' }),
            defineField({
              name: 'opens',
              type: 'string',
              description: '24-hour, e.g. 09:00',
            }),
            defineField({
              name: 'closes',
              type: 'string',
              description: '24-hour, e.g. 17:00',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whatsappReplyNote',
      type: 'string',
      group: 'whatsapp',
    }),
    defineField({
      name: 'whatsappTemplates',
      title: 'WhatsApp message templates',
      type: 'array',
      group: 'whatsapp',
      description: 'Placeholders: {plot} {price} {trees} {title} {date} {page}',
      of: [
        defineArrayMember({
          type: 'object',
          preview: { select: { title: 'label', subtitle: 'message' } },
          fields: [
            defineField({
              name: 'key',
              type: 'string',
              options: { list: templateKeys },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'label', type: 'string' }),
            defineField({
              name: 'message',
              type: 'text',
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'contact',
      description: 'An icon only shows when its link is set.',
      of: [
        defineArrayMember({
          type: 'object',
          preview: { select: { title: 'platform', subtitle: 'url' } },
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  'instagram',
                  'tiktok',
                  'facebook',
                  'linkedin',
                  'youtube',
                  'x',
                ],
              },
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whatsappChannelUrl',
      title: 'WhatsApp Channel link',
      type: 'url',
      group: 'whatsapp',
    }),
    defineField({
      name: 'paymentSafety',
      type: 'object',
      group: 'trust',
      fields: [
        defineField({ name: 'accountName', type: 'string' }),
        defineField({ name: 'bankName', type: 'string' }),
        defineField({ name: 'safetyText', type: 'text', rows: 3 }),
      ],
      description: 'The account number is never shown on the public site.',
    }),
    defineField({
      name: 'announcementBar',
      type: 'object',
      group: 'extras',
      fields: [
        defineField({ name: 'enabled', type: 'boolean', initialValue: false }),
        defineField({ name: 'text', type: 'string' }),
        defineField({ name: 'link', type: 'string' }),
      ],
    }),
    defineField({
      name: 'showFaithValues',
      title: 'Show faith values on About',
      type: 'boolean',
      group: 'extras',
      initialValue: false,
    }),
    defineField({
      name: 'faithValues',
      type: 'array',
      group: 'extras',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({ name: 'reference', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'creedText', type: 'text', group: 'extras' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

export const documentType = defineType({
  name: 'documentType',
  title: 'Title document',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'plainExplanation',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    imageField('sampleImage', 'Redacted sample'),
    defineField({ name: 'order', type: 'number' }),
  ],
});

export const estate = defineType({
  name: 'estate',
  title: 'Estate',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    slugField('name'),
    defineField({
      name: 'hidden',
      title: 'Hide from the site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'state', type: 'string' }),
    defineField({ name: 'lga', title: 'LGA', type: 'string' }),
    defineField({ name: 'town', type: 'string' }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['selling', 'planting', 'producing', 'coming-soon'] },
      initialValue: 'selling',
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    richText(),
    defineField({
      name: 'headlineStats',
      type: 'object',
      fields: [
        defineField({ name: 'totalAcres', type: 'number' }),
        defineField({ name: 'totalTrees', type: 'number' }),
      ],
    }),
    defineField({
      name: 'headlineStatsConfirmed',
      type: 'boolean',
      initialValue: false,
      description: 'Stats render only when this is on.',
    }),
    defineField({
      name: 'palmVariety',
      type: 'string',
      initialValue: 'Supergene',
    }),
    defineField({ name: 'incomeStartYear', type: 'number', initialValue: 3 }),
    defineField({
      name: 'productiveLifeText',
      type: 'string',
      initialValue: '25 to 30 years',
    }),
    defineField({
      name: 'documents',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'documentType' }],
        }),
      ],
    }),
    defineField({
      name: 'timeline',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    imageField('heroImage', 'Hero image', { realFlag: true }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        defineArrayMember({
          ...imageField('image', 'Image', { realFlag: true }),
        }),
      ],
    }),
    defineField({
      name: 'brochure',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({ name: 'mapUrl', type: 'url' }),
    imageField('mapImage', 'Map image'),
    defineField({
      name: 'aerialVideo',
      type: 'reference',
      to: [{ type: 'videoEmbed' }],
    }),
    seoField,
  ],
});

export const plot = defineType({
  name: 'plot',
  title: 'Plot',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: 'estate',
      type: 'reference',
      to: [{ type: 'estate' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sizeLabel',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sizeInAcres',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'trees',
      type: 'number',
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: 'price',
      title: 'Price (naira, numbers only)',
      type: 'number',
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'priceMode',
      type: 'string',
      options: { list: ['fixed', 'from', 'on-request'] },
      initialValue: 'fixed',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['available', 'reserved', 'sold'] },
      initialValue: 'available',
    }),
    defineField({
      name: 'paymentOptions',
      type: 'string',
      initialValue: 'Full payment or instalment plan. Terms shared on enquiry.',
    }),
    imageField('thumbnail', 'Thumbnail', { realFlag: true }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        defineArrayMember({
          ...imageField('image', 'Image', { realFlag: true }),
        }),
      ],
    }),
    defineField({
      name: 'whatsappTemplateKey',
      type: 'string',
      options: { list: templateKeys },
      initialValue: 'plot',
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});

export const investOption = defineType({
  name: 'investOption',
  title: 'Invest option',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      options: { list: ['option-a', 'option-b'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'whoItsFor', type: 'string' }),
    defineField({ name: 'minAmount', type: 'number' }),
    defineField({ name: 'maxAmount', type: 'number' }),
    defineField({ name: 'yearlyRatePercent', type: 'number' }),
    defineField({ name: 'recoveryMultiple', type: 'number' }),
    defineField({ name: 'royaltyRatePercent', type: 'number' }),
    defineField({ name: 'projectLifeYears', type: 'number' }),
    defineField({ name: 'investorCap', type: 'number' }),
    defineField({ name: 'fixedRateText', type: 'string' }),
    defineField({ name: 'termText', type: 'string' }),
    defineField({ name: 'exitText', type: 'string' }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
      description: 'Paragraphs. Never write "guaranteed" or "100%".',
    }),
    defineField({
      name: 'whatsappTemplateKey',
      type: 'string',
      options: { list: templateKeys },
    }),
  ],
});

export const investPage = defineType({
  name: 'investPage',
  title: 'Invest page',
  type: 'document',
  fields: [
    defineField({
      name: 'legalReviewConfirmedOn',
      title: 'Legal / SEC review confirmed on',
      type: 'date',
      description:
        'Fill only once written legal or SEC advice on Option A and B has been received.',
    }),
    defineField({
      name: 'figuresVisible',
      title: 'Show investment figures',
      type: 'boolean',
      initialValue: false,
      description:
        'Off: every percentage and naira figure reads "Terms shared privately by an advisor" and the calculator is hidden.',
      validation: (r) =>
        r.custom((value, ctx) => {
          const doc = ctx.document as
            | { legalReviewConfirmedOn?: string }
            | undefined;

          return value && !doc?.legalReviewConfirmedOn
            ? 'Fill "Legal / SEC review confirmed on" before showing figures.'
            : true;
        }),
    }),
    richText('riskDisclosure', 'Risk disclosure'),
  ],
  preview: { prepare: () => ({ title: 'Invest page' }) },
});

export const credential = defineType({
  name: 'credential',
  title: 'Credential',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short label (trust strip)',
      type: 'string',
    }),
    defineField({ name: 'value', type: 'string' }),
    defineField({ name: 'verifyUrl', type: 'url' }),
    defineField({ name: 'document', type: 'file' }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['shown', 'pending'] },
      initialValue: 'pending',
      description:
        'NAIC and NYSC should stay pending until their document is attached.',
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'status' } },
});

export const stat = defineType({
  name: 'stat',
  title: 'Market stat',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'value',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sourceName',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sourceUrl',
      type: 'url',
      validation: (r) => r.required(),
      description: 'Required. A stat without a source never shows.',
    }),
    defineField({ name: 'sourceDate', type: 'date' }),
  ],
});
