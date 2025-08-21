import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const research = defineType({
  name: 'research',
  type: 'document',
  title: 'Research',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title of Research',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug of your research article',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'titleImage',
      type: 'image',
      title: 'Title Image',
    }),
    defineField({
      name: 'headImage',
      type: 'image',
      title: 'Head Image',
    }),
    defineField({
      name: 'contentImage',
      type: 'image',
      title: 'Content Image',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      }
    }),
    defineField({
      name: 'smallDescription',
      type: 'text',
      title: 'Small Description',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'research',
      type: 'array',
      title: 'research',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'News Category',
      type: 'reference',
      to: [
        {
          type: 'category'
        }
      ]

    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }]
        }
      ],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'impacts',
      title: 'Impacts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impact' }]
        }
      ],
      options: {
        layout: 'tags'
      }
    }),
  ],
})
