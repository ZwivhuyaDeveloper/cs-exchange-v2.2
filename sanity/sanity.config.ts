import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'news-articles',
  projectId: '2ezfpspe',
  dataset: 'production',
  plugins: [
    structure,
    visionTool()
  ],
  schema: {
    types: schemaTypes,
  },
})