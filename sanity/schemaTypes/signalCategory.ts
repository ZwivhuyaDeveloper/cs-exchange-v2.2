import { Rule } from 'sanity';

export default {
  name: 'signalCategory',
  title: 'Signal Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Category name is required')
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
      },
      validation: (Rule: Rule) => Rule.required().error('Slug is required')
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of this signal category'
    },
    {
      name: 'color',
      title: 'Category Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Purple', value: 'purple' },
          { title: 'Orange', value: 'orange' },
          { title: 'Pink', value: 'pink' },
          { title: 'Indigo', value: 'indigo' }
        ]
      },
      initialValue: 'blue'
    },
    {
      name: 'icon',
      title: 'Category Icon',
      type: 'string',
      description: 'Icon name for this category (e.g., TrendingUp, BarChart, etc.)'
    },
    {
      name: 'isPremium',
      title: 'Premium Category',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this category requires premium access'
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
      description: 'Order in which categories should be displayed'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is currently active'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      isPremium: 'isPremium'
    },
    prepare(selection: any) {
      const { title, subtitle, isPremium } = selection;
      return {
        title,
        subtitle: `${subtitle || 'No description'} ${isPremium ? '(Premium)' : ''}`,
        media: undefined // Could add icon here
      };
    }
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }]
    },
    {
      title: 'Name',
      name: 'name',
      by: [{ field: 'name', direction: 'asc' }]
    }
  ]
};
