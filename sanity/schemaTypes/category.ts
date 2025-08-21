import { ListIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const category = defineType({
    name: 'category',
    type: 'document',
    title: 'category',
    icon: ListIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name of Category',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
              source: 'name',
            },
          }),
          defineField({
            name: 'description',
            type: 'text',
          }),
    ],
})