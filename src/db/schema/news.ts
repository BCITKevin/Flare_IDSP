import { serial, text, pgTable, pgEnum, timestamp } from "drizzle-orm/pg-core"

export const mediaType = pgEnum("query_type", ["wildfire"]);

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: mediaType("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})