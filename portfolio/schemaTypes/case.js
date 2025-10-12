// schemaTypes/case.js
import { defineType, defineField } from 'sanity'

export const caseSchema = defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({ name: 'productionCompany', title: 'Production Company', type: 'string' }),
    defineField({ name: 'director', title: 'Director', type: 'string' }),
    defineField({ name: 'locations', title: 'Locations', type: 'string' }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'type', title: 'Type', type: 'string' }),
    defineField({ name: 'protected', title: 'Protected', type: 'boolean' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),

    // 🔹 Layout Type
    defineField({
      name: 'layoutType',
      title: 'Layout Type',
      type: 'string',
      options: {
        list: [
          { title: 'Wide (16:9 full width, title overlay)', value: 'wide' },
          { title: 'Square (1:1, title overlay)', value: 'square' },
          { title: 'Wide Half (16:9, title below)', value: 'wideHalf' },
        ],
        layout: 'radio',
      },
      initialValue: 'wide',
    }),

    // 🔹 Manual ordering
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Use this to control the position on the homepage (lower = earlier)',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({ 
      name: 'archived', 
      title: 'Archived', 
      type: 'boolean', 
      description: 'Check to hide this case from the site', 
      initialValue: false 
    }),

    // Header image(s)
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'array',
      of: [{ type: 'image' }],
    }),

    // Mux video
    defineField({
      name: 'headerVideo',
      title: 'Header Video',
      type: 'mux.video',
    }),

    // Case content
    defineField({
      name: 'caseContent',
      title: 'Case Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'mux.video' },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'headerImage.0',
    },
  },
})
