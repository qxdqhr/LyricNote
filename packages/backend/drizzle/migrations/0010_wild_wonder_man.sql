CREATE TABLE "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"event_name" text NOT NULL,
	"timestamp" timestamp(3) NOT NULL,
	"priority" integer NOT NULL,
	"user_id" text,
	"session_id" text NOT NULL,
	"device_id" text NOT NULL,
	"page_url" text,
	"page_title" text,
	"referrer" text,
	"properties" jsonb,
	"platform" text NOT NULL,
	"app_version" text NOT NULL,
	"sdk_version" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config_definitions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "config_definitions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"validationRules" jsonb,
	"uiComponent" text DEFAULT 'input',
	"uiProps" jsonb,
	"isSensitive" boolean DEFAULT false NOT NULL,
	"isRequired" boolean DEFAULT false NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"requiredPermission" text,
	"defaultValue" text,
	"enumOptions" jsonb,
	"dependsOn" text[],
	"showIf" jsonb,
	"groupName" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"tags" text[],
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" integer
);
--> statement-breakpoint
CREATE TABLE "config_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "config_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"configKey" text NOT NULL,
	"oldValue" text,
	"newValue" text,
	"changeType" text NOT NULL,
	"changedBy" integer,
	"changedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"reason" text,
	"ipAddress" text,
	"userAgent" text
);
--> statement-breakpoint
CREATE TABLE "config_metadata" (
	"key" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"type" text DEFAULT 'string' NOT NULL,
	"isSensitive" boolean DEFAULT false NOT NULL,
	"isRequired" boolean DEFAULT false NOT NULL,
	"defaultDescription" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
DROP TABLE "songs" CASCADE;--> statement-breakpoint
DROP TABLE "lyrics" CASCADE;--> statement-breakpoint
DROP TABLE "user_lyrics" CASCADE;--> statement-breakpoint
DROP TABLE "collection_songs" CASCADE;--> statement-breakpoint
DROP TABLE "favorites" CASCADE;--> statement-breakpoint
DROP TABLE "recognitions" CASCADE;--> statement-breakpoint
DROP TABLE "ai_process_logs" CASCADE;--> statement-breakpoint
DROP TABLE "collections" CASCADE;--> statement-breakpoint
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events" USING btree ("event_type" text_ops);--> statement-breakpoint
CREATE INDEX "analytics_events_platform_idx" ON "analytics_events" USING btree ("platform" text_ops);--> statement-breakpoint
CREATE INDEX "analytics_events_timestamp_idx" ON "analytics_events" USING btree ("timestamp" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "config_definitions_key_key" ON "config_definitions" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "config_definitions_category_idx" ON "config_definitions" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "config_definitions_status_idx" ON "config_definitions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "config_history_key_idx" ON "config_history" USING btree ("configKey" text_ops);--> statement-breakpoint
CREATE INDEX "config_history_date_idx" ON "config_history" USING btree ("changedAt" timestamp_ops);--> statement-breakpoint
DROP TYPE "public"."LyricStatus";--> statement-breakpoint
DROP TYPE "public"."RecognitionStatus";