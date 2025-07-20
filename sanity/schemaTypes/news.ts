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
      ],
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
