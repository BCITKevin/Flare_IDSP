import { text, pgTable, pgEnum, timestamp } from "drizzle-orm/pg-core"

export const mediaType = pgEnum("query_type", ["wildfire"]);

export const media = pgTable("media", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  type: mediaType("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})