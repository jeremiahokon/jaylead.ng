/**
 * The embedded Studio at /studio. Singletons (site settings, invest page)
 * can't be created twice or deleted. Presentation opens the real site with
 * drafts through /api/draft-mode/enable.
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schemaTypes, singletons } from '@/sanity/schemas';
import { structure } from '@/sanity/structure';

const singletonSet = new Set<string>(singletons);

export default defineConfig({
  basePath: '/studio',
  name: 'jaylead',
  title: 'Jaylead AgriEstate',
  projectId: projectId || 'unset',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !singletonSet.has(t.schemaType)),
  },
  document: {
    actions: (actions, ctx) =>
      singletonSet.has(ctx.schemaType)
        ? actions.filter(
            (a) =>
              a.action &&
              ['publish', 'discardChanges', 'restore'].includes(a.action)
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
