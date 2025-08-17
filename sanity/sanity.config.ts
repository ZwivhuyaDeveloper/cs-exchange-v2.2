import {defineConfig} from 'sanity'
import {structure} from 'sanity'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'


export default defineConfig({
  name: 'default',
  title: 'news-articles',

  projectId: '2ezfpspe',
  dataset: 'production',

  plugins: [structure(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
