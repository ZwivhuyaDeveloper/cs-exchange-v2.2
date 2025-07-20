export default {
    name: 'impact',
    type: 'document',
    title: 'impact',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Impact type',
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
    ],
}