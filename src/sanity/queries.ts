/**
 * GROQ queries. Each projects a document into exactly the shape declared in
 * src/lib/types.ts, so live data and seed data are interchangeable. Only
 * published documents are read (the client's perspective), except in Draft
 * Mode.
 */
import { defineQuery } from 'next-sanity';

const IMG = `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": coalesce(alt, ""),
  "isRealSitePhoto": coalesce(isRealSitePhoto, true),
  caption,
  "hotspot": hotspot{x, y},
  "lqip": asset->metadata.lqip
}`;

export const settingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  ..., "address": address{..., "mapImage": mapImage${IMG}, "geo": select(defined(geo) => {"lat": geo.lat, "lng": geo.lng})}
}`);

const DOC = `{ _id, name, plainExplanation, "sampleImage": sampleImage${IMG} }`;

const ESTATE = `{
  _id, name, "slug": slug.current, state, lga, town, status, summary, body, headlineStats,
  "headlineStatsConfirmed": coalesce(headlineStatsConfirmed, false),
  "palmVariety": coalesce(palmVariety, "Supergene"), "incomeStartYear": coalesce(incomeStartYear, 3),
  "productiveLifeText": coalesce(productiveLifeText, "25 to 30 years"),
  "documents": coalesce(documents[]->${DOC}, []), "timeline": coalesce(timeline, []),
  "gallery": coalesce(gallery[]${IMG}, []), "heroImage": heroImage${IMG},
  "brochureUrl": brochure.asset->url, "brochureBytes": brochure.asset->size,
  mapUrl, "mapImage": mapImage${IMG},
  "aerialVideoKey": aerialVideo->url, seo, hidden, "updatedAt": _updatedAt
}`;

export const estatesQuery = defineQuery(
  `*[_type == "estate" && hidden != true] | order(name asc) ${ESTATE}`
);

const PLOT = `{
  _id, title, "slug": slug.current, "estateSlug": estate->slug.current, "estateName": estate->name,
  sizeLabel, sizeInAcres, trees, "price": coalesce(price, 0), "priceMode": coalesce(priceMode, "fixed"),
  "status": coalesce(status, "available"), "paymentOptions": coalesce(paymentOptions, "Full payment or instalment plan. Terms shared on enquiry."),
  "thumbnail": thumbnail${IMG}, "gallery": coalesce(gallery[]${IMG}, []),
  "whatsappTemplateKey": coalesce(whatsappTemplateKey, "plot"), "order": coalesce(order, 99), "updatedAt": _updatedAt
}`;

export const plotsQuery = defineQuery(
  `*[_type == "plot"] | order(order asc) ${PLOT}`
);

export const investOptionsQuery =
  defineQuery(`*[_type == "investOption"] | order(key asc) {
  ..., "body": coalesce(body, [])
}`);

export const investPageQuery = defineQuery(`*[_type == "investPage"][0]{
  "figuresVisible": coalesce(figuresVisible, false) && defined(legalReviewConfirmedOn), legalReviewConfirmedOn, riskDisclosure
}`);

export const credentialsQuery =
  defineQuery(`*[_type == "credential"] | order(order asc) {
  _id, name, "shortName": coalesce(shortName, name), value, verifyUrl, "documentUrl": document.asset->url,
  "status": select(status == "shown" => "shown", "pending"), "order": coalesce(order, 99)
}`);

export const documentsQuery = defineQuery(
  `*[_type == "documentType"] | order(order asc) ${DOC}`
);

export const statsQuery = defineQuery(
  `*[_type == "stat" && defined(sourceUrl)] { _id, label, value, sourceName, sourceUrl, sourceDate }`
);

export const departmentsQuery = defineQuery(
  `*[_type == "department"] | order(order asc) { _id, name, "order": coalesce(order, 99) }`
);

export const teamQuery = defineQuery(
  `*[_type == "teamMember"] | order(order asc) { _id, name, role, bio, "order": coalesce(order, 99), "photo": photo${IMG} }`
);

export const faqQuery = defineQuery(
  `*[_type == "faqItem"] | order(order asc) { _id, question, answer, group, "order": coalesce(order, 99), "showOnHome": coalesce(showOnHome, false) }`
);

export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(title asc) { _id, title, "slug": slug.current, "description": coalesce(description, "") }`
);

const POST = `{
  _id, title, "slug": slug.current, excerpt, "coverImage": coverImage${IMG},
  body[]{
    ...,
    _type == "image" => ${IMG},
    _type == "videoRef" => @->{ "_type": "videoRef", "_key": ^._key, url }
  },
  "category": category->{ _id, title, "slug": slug.current, "description": coalesce(description, "") },
  "estateSlug": estate->slug.current,
  "author": author->{ _id, name, role, "slug": slug.current, "photo": photo${IMG} },
  publishedAt, "updatedAt": _updatedAt,
  "readTime": round(length(pt::text(body)) / 5 / 220) + 1,
  seo, faq, recordedOn, recordedAt, "relatedPlotSlug": relatedPlot->slug.current
}`;

export const postsQuery = defineQuery(
  `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) ${POST}`
);

export const videosQuery =
  defineQuery(`*[_type == "videoEmbed" && defined(url)] | order(publishedOn desc) {
  _id, title, url, "poster": poster${IMG}, aspect, duration, summary, publishedOn, account,
  "featured": coalesce(featured, false), "placements": coalesce(placements, []), "estateSlug": estate->slug.current
}`);
