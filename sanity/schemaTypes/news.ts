import type { Rule } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity'


export const news = defineType({
  name: 'news',
  type: 'document',
  title: 'News',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title of news article',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug of your news article',
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
        defineArrayMember({
          type: 'block',
        }),
        defineArrayMember({
          type: 'image',
          fields: [
            {
              type: 'text',
              name: 'alt',
              title: 'Alternative text',
              description: 'Alternative text is required',
              options: {
                isHighlighted: true,
              },
            },
          ],
        }),
      ],
    }),
    
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      description: 'Add key points or glossary items to highlight in the article',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'point',
              type: 'string',
              title: 'Key Point',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description (Optional)',
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: 'point',
              subtitle: 'description',
            },
            prepare(selection: { title: string; subtitle?: string }) {
              const { title, subtitle } = selection;
              return {
                title: title || 'Untitled',
                subtitle: subtitle || 'No description',
              };
            },
          },
        }),
      ],
      options: {
        layout: 'grid',
      },
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'The author who wrote this news article',
      validation: (rule) => rule.required().error('Please select an author for this article')
    }),
    defineField({
      name: 'impacts',
      title: 'Impacts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'impact' }]
        }),
      ],
      options: {
        layout: 'tags'
      }
    }),
  ],
})
