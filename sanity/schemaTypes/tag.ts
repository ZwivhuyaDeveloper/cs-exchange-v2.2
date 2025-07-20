// app/schemas/tag.ts
export default {
  name: 'tag',
  type: 'document',
  title: 'Tag',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Tag Name',
    },
    {
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
    }
  ]
}