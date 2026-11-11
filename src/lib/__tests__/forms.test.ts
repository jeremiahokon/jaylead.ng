import { describe, expect, it } from 'vitest';

import { schemas, whatsappFor } from '@/lib/forms/schema';

const base = {
  name: 'Ada Obi',
  phone: '0803 123 4567',
  email: '',
  basedIn: 'In Nigeria',
};

describe('enquiry form', () => {
  it('accepts a buyer with every question answered', () => {
    const r = schemas.enquiry.safeParse({
      ...base,
      goal: 'Own a plot',
      landSize: '1 Acre',
      timeline: 'This month',
    });

    expect(r.success).toBe(true);
    expect(r.data?.phone).toBe('+2348031234567');
  });

  it('flags every unanswered question on the first submit', () => {
    const r = schemas.enquiry.safeParse({ name: '', phone: '', email: '' });
    const paths = r.error?.issues.map((i) => i.path[0]);

    expect(paths).toEqual(
      expect.arrayContaining([
        'goal',
        'landSize',
        'timeline',
        'basedIn',
        'name',
        'phone',
      ])
    );
  });

  it('skips land and timing for a realtor, dropping preselected answers', () => {
    const r = schemas.enquiry.safeParse({
      ...base,
      goal: 'Become a realtor',
      landSize: '1 Acre',
    });

    expect(r.success).toBe(true);
    expect(r.data?.landSize).toBeUndefined();
  });

  it('keeps a visit date only for a visit', () => {
    const answers = {
      ...base,
      landSize: '1 Hectare',
      timeline: 'Later this year',
      preferredDate: '2026-12-20',
    };

    expect(
      schemas.enquiry.parse({ ...answers, goal: 'Visit the farm' })
        .preferredDate
    ).toBe('2026-12-20');
    expect(
      schemas.enquiry.parse({ ...answers, goal: 'Own a plot' }).preferredDate
    ).toBe('');
  });

  it('takes a diaspora number', () => {
    const r = schemas.enquiry.parse({
      ...base,
      basedIn: 'Outside Nigeria',
      phone: '+44 7700 900123',
      goal: 'Invest: Option A',
      landSize: 'Not sure yet',
      timeline: 'Just exploring',
    });

    expect(r.phone).toBe('+447700900123');
  });

  it('picks the WhatsApp message from the answers', () => {
    expect(whatsappFor('Own a plot', '1 Hectare')).toEqual({
      key: 'plot',
      plot: '1 Hectare plot',
    });
    expect(whatsappFor('Own a plot', 'Not sure yet').key).toBe('brochure');
    expect(whatsappFor('Visit the farm', '1 Acre').key).toBe('inspection');
    expect(whatsappFor('Invest: Option B').key).toBe('invest-b');
    expect(whatsappFor('Become a realtor').key).toBe('realtor');
    expect(whatsappFor(undefined).key).toBe('general');
  });
});
