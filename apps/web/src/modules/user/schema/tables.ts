import { pgNanoid } from '@/lib/db/helpers'
import { user } from '@/lib/db/schema'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const profile = pgTable('profile', {
  id: pgNanoid(),
  user_id: text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  summary: text('summary'),
  description: text('description'),
  birthday: timestamp('birthday'),
  personalizedRecommendation: boolean('personalized_recommendation').default(false),
  color: text('color'),
  banner: text('banner'),
})
