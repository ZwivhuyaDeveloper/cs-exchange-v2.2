import { Rule } from 'sanity';

export default {
  name: 'news',
  type: 'document',
  title: 'News',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of news article',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug of your news article',
      options: {
        source: 'title',
      },
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Title Image',
    },
    {
      name: 'headImage',
      type: 'image',
      title: 'Head Image',
    },
    {
      name: 'contentImage',
      type: 'image',
      title: 'Content Image',
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      }
    },
    {
      name: 'smallDescription',
      type: 'text',
      title: 'Small Description',
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block',
        },
        {
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
        },
      ],
    },
    {
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      description: 'Add key points or glossary items to highlight in the article',
      of: [
        {
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
        },
      ],
      options: {
        editModal: 'fullscreen',
      },
    },
    {
      name: 'research',
      type: 'array',
      title: 'research',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'category',
      title: 'News Category',
      type: 'reference',
      to: [
        {
          type: 'category'
        }
      ]

    },
    {
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
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'The author who wrote this news article',
      validation: (rule: Rule) => rule.required().error('Please select an author for this article')
    },
        {
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
        layout: 'impacts'
      }
    },
  ],
}
