import { serial, text, pgTable, pgEnum, timestamp, integer } from "drizzle-orm/pg-core"
import { media } from './news';

export const mediaType = pgEnum("disaster_type", ["wildfire"]);

export const newsData = pgTable("newsData", {
  id: serial("id").primaryKey(),
  data: text("data").notNull(),
  type: mediaType("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  newsId: text("news_id")
    .notNull()
    .references(() => media.id),
});