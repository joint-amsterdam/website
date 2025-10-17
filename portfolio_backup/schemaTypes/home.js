import { defineType, defineField } from 'sanity'

export const homeSchema = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // Case content
    // defineField({
    //   name: 'description',
    //   title: 'Description',
    //   type: 'array',
    //   of: [
    //     { type: 'block' },
    //     { type: 'image' },
    //     { type: 'mux.video' },
    //   ],
    // }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
    }),

    // defineField({
    //   name: 'headerImage',
    //   title: 'Header Image',
    //   type: 'image',
    //   options: { hotspot: true },
    // }),

    // defineField({
    //   name: 'headerVideo',
    //   title: 'Header Video',
    //   type: 'mux.video',
    //   description: 'Optional Mux video for this section',
    // }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'headerImage',
    },
  },
})
