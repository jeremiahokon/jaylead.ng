/**
 * Blog seed (brief 16.1): categories, the author, and eleven posts written
 * from the founder's transcripts and the brand's own captions, cleaned up in
 * Nigerian English and checked against the section 14 guardrails. No figure
 * here is unsourced: the founder's palm oil consumption estimate is left out
 * until a published source is attached. `pnpm seed` loads posts as drafts for
 * the client's approval; the site previews them from this file until then.
 */
import type { Author, Category, Post } from '@/lib/types';

import { images } from '@/data/images';

import { pt } from './pt';

export const categoriesSeed: Category[] = [
  {
    _id: 'cat-farm-updates',
    title: 'Farm Updates',
    slug: 'farm-updates',
    description:
      'Dated notes from the land: inspections, soil work, planting and harvests.',
  },
  {
    _id: 'cat-investment-education',
    title: 'Investment Education',
    slug: 'investment-education',
    description:
      'Plain explanations of land, palm oil and long-term investing.',
  },
  {
    _id: 'cat-agriculture-insights',
    title: 'Agriculture Insights',
    slug: 'agriculture-insights',
    description: 'How oil palm is grown, managed and processed.',
  },
  {
    _id: 'cat-company-news',
    title: 'Company News',
    slug: 'company-news',
    description: 'What is happening at Jaylead.',
  },
  {
    _id: 'cat-events',
    title: 'Events',
    slug: 'events',
    description: 'Open days, inspections and talks.',
  },
  {
    _id: 'cat-realtor-resources',
    title: 'Realtor Resources',
    slug: 'realtor-resources',
    description: 'For Jaylead Realty Partners and people thinking of joining.',
  },
];

const cat = (slug: string) => categoriesSeed.find((c) => c.slug === slug)!;

export const authorSeed: Author = {
  _id: 'author-md',
  name: 'Adetunji Jacob Ogunyemi',
  role: 'Managing Director',
  slug: 'adetunji-jacob-ogunyemi',
  photo: images['founder-portrait-suit'],
};

type PostInput = Omit<Post, '_id' | 'author' | 'readTime' | 'category'> & {
  category: string;
};

const readTime = (p: PostInput) => {
  const words = p.body
    .flatMap((b) =>
      'children' in b ? (b.children as { text?: string }[]) : []
    )
    .map((c) => c.text ?? '')
    .join(' ')
    .split(/\s+/).length;

  return Math.max(2, Math.round(words / 220));
};

