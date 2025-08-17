import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure' // Keep this import
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'news-articles',

  projectId: '2ezfpspe',
  dataset: 'production',

  // Add structureTool to plugins array
  plugins: [
    structureTool(),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})