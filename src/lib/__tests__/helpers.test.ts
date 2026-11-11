import { describe, expect, it } from 'vitest';

import { utils } from '@/lib/utils';

describe('utils.format.naira', () => {
  it('groups whole naira with no kobo', () => {
    expect(utils.format.naira(4_000_000)).toBe('₦4,000,000');
    expect(utils.format.naira(10_000_000)).toBe('₦10,000,000');
    expect(utils.format.naira(500_000.6)).toBe('₦500,001');
    expect(utils.format.naira(0)).toBe('₦0');
  });
});

describe('utils.format.hours', () => {
  const weekdays = [
    { days: 'Monday to Friday', opens: '09:00', closes: '17:00' },
  ];

  it('reads the office hours from Site settings', () => {
    expect(utils.format.hours(weekdays)).toBe('Monday to Friday, 9am to 5pm');
    expect(utils.format.hours(weekdays, { short: true })).toBe(
      'Mon to Fri, 9am to 5pm'
    );
  });

  it('keeps minutes, joins several rows and skips incomplete ones', () => {
    expect(
      utils.format.hours([
        ...weekdays,
        { days: 'Saturday', opens: '10:30', closes: '12:00' },
        { days: 'Sunday', opens: '', closes: '' },
      ])
    ).toBe('Monday to Friday, 9am to 5pm; Saturday, 10:30am to 12pm');
  });
});

describe('utils.invest.optionASchedule', () => {
  const terms = {
    yearlyRatePercent: 40,
    recoveryMultiple: 2,
    royaltyRatePercent: 5,
    projectLifeYears: 30,
  };

  it('matches the brief worked example (D11)', () => {
    const s = utils.invest.optionASchedule(10_000_000, terms);

    expect(s.recoveryYears).toEqual(
      [1, 2, 3, 4, 5].map((year) => ({ year, payout: 4_000_000 }))
    );
    expect(s.royaltyFromYear).toBe(6);
    expect(s.royaltyPerYear).toBe(500_000);
  });

  it('pays only the remainder in an uneven final year', () => {
    const s = utils.invest.optionASchedule(10_000_000, {
      ...terms,
      yearlyRatePercent: 30,
    });

    expect(s.recoveryYears.map((y) => y.payout)).toEqual([
      3_000_000, 3_000_000, 3_000_000, 3_000_000, 3_000_000, 3_000_000,
      2_000_000,
    ]);
    expect(s.recoveryYears.reduce((a, y) => a + y.payout, 0)).toBe(20_000_000);
    expect(s.royaltyFromYear).toBe(8);
  });

  it('has no royalty year when recovery fills the project life', () => {
    expect(
      utils.invest.optionASchedule(1_000_000, { ...terms, projectLifeYears: 5 })
        .royaltyFromYear
    ).toBeNull();
  });
});

describe('utils.embed.parse', () => {
  it('canonicalises Instagram reels and strips tracking', () => {
    expect(
      utils.embed.parse(
        'https://www.instagram.com/reel/DdJx-XQqgvp/?igsh=abc123&utm_source=x'
      )
    ).toMatchObject({
      platform: 'instagram',
      id: 'DdJx-XQqgvp',
      canonicalUrl: 'https://www.instagram.com/reel/DdJx-XQqgvp/',
      embedUrl: 'https://www.instagram.com/reel/DdJx-XQqgvp/embed/',
    });
    expect(
      utils.embed.parse('instagram.com/reels/ABC_123/')?.canonicalUrl
    ).toBe('https://www.instagram.com/reel/ABC_123/');
    expect(utils.embed.parse('https://instagram.com/tv/XYZ/')?.kind).toBe(
      'reel'
    );
    expect(
      utils.embed.parse('https://www.instagram.com/p/Ddbzw99Khdg/')
        ?.canonicalUrl
    ).toBe('https://www.instagram.com/p/Ddbzw99Khdg/');
  });

  it('reads the permalink out of a pasted blockquote', () => {
    const code =
      '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DZMkHQTKNWE/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>';

    expect(utils.embed.parse(code)?.id).toBe('DZMkHQTKNWE');
  });

  it('parses TikTok and YouTube', () => {
    expect(
      utils.embed.parse(
        'https://www.tiktok.com/@jaylead_ng/video/7684617902401588500?lang=en'
      )
    ).toMatchObject({
      platform: 'tiktok',
      id: '7684617902401588500',
      embedUrl: 'https://www.tiktok.com/embed/v2/7684617902401588500',
    });
    expect(utils.embed.parse('https://youtu.be/dQw4w9WgXcQ?si=zz')?.id).toBe(
      'dQw4w9WgXcQ'
    );
    expect(
      utils.embed.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3')?.id
    ).toBe('dQw4w9WgXcQ');
    expect(
      utils.embed.parse('https://youtube.com/shorts/dQw4w9WgXcQ')?.embedUrl
    ).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1');
  });

  it('rejects anything else', () => {
    expect(utils.embed.parse('')).toBeNull();
    expect(
      utils.embed.parse('https://scontent.cdninstagram.com/v/t51/abc.mp4')
    ).toBeNull();
    expect(utils.embed.parse('https://example.com/reel/abc')).toBeNull();
  });
});

describe('utils.contact', () => {
  it('fills placeholders and encodes', () => {
    const msg = utils.contact.fillTemplate(
      "I'm interested in the {plot} ({price}, {trees} trees) at Palm Grove Estate.",
      {
        plot: '1 Acre plot',
        price: '₦4,000,000',
        trees: '60',
      }
    );

    expect(msg).toBe(
      "I'm interested in the 1 Acre plot (₦4,000,000, 60 trees) at Palm Grove Estate."
    );
    expect(utils.contact.whatsappLink('+234 916 099 2539', 'Hi there')).toBe(
      'https://wa.me/2349160992539?text=Hi%20there'
    );
  });

  it('normalises Nigerian and international phone numbers', () => {
    const n = utils.contact.normalisePhone;

    expect(n('0803 123 4567')).toBe('+2348031234567');
    expect(n('803 123 4567')).toBe('+2348031234567');
    expect(n('+234 803 123 4567')).toBe('+2348031234567');
    expect(n('00234 803 123 4567')).toBe('+2348031234567');
    expect(n('+44 7700 900123')).toBe('+447700900123');
    expect(n('001 415 555 0134')).toBe('+14155550134');
    expect(n('12345')).toBeNull();
    expect(n('+44 12')).toBeNull();
    expect(n('hello')).toBeNull();
  });

  it('drops an unfilled date phrase cleanly', () => {
    expect(
      utils.contact.fillTemplate(
        'Book an inspection at Palm Grove Estate, Osun. Preferred date: {date}.'
      )
    ).toBe('Book an inspection at Palm Grove Estate, Osun.');
  });
});
