
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: '2z2myouw',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    muxInput(), // <-- correct usage
  ],

  schema: {
    types: schemaTypes,
  },
})