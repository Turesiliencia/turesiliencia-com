import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {esESLocale} from '@sanity/locale-es-es'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Deissy Olarte',

  projectId: 'qnm95gjz',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), esESLocale()],

  schema: {
    types: schemaTypes,
  },
})
