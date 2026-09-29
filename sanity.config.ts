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
import { resolve } from '@/sanity/presentation';
import { schemaTypes, singletons } from '@/sanity/schemas';
import { structure } from '@/sanity/structure';
import { templates } from '@/sanity/templates';

const singletonSet = new Set<string>(singletons);

export default defineConfig({
  basePath: '/studio',
  name: 'jaylead',
  title: 'Jaylead AgriEstate',
  projectId: projectId || 'unset',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (defaults) => [
      ...defaults.filter((t) => !singletonSet.has(t.schemaType)),
      ...templates,
    ],
  },
  document: {
    // The page-list templates need a group or placement, so they only
    // appear inside those lists, not in the global "Create" menu.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => !templates.some((x) => x.id === t.templateId))
        : prev,
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
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
