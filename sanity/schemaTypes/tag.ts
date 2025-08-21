// app/schemas/tag.ts
import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const tag = defineType({
  name: 'tag',
  type: 'document',
  title: 'Tag',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Tag Name',
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'Color',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Red', value: 'red'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Purple', value: 'purple'},
        ]
      }
    }),
  ]
})