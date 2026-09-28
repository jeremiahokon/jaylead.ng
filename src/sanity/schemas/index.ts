/** Every schema type the Studio knows, in desk order. */
import {
  credential,
  documentType,
  estate,
  investOption,
  investPage,
  plot,
  siteSettings,
  stat,
} from './business';
import {
  author,
  category,
  department,
  faqItem,
  lead,
  post,
  teamMember,
  videoEmbed,
} from './content';

export const schemaTypes = [
  siteSettings,
  estate,
  plot,
  investPage,
  investOption,
  credential,
  documentType,
  post,
  category,
  author,
  videoEmbed,
  faqItem,
  stat,
  teamMember,
  department,
  lead,
];

/** One document each; the desk opens them directly and hides create/delete. */
export const singletons = ['siteSettings', 'investPage'] as const;
