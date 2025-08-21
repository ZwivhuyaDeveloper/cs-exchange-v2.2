import { TargetIcon } from '@sanity/icons'
import { defineField, defineType} from 'sanity'


export const impact = defineType({
    name: 'impact',
    type: 'document',
    title: 'impact',
    icon: TargetIcon,
    fields: [
        defineField({
            name: 'name',
            type: 'string',
            title: 'Impact type',
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
    ],
})