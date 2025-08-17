import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure' // Keep this import
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'news-articles',
  projectId: '2ezfpspe',
  dataset: 'production',
  plugins: [
    structureTool({
      structure
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes,
  },
})