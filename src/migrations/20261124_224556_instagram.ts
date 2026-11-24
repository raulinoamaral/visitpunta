import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_instagram_posts_account" AS ENUM('visitpunta', 'visitpunta.br');
  CREATE TYPE "public"."enum_instagram_posts_kind" AS ENUM('post', 'reel', 'story');
  CREATE TYPE "public"."enum_instagram_posts_status" AS ENUM('draft', 'approved', 'changes', 'discarded', 'publishing', 'published', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'publishInstagram');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'publishInstagram');
  CREATE TABLE "instagram_posts_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "instagram_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"account" "enum_instagram_posts_account" DEFAULT 'visitpunta' NOT NULL,
  	"kind" "enum_instagram_posts_kind" DEFAULT 'post' NOT NULL,
  	"scheduled_at" timestamp(3) with time zone NOT NULL,
  	"caption" varchar,
  	"feedback" varchar,
  	"note" varchar,
  	"link_path" varchar,
  	"status" "enum_instagram_posts_status" DEFAULT 'draft' NOT NULL,
  	"result_published_at" timestamp(3) with time zone,
  	"result_permalink" varchar,
  	"result_media_id" varchar,
  	"result_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instagram_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'instagram',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "instagram_posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "instagram_media_id" integer;
  ALTER TABLE "instagram_posts_media" ADD CONSTRAINT "instagram_posts_media_file_id_instagram_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."instagram_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "instagram_posts_media" ADD CONSTRAINT "instagram_posts_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "instagram_posts_media_order_idx" ON "instagram_posts_media" USING btree ("_order");
  CREATE INDEX "instagram_posts_media_parent_id_idx" ON "instagram_posts_media" USING btree ("_parent_id");
  CREATE INDEX "instagram_posts_media_file_idx" ON "instagram_posts_media" USING btree ("file_id");
  CREATE INDEX "instagram_posts_account_idx" ON "instagram_posts" USING btree ("account");
  CREATE INDEX "instagram_posts_scheduled_at_idx" ON "instagram_posts" USING btree ("scheduled_at");
  CREATE INDEX "instagram_posts_status_idx" ON "instagram_posts" USING btree ("status");
  CREATE INDEX "instagram_posts_updated_at_idx" ON "instagram_posts" USING btree ("updated_at");
  CREATE INDEX "instagram_posts_created_at_idx" ON "instagram_posts" USING btree ("created_at");
  CREATE INDEX "instagram_media_updated_at_idx" ON "instagram_media" USING btree ("updated_at");
  CREATE INDEX "instagram_media_created_at_idx" ON "instagram_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "instagram_media_filename_idx" ON "instagram_media" USING btree ("filename");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instagram_posts_fk" FOREIGN KEY ("instagram_posts_id") REFERENCES "public"."instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instagram_media_fk" FOREIGN KEY ("instagram_media_id") REFERENCES "public"."instagram_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_instagram_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("instagram_posts_id");
  CREATE INDEX "payload_locked_documents_rels_instagram_media_id_idx" ON "payload_locked_documents_rels" USING btree ("instagram_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "instagram_posts_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "instagram_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "instagram_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "instagram_posts_media" CASCADE;
  DROP TABLE "instagram_posts" CASCADE;
  DROP TABLE "instagram_media" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_instagram_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_instagram_media_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_instagram_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_instagram_media_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "instagram_posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "instagram_media_id";
  DROP TYPE "public"."enum_instagram_posts_account";
  DROP TYPE "public"."enum_instagram_posts_kind";
  DROP TYPE "public"."enum_instagram_posts_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
