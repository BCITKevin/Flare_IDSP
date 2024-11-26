  import { serial, text, pgTable, pgEnum, timestamp, integer } from "drizzle-orm/pg-core"

export const mediaType = pgEnum("query_type", ["wildfire"]);

export const media = pgTable("media", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  type: mediaType("type").notNull(),
  creatuedAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})