CREATE TYPE "public"."query_type" AS ENUM('wildfire');--> statement-breakpoint
CREATE TYPE "public"."disaster_type" AS ENUM('wildfire');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"type" "query_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsData" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"type" "disaster_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"news_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsData" ADD CONSTRAINT "newsData_news_id_media_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