const posts: PostInput[] = [
  {
    title: 'Palm Grove vs Dangote IPO: which fits your goal?',
    slug: 'palm-grove-vs-dangote-ipo',
    excerpt:
      'One gives you land. The other gives you shares. The real question is not which is better, but which one fits the goal you are investing for.',
    coverImage: images['cover-palm-grove-vs-dangote-ipo'],
    category: 'investment-education',
    publishedAt: '2026-09-18T16:00:00.000Z',
    body: pt(
      'If you had ₦1,000,000 to invest today, where would you put it? Two very different answers are on many people’s minds right now: buying shares in a big listed company, or owning a piece of productive farmland.',
      'It isn’t about which is better. It’s about which one fits your investment goal. Here is a plain comparison.',
      '## Two different things to own',
      '- **Shares:** you own a small part of a company. Your return depends on how the business performs and what the market will pay for its shares.',
      '- **A Palm Grove plot:** you own titled land and the oil palms on it. Your return depends on what the palms produce and what palm oil sells for.',
      '## What produces the income',
      'A company pays dividends when its board decides to. A managed palm plot produces fruit every year once the palms mature, from year 3, and that fruit is processed and sold as crude palm oil.',
      '## Your involvement',
      'Both can be hands-off. With shares you watch a price. With a Jaylead plot, our team plants, manages, harvests, processes and sells, and you receive your share of the revenue yearly.',
      '## Can you pass it on?',
      'Both can be inherited. Land comes with physical title documents: a Deed of Assignment, Certificate of Allocation, Registered Survey and Layout Plan.',
      '## What it depends on',
      'Shares depend on the company and the market. Farmland depends on weather, yields and palm oil prices. Neither is risk-free, and returns from either are not guaranteed.',
      '> Many people hold both. The point is to know what you own and why.',
      'If land fits your goal, [see the plots available at Palm Grove Estate](/marketplace) or read [why owners choose Jaylead](/why-us).'
    ),
    faq: [
      {
        question: 'Is farmland safer than shares?',
        answer:
          'Neither is risk-free. Shares depend on the company and the market; farmland depends on weather, yields and palm oil prices. What differs is what you own: with a plot, you hold titled land.',
      },
    ],
  },
  {
    title: 'Why every Jaylead estate is soil-tested before planting',
    slug: 'why-we-soil-test-before-planting',
    excerpt:
      'Every soil has a story. Before a single palm goes in, we test the land to understand what it needs to support healthy growth.',
    coverImage: images['poster-DdJx-XQqgvp'],
    category: 'farm-updates',
    publishedAt: '2026-09-11T16:00:00.000Z',
    recordedOn: '2026-09-11',
    body: pt(
      'Agriculture is more than owning land. It’s knowing how to work the land.',
      'Before cultivation starts on any Jaylead estate, we test the soil. The results tell us about the soil’s condition and properties, and what it may need to support healthy crop growth.',
      '## What soil testing tells us',
      '- How acidic or alkaline the soil is, which affects how well palms can take up nutrients.',
      '- Which nutrients are present and which are lacking.',
      '- How the land drains, and whether any part of it needs extra preparation.',
      '## Why it matters to plot owners',
      'Oil palms are productive for 25 to 30 years. The decisions we make before planting shape how well they grow for all of those years. Testing first means we prepare the land properly instead of guessing.',
      'It is part of what we mean by “Not just promises. Proof.” You can follow the field work as it happens on our [Instagram](https://www.instagram.com/jaylead_ng/).'
    ),
  },
  {
    title: 'Inside our land inspection in Malete, Kwara',
    slug: 'land-inspection-malete-kwara',
    excerpt:
      'Every project starts with the right groundwork. Our land inspection in Malete, Kwara is part of doing the work and verifying the details.',
    coverImage: images['cover-malete-land-inspection'],
    category: 'farm-updates',
    publishedAt: '2026-09-08T16:42:00.000Z',
    recordedOn: '2026-09-08',
    recordedAt: 'Malete, Kwara State',
    body: pt(
      'Every project starts with the right groundwork. Our recent land inspection in Malete, Kwara State, is part of our commitment to doing the work, verifying the details and building opportunities on solid ground.',
      'When it comes to land and agriculture, trust starts with verification.',
      '## What an inspection covers',
      '- Walking the boundaries and checking them against the survey.',
      '- Looking at access roads, drainage and the condition of the land.',
      '- Confirming the paperwork matches what is on the ground.',
      '## A note on location',
      'This inspection was in Malete, Kwara State. It is not Palm Grove Estate, which is in Osun State. We will share news of any future estate here first.',
      'Want to see land for yourself? [Book a site inspection](/contact#inspection) at Palm Grove Estate.'
    ),
  },
  {
    title: 'Technology depreciates. Farmland keeps producing.',
    slug: 'technology-depreciates-farmland-keeps-producing',
    excerpt:
      'The value of agricultural land isn’t just in owning it. It’s in what the land can produce over time.',
    coverImage: images['cover-tech-depreciates-farmland-grows'],
    category: 'investment-education',
    publishedAt: '2026-09-14T07:43:00.000Z',
    body: pt(
      'The phone you bought last year is worth less today. The laptop, less again. Most things we buy lose value the moment we own them.',
      'Productive farmland works differently. Its value isn’t only in owning it. It’s in what the land can produce, year after year.',
      '## Owning versus producing',
      'Land that sits idle waits for someone to pay more for it. Land that is farmed does two things at once: it keeps its value as land, and it produces a crop that can be sold.',
      'At Palm Grove Estate, that crop is oil palm fruit, processed into crude palm oil from year 3. Oil palms stay productive for 25 to 30 years.',
      '## Honest about the risks',
      'Farm income depends on weather, yields and palm oil prices, so it is not guaranteed. What you do own for certain is the land, backed by your title documents.',
      'Invest in land with a purpose. [See the plots](/marketplace).'
    ),
  },
  {
    title: 'This or That: the AgriEstate edition',
    slug: 'this-or-that-agriestate-edition',
    excerpt:
      'Betting on the market or betting on the land? Our Managing Director answers six quick questions about land, income and time.',
    coverImage: images['poster-DdrPFNtqg-3'],
    category: 'investment-education',
    publishedAt: '2026-09-24T16:00:00.000Z',
    body: pt(
      'We asked our Managing Director, Adetunji Jacob Ogunyemi, six quick “this or that” questions. Here are his answers, lightly edited.',
      '### Betting on the market, or betting on the land?',
      '“The land. You can’t control the market.”',
      '### Active income that needs your time, or income that doesn’t?',
      '“Income that doesn’t need my time, so I can use my time for something else.”',
      '### Land waiting for appreciation, or land working from day one?',
      '“Land that works while it appreciates. Two instead of one.”',
      '### Money sitting in the bank, or land that grows in value?',
      '“Land. Money sitting in the bank is being eaten by inflation.”',
      '### Income that stops if you lose your job, or income that comes whether you show up or not?',
      '“Income that doesn’t depend on me showing up for a boss.”',
      '### An asset that loses value, or one that can be passed down?',
      '“One that can be passed down to my children.”',
      '## Our take',
      'These are one person’s choices, not advice. Farm income depends on real yields and palm oil prices and is not guaranteed. If land fits your goals, [talk to an advisor](/contact).'
    ),
  },
  {
    title: 'Six ways to build wealth, and where a managed plantation fits',
    slug: 'six-ways-to-build-wealth-managed-plantation',
    excerpt:
      'Land banking, rental property, dividend shares, perennial crops: each does a different job. Here is where a managed oil palm plantation fits.',
    coverImage: images['poster-DdtyFloqy-0'],
    category: 'investment-education',
    publishedAt: '2026-09-25T16:00:00.000Z',
    body: pt(
      'What you do today can shape what you gain tomorrow. Different assets do different jobs, so the first step is knowing what you want your money to do.',
      '## Six goals, six tools',
      '1. **Long-term appreciation:** land in a growing area.',
      '2. **Income without day-to-day involvement:** a managed plantation, where the operator does the farming.',
      '3. **The lowest entry price:** buying into a project early.',
      '4. **Monthly cash flow:** a rental property.',
      '5. **Yearly company income:** dividend-paying shares.',
      '6. **Income for decades and an asset you can pass on:** perennial cash crops like oil palm.',
      '## Where Palm Grove fits',
      'A Palm Grove plot combines the last two ideas: you own titled land, and the palms on it produce crude palm oil yearly from year 3 for a productive life of 25 to 30 years. Jaylead plants and manages everything.',
      'Like every investment, it carries risk: weather, yields and palm oil prices all affect income. Read the [risk disclosure](/legal/risk-disclosure), then [compare the plots](/marketplace).'
    ),
  },
  {
    title: 'We’re open: inside the Jaylead office launch in Tanke, Ilorin',
    slug: 'jaylead-office-launch-tanke-ilorin',
    excerpt:
      'What started as a vision is now a growing reality. In September 2026 we opened our office beside Mazabs Event Centre, Tanke, Ilorin.',
    coverImage: images['office-logo-wall'],
    category: 'company-news',
    publishedAt: '2026-09-15T15:40:00.000Z',
    body: pt(
      'A new chapter has officially begun at Jaylead. What started as a vision is now a growing reality: an AgriEstate built to create opportunities, support sustainable agriculture and build a future where land and investment grow together.',
      'In September 2026 we officially opened our doors at Tipper Garage Roundabout, beside Mazabs Event Centre, Tanke, Ilorin, Kwara State. We are grateful to everyone who came to celebrate with us.',
      '## Before and after',
      'The space started as a bare room. Over a few weeks it was renovated into a working office with a reception, meeting space and the team’s desks.',
      '## Visit us',
      'The office is open Monday to Friday, 9am to 5pm. You are welcome to come in, meet the team and see the documents for yourself. [Plan your visit](/contact).',
      'This is only the start. Welcome to Jaylead.'
    ),
  },
  {
    title: 'Our story: from laid-off engineer to palm-grove builder',
    slug: 'our-story',
    excerpt:
      'A personal plan to plant palm trees grew into a collective one. How Jaylead AgriEstate began.',
    coverImage: images['founder-portrait-agbada'],
    category: 'company-news',
    publishedAt: '2026-06-05T12:00:00.000Z',
    body: pt(
      'Adetunji Jacob Ogunyemi grew up where farming was part of daily life. The vegetables, the yam and the fruit on the table came straight from the farm.',
      'He went on to become a software engineer and worked with a few companies, until the rise of AI changed his industry and he was laid off. He spent months without a job.',
      'In that time he kept asking one question: what could generate income for people without needing their day-to-day involvement? The answer was closer to home than he expected. Nigeria has the land and the climate for crops it still does not grow enough of, and oil palm is one of them.',
      '## A personal agenda that grew',
      'The first plan was personal: a large farm of his own, planted with palms, harvested from the third year. Over time that personal agenda grew into a collective one.',
      '> A personal agenda over time grew to become a collective agenda.',
      'Jaylead AgriEstate is the result. You buy titled land from us, we plant and manage it, and when the palms start fruiting, a larger percentage of the revenue from your farm is yours.',
      '## Two problems at once',
      'Every plot planted adds to Nigeria’s own palm oil supply, and it gives the owner an asset that produces for decades and can be passed on.',
      'It is your land, your palms and your legacy. [Meet the team](/about).'
    ),
  },
  {
    title: 'Owning a plot or funding the project: which route fits you?',
    slug: 'owning-a-plot-or-funding-the-project',
    excerpt:
      'There are two ways to work with Jaylead. One gives you specific, titled land. The other funds the farming operation itself.',
    coverImage: images['plantation-drone'],
    category: 'investment-education',
    publishedAt: '2026-09-27T09:00:00.000Z',
    body: pt(
      'People often ask whether they should buy a plot or invest in the project. They are different things, and the right one depends on what you want to own.',
      '## Owning a plot',
      'You buy a specific plot of titled farmland at Palm Grove Estate, in a size that suits you: 1 acre with 60 palms or 1 hectare with 150. The land is yours, with four title documents. Jaylead plants and manages it, and you earn yearly from what it produces for as long as the palms are productive.',
      '## Funding the project',
      'You are not buying a specific plot. You fund Jaylead’s farming operation under one of two options: **Option A**, which shares in the farm’s output over the long term, or **Option B**, a fixed-term loan with an agreed interest rate and a clean exit. Terms are shared privately by an advisor and set by your signed agreement.',
      '## How to choose',
      '- Want land in your name that you can pass on? Own a plot.',
      '- Want to fund the operation without holding land? Look at Option A or B.',
      'Either way, returns depend on real farm performance and are not guaranteed. Take independent advice. [Compare the routes](/invest).'
    ),
  },
  {
    title: 'What “land-backed” actually means',
    slug: 'what-land-backed-means',
    excerpt:
      'Land-backed means there is real, titled land behind what you buy, with documents you can check. Here is what to look for.',
    coverImage: images['aerial-perimeter'],
    category: 'investment-education',
    publishedAt: '2026-09-26T09:00:00.000Z',
    body: pt(
      '“Land-backed” gets used a lot. Here is what it means at Jaylead, and what you should check with any company that uses the phrase.',
      '## There is real land',
      'A specific, surveyed piece of ground exists, and you can visit it. Book an inspection and see it before you pay.',
      '## It is in your name',
      'You receive documents that prove the land is yours: a Deed of Assignment, Certificate of Allocation, Registered Survey and Layout Plan.',
      '## The company is who it says it is',
      'Jaylead AgriEstate Limited is registered with the Corporate Affairs Commission (RC 9492571). You can [check it on the CAC public search](https://search.cac.gov.ng/). We are also SCUML certified with a validated TIN.',
      '## You pay the company, not a person',
      'Pay only into the corporate account of Jaylead AgriEstate Limited, and call +234 916 099 2539 to confirm the details before any transfer.',
      'Land-backed does not mean risk-free. Farm income still depends on weather, yields and prices. It means that whatever happens, the land and the paperwork are real. [See why owners choose us](/why-us).'
    ),
  },
  {
    title:
      'Five questions every new realtor hears, and how to answer them honestly',
    slug: 'five-questions-new-realtors-hear',
    excerpt:
      'Selling land-backed agriculture is a trust conversation. These are the five questions buyers ask most, with honest answers.',
    coverImage: images['cover-something-worth-owning'],
    category: 'realtor-resources',
    publishedAt: '2026-09-27T12:00:00.000Z',
    body: pt(
      'As a Jaylead Realty Partner, you are not selling a dream. You are helping someone decide whether real, titled farmland fits their goals. These five questions come up in almost every conversation.',
      '### 1. “Is this company real?”',
      'Show them. RC 9492571 on the CAC public search, the office in Tanke, Ilorin, and an open invitation to visit.',
      '### 2. “What exactly do I own?”',
      'Titled farmland and the palms on it, with four documents. Not a share, not a unit.',
      '### 3. “Is my income guaranteed?”',
      'No, and never say otherwise. Income depends on what the plot produces and what palm oil sells for. The land itself is theirs for certain.',
      '### 4. “When do I start earning?”',
      'Palm oil income starts from year 3 and is paid yearly.',
      '### 5. “How do I pay safely?”',
      'Only into the corporate account of Jaylead AgriEstate Limited, after calling the office line to confirm the details. Never into a personal account, including yours.',
      'Honest answers close more sales than big promises. [Join the Jaylead Realty Academy](/become-a-realtor).'
    ),
  },
];

export const postsSeed: Post[] = posts.map((p, i) => ({
  ...p,
  _id: `post-${i + 1}`,
  category: cat(p.category),
  author: authorSeed,
  readTime: readTime(p),
}));
