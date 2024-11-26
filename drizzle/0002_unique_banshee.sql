CREATE TABLE IF NOT EXISTS "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "type" "query_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;