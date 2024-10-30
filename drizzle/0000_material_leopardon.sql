CREATE TYPE "public"."query_type" AS ENUM('wildfire');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"type" "query_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
