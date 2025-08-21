import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import { news } from './news'
import { impact } from './impact'
import { tag } from './tag'
import { category } from './category'
import { author } from './author'
import { signal } from './signal'
import { token } from './token' 
import { analystProfile } from './analystProfile'
import { research } from './research'
import { signalCategory } from './signalCategory'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContentType, news, impact, tag, category, author, signal, token, analystProfile, signalCategory, research ],
}
