-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."LyricStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING');--> statement-breakpoint
CREATE TYPE "public"."RecognitionStatus" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED', 'TIMEOUT');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"username" text NOT NULL,
	"password" text,
	"name" text,
	"nickname" text,
	"image" text,
	"avatar" text,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"preferences" jsonb,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"twoFactorEnabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp(3),
	"refreshTokenExpiresAt" timestamp(3),
	"scope" text,
	"password" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"album" text,
	"duration" integer,
	"releaseYear" integer,
	"genre" text,
	"coverUrl" text,
	"audioUrl" text,
	"isJapanese" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lyrics" (
	"id" text PRIMARY KEY NOT NULL,
	"songId" text NOT NULL,
	"content" text NOT NULL,
	"kanji" text,
	"hiragana" text,
	"romaji" text,
	"translation" text,
	"timeStamps" jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"status" "LyricStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_lyrics" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"lyricId" text NOT NULL,
	"content" text NOT NULL,
	"notes" text,
	"isPublic" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_songs" (
	"id" text PRIMARY KEY NOT NULL,
	"collectionId" text NOT NULL,
	"songId" text NOT NULL,
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"songId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_configs" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recognitions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"audioUrl" text NOT NULL,
	"songId" text,
	"confidence" double precision,
	"status" "RecognitionStatus" NOT NULL,
	"result" jsonb,
	"processTime" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_process_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"inputData" jsonb NOT NULL,
	"outputData" jsonb,
	"apiProvider" text NOT NULL,
	"tokens" integer,
	"cost" double precision,
	"duration" integer,
	"status" text NOT NULL,
	"error" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isDefault" boolean DEFAULT false NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"category" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "lyrics" ADD CONSTRAINT "lyrics_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_lyrics" ADD CONSTRAINT "user_lyrics_lyricId_fkey" FOREIGN KEY ("lyricId") REFERENCES "public"."lyrics"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_lyrics" ADD CONSTRAINT "user_lyrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collection_songs" ADD CONSTRAINT "collection_songs_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collection_songs" ADD CONSTRAINT "collection_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_username_key" ON "User" USING btree ("username" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Session_token_key" ON "Session" USING btree ("token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account" USING btree ("providerId" text_ops,"accountId" text_ops);--> statement-breakpoint
CREATE INDEX "songs_title_artist_idx" ON "songs" USING btree ("title" text_ops,"artist" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_lyrics_userId_lyricId_key" ON "user_lyrics" USING btree ("userId" text_ops,"lyricId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "collection_songs_collectionId_songId_key" ON "collection_songs" USING btree ("collectionId" text_ops,"songId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_userId_songId_key" ON "favorites" USING btree ("userId" text_ops,"songId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs" USING btree ("key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "verifications_identifier_value_key" ON "verifications" USING btree ("identifier" text_ops,"value" text_ops);
*/