import { text, pgTable } from "drizzle-orm/pg-core"

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
})