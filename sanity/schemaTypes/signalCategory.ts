import { defineField, defineType } from 'sanity';

export const signalCategory = defineType({
  name: 'signalCategory',
  title: 'Signal Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required().error('Category name is required')
    }),
    defineField({
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
        validation: (rule) => rule.required().error('Slug is required')
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of this signal category'
    }),
    defineField({
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
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'string',
      description: 'Icon name for this category (e.g., TrendingUp, BarChart, etc.)'
    }),
    defineField({
      name: 'isPremium',
      title: 'Premium Category',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this category requires premium access'
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
      description: 'Order in which categories should be displayed'
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is currently active'
    }),
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
        media: undefined
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
});  
