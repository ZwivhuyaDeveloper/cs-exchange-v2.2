export default {
  name: 'research',
  type: 'document',
  title: 'Research',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of Research',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug of your research article',
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
      name: 'date',
      type: 'array',
      title: 'Date Published',
      of: [
        {
          type: 'block',
        },
      ],
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
      title: 'Research Category',
      type: 'reference',
      to: [
        {
          type: 'category'
        }
      ]

    },
  ],
}
