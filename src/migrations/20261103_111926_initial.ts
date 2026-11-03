import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_places_gallery_layout" AS ENUM('duo', 'grid', 'featured-bottom', 'featured-side');
  CREATE TYPE "public"."enum_places_type" AS ENUM('dormir', 'comer', 'spots');
  CREATE TYPE "public"."enum_tags_type" AS ENUM('dormir', 'comer');
  CREATE TYPE "public"."enum_articles_blocks_media_block_variant" AS ENUM('inline', 'breakout', 'bleed');
  CREATE TYPE "public"."enum_articles_blocks_social_video_source" AS ENUM('embed', 'upload');
  CREATE TYPE "public"."enum_articles_type" AS ENUM('guide', 'selection', 'experience', 'season');
  CREATE TYPE "public"."enum_experiences_blocks_media_block_variant" AS ENUM('inline', 'breakout', 'bleed');
  CREATE TYPE "public"."enum_experiences_gallery_layout" AS ENUM('single', 'duo');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"credit" varchar,
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
  
  CREATE TABLE "places_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "places_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_places_gallery_layout" DEFAULT 'duo' NOT NULL
  );
  
  CREATE TABLE "places_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "places_related_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_places_type" NOT NULL,
  	"destination_id" integer,
  	"featured" boolean DEFAULT false,
  	"hero_image_id" integer,
  	"card_image_id" integer,
  	"summary" varchar,
  	"location" varchar,
  	"description" varchar,
  	"cta_url" varchar,
  	"cta_maps_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "places_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"places_id" integer,
  	"experiences_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_tags_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_media_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "articles_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_articles_blocks_media_block_variant" DEFAULT 'breakout',
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_place_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"context" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_social_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "articles_blocks_social_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_social_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_articles_blocks_social_video_source" DEFAULT 'embed' NOT NULL,
  	"embed_url" varchar,
  	"video_file_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_social_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "articles_blocks_social_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_articles_type" NOT NULL,
  	"order" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"hero_image_id" integer,
  	"tagline" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"places_id" integer,
  	"experiences_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_image_id" integer,
  	"tagline" varchar,
  	"summary" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experiences_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "experiences_blocks_media_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "experiences_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_experiences_blocks_media_block_variant" DEFAULT 'breakout',
  	"block_name" varchar
  );
  
  CREATE TABLE "experiences_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "experiences_blocks_place_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"context" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "experiences_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "experiences_timing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"moment" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "experiences_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "experiences_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_experiences_gallery_layout" DEFAULT 'single' NOT NULL
  );
  
  CREATE TABLE "experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"destination_id" integer,
  	"order" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"hero_image_id" integer,
  	"summary" varchar,
  	"tagline" varchar,
  	"timing_title" varchar DEFAULT 'Cuándo ir',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experiences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"places_id" integer,
  	"experiences_id" integer,
  	"destinations_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"places_id" integer,
  	"tags_id" integer,
  	"articles_id" integer,
  	"destinations_id" integer,
  	"pages_id" integer,
  	"experiences_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_gallery_images" ADD CONSTRAINT "places_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places_gallery_images" ADD CONSTRAINT "places_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_gallery" ADD CONSTRAINT "places_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_highlights" ADD CONSTRAINT "places_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_related_places" ADD CONSTRAINT "places_related_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_text_block" ADD CONSTRAINT "articles_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_media_block_images" ADD CONSTRAINT "articles_blocks_media_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_media_block_images" ADD CONSTRAINT "articles_blocks_media_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_media_block" ADD CONSTRAINT "articles_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_quote_block" ADD CONSTRAINT "articles_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_place_block" ADD CONSTRAINT "articles_blocks_place_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_carousel_slides" ADD CONSTRAINT "articles_blocks_social_carousel_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_carousel_slides" ADD CONSTRAINT "articles_blocks_social_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_social_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_carousel" ADD CONSTRAINT "articles_blocks_social_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_video" ADD CONSTRAINT "articles_blocks_social_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_video" ADD CONSTRAINT "articles_blocks_social_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_gallery_images" ADD CONSTRAINT "articles_blocks_social_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_gallery_images" ADD CONSTRAINT "articles_blocks_social_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_social_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_social_gallery" ADD CONSTRAINT "articles_blocks_social_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_blocks_text_block" ADD CONSTRAINT "experiences_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_blocks_media_block_images" ADD CONSTRAINT "experiences_blocks_media_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_blocks_media_block_images" ADD CONSTRAINT "experiences_blocks_media_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_blocks_media_block" ADD CONSTRAINT "experiences_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_blocks_quote_block" ADD CONSTRAINT "experiences_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_blocks_place_block" ADD CONSTRAINT "experiences_blocks_place_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_highlights" ADD CONSTRAINT "experiences_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_timing" ADD CONSTRAINT "experiences_timing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_gallery_images" ADD CONSTRAINT "experiences_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_gallery_images" ADD CONSTRAINT "experiences_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_gallery" ADD CONSTRAINT "experiences_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "places_gallery_images_order_idx" ON "places_gallery_images" USING btree ("_order");
  CREATE INDEX "places_gallery_images_parent_id_idx" ON "places_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "places_gallery_images_image_idx" ON "places_gallery_images" USING btree ("image_id");
  CREATE INDEX "places_gallery_order_idx" ON "places_gallery" USING btree ("_order");
  CREATE INDEX "places_gallery_parent_id_idx" ON "places_gallery" USING btree ("_parent_id");
  CREATE INDEX "places_highlights_order_idx" ON "places_highlights" USING btree ("_order");
  CREATE INDEX "places_highlights_parent_id_idx" ON "places_highlights" USING btree ("_parent_id");
  CREATE INDEX "places_related_places_order_idx" ON "places_related_places" USING btree ("_order");
  CREATE INDEX "places_related_places_parent_id_idx" ON "places_related_places" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "places_slug_idx" ON "places" USING btree ("slug");
  CREATE INDEX "places_destination_idx" ON "places" USING btree ("destination_id");
  CREATE INDEX "places_hero_image_idx" ON "places" USING btree ("hero_image_id");
  CREATE INDEX "places_card_image_idx" ON "places" USING btree ("card_image_id");
  CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
  CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
  CREATE INDEX "places_rels_order_idx" ON "places_rels" USING btree ("order");
  CREATE INDEX "places_rels_parent_idx" ON "places_rels" USING btree ("parent_id");
  CREATE INDEX "places_rels_path_idx" ON "places_rels" USING btree ("path");
  CREATE INDEX "places_rels_tags_id_idx" ON "places_rels" USING btree ("tags_id");
  CREATE INDEX "places_rels_places_id_idx" ON "places_rels" USING btree ("places_id");
  CREATE INDEX "places_rels_experiences_id_idx" ON "places_rels" USING btree ("experiences_id");
  CREATE INDEX "places_rels_articles_id_idx" ON "places_rels" USING btree ("articles_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "articles_blocks_text_block_order_idx" ON "articles_blocks_text_block" USING btree ("_order");
  CREATE INDEX "articles_blocks_text_block_parent_id_idx" ON "articles_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_text_block_path_idx" ON "articles_blocks_text_block" USING btree ("_path");
  CREATE INDEX "articles_blocks_media_block_images_order_idx" ON "articles_blocks_media_block_images" USING btree ("_order");
  CREATE INDEX "articles_blocks_media_block_images_parent_id_idx" ON "articles_blocks_media_block_images" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_media_block_images_image_idx" ON "articles_blocks_media_block_images" USING btree ("image_id");
  CREATE INDEX "articles_blocks_media_block_order_idx" ON "articles_blocks_media_block" USING btree ("_order");
  CREATE INDEX "articles_blocks_media_block_parent_id_idx" ON "articles_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_media_block_path_idx" ON "articles_blocks_media_block" USING btree ("_path");
  CREATE INDEX "articles_blocks_quote_block_order_idx" ON "articles_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "articles_blocks_quote_block_parent_id_idx" ON "articles_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_quote_block_path_idx" ON "articles_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "articles_blocks_place_block_order_idx" ON "articles_blocks_place_block" USING btree ("_order");
  CREATE INDEX "articles_blocks_place_block_parent_id_idx" ON "articles_blocks_place_block" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_place_block_path_idx" ON "articles_blocks_place_block" USING btree ("_path");
  CREATE INDEX "articles_blocks_social_carousel_slides_order_idx" ON "articles_blocks_social_carousel_slides" USING btree ("_order");
  CREATE INDEX "articles_blocks_social_carousel_slides_parent_id_idx" ON "articles_blocks_social_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_social_carousel_slides_image_idx" ON "articles_blocks_social_carousel_slides" USING btree ("image_id");
  CREATE INDEX "articles_blocks_social_carousel_order_idx" ON "articles_blocks_social_carousel" USING btree ("_order");
  CREATE INDEX "articles_blocks_social_carousel_parent_id_idx" ON "articles_blocks_social_carousel" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_social_carousel_path_idx" ON "articles_blocks_social_carousel" USING btree ("_path");
  CREATE INDEX "articles_blocks_social_video_order_idx" ON "articles_blocks_social_video" USING btree ("_order");
  CREATE INDEX "articles_blocks_social_video_parent_id_idx" ON "articles_blocks_social_video" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_social_video_path_idx" ON "articles_blocks_social_video" USING btree ("_path");
  CREATE INDEX "articles_blocks_social_video_video_file_idx" ON "articles_blocks_social_video" USING btree ("video_file_id");
  CREATE INDEX "articles_blocks_social_gallery_images_order_idx" ON "articles_blocks_social_gallery_images" USING btree ("_order");
  CREATE INDEX "articles_blocks_social_gallery_images_parent_id_idx" ON "articles_blocks_social_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_social_gallery_images_image_idx" ON "articles_blocks_social_gallery_images" USING btree ("image_id");
  CREATE INDEX "articles_blocks_social_gallery_order_idx" ON "articles_blocks_social_gallery" USING btree ("_order");
  CREATE INDEX "articles_blocks_social_gallery_parent_id_idx" ON "articles_blocks_social_gallery" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_social_gallery_path_idx" ON "articles_blocks_social_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_destinations_id_idx" ON "articles_rels" USING btree ("destinations_id");
  CREATE INDEX "articles_rels_places_id_idx" ON "articles_rels" USING btree ("places_id");
  CREATE INDEX "articles_rels_experiences_id_idx" ON "articles_rels" USING btree ("experiences_id");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "experiences_blocks_text_block_order_idx" ON "experiences_blocks_text_block" USING btree ("_order");
  CREATE INDEX "experiences_blocks_text_block_parent_id_idx" ON "experiences_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "experiences_blocks_text_block_path_idx" ON "experiences_blocks_text_block" USING btree ("_path");
  CREATE INDEX "experiences_blocks_media_block_images_order_idx" ON "experiences_blocks_media_block_images" USING btree ("_order");
  CREATE INDEX "experiences_blocks_media_block_images_parent_id_idx" ON "experiences_blocks_media_block_images" USING btree ("_parent_id");
  CREATE INDEX "experiences_blocks_media_block_images_image_idx" ON "experiences_blocks_media_block_images" USING btree ("image_id");
  CREATE INDEX "experiences_blocks_media_block_order_idx" ON "experiences_blocks_media_block" USING btree ("_order");
  CREATE INDEX "experiences_blocks_media_block_parent_id_idx" ON "experiences_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "experiences_blocks_media_block_path_idx" ON "experiences_blocks_media_block" USING btree ("_path");
  CREATE INDEX "experiences_blocks_quote_block_order_idx" ON "experiences_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "experiences_blocks_quote_block_parent_id_idx" ON "experiences_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "experiences_blocks_quote_block_path_idx" ON "experiences_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "experiences_blocks_place_block_order_idx" ON "experiences_blocks_place_block" USING btree ("_order");
  CREATE INDEX "experiences_blocks_place_block_parent_id_idx" ON "experiences_blocks_place_block" USING btree ("_parent_id");
  CREATE INDEX "experiences_blocks_place_block_path_idx" ON "experiences_blocks_place_block" USING btree ("_path");
  CREATE INDEX "experiences_highlights_order_idx" ON "experiences_highlights" USING btree ("_order");
  CREATE INDEX "experiences_highlights_parent_id_idx" ON "experiences_highlights" USING btree ("_parent_id");
  CREATE INDEX "experiences_timing_order_idx" ON "experiences_timing" USING btree ("_order");
  CREATE INDEX "experiences_timing_parent_id_idx" ON "experiences_timing" USING btree ("_parent_id");
  CREATE INDEX "experiences_gallery_images_order_idx" ON "experiences_gallery_images" USING btree ("_order");
  CREATE INDEX "experiences_gallery_images_parent_id_idx" ON "experiences_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "experiences_gallery_images_image_idx" ON "experiences_gallery_images" USING btree ("image_id");
  CREATE INDEX "experiences_gallery_order_idx" ON "experiences_gallery" USING btree ("_order");
  CREATE INDEX "experiences_gallery_parent_id_idx" ON "experiences_gallery" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "experiences_slug_idx" ON "experiences" USING btree ("slug");
  CREATE INDEX "experiences_destination_idx" ON "experiences" USING btree ("destination_id");
  CREATE INDEX "experiences_hero_image_idx" ON "experiences" USING btree ("hero_image_id");
  CREATE INDEX "experiences_updated_at_idx" ON "experiences" USING btree ("updated_at");
  CREATE INDEX "experiences_created_at_idx" ON "experiences" USING btree ("created_at");
  CREATE INDEX "experiences_rels_order_idx" ON "experiences_rels" USING btree ("order");
  CREATE INDEX "experiences_rels_parent_idx" ON "experiences_rels" USING btree ("parent_id");
  CREATE INDEX "experiences_rels_path_idx" ON "experiences_rels" USING btree ("path");
  CREATE INDEX "experiences_rels_places_id_idx" ON "experiences_rels" USING btree ("places_id");
  CREATE INDEX "experiences_rels_experiences_id_idx" ON "experiences_rels" USING btree ("experiences_id");
  CREATE INDEX "experiences_rels_destinations_id_idx" ON "experiences_rels" USING btree ("destinations_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_places_id_idx" ON "payload_locked_documents_rels" USING btree ("places_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("experiences_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "places_gallery_images" CASCADE;
  DROP TABLE "places_gallery" CASCADE;
  DROP TABLE "places_highlights" CASCADE;
  DROP TABLE "places_related_places" CASCADE;
  DROP TABLE "places" CASCADE;
  DROP TABLE "places_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "articles_blocks_text_block" CASCADE;
  DROP TABLE "articles_blocks_media_block_images" CASCADE;
  DROP TABLE "articles_blocks_media_block" CASCADE;
  DROP TABLE "articles_blocks_quote_block" CASCADE;
  DROP TABLE "articles_blocks_place_block" CASCADE;
  DROP TABLE "articles_blocks_social_carousel_slides" CASCADE;
  DROP TABLE "articles_blocks_social_carousel" CASCADE;
  DROP TABLE "articles_blocks_social_video" CASCADE;
  DROP TABLE "articles_blocks_social_gallery_images" CASCADE;
  DROP TABLE "articles_blocks_social_gallery" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "experiences_blocks_text_block" CASCADE;
  DROP TABLE "experiences_blocks_media_block_images" CASCADE;
  DROP TABLE "experiences_blocks_media_block" CASCADE;
  DROP TABLE "experiences_blocks_quote_block" CASCADE;
  DROP TABLE "experiences_blocks_place_block" CASCADE;
  DROP TABLE "experiences_highlights" CASCADE;
  DROP TABLE "experiences_timing" CASCADE;
  DROP TABLE "experiences_gallery_images" CASCADE;
  DROP TABLE "experiences_gallery" CASCADE;
  DROP TABLE "experiences" CASCADE;
  DROP TABLE "experiences_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_places_gallery_layout";
  DROP TYPE "public"."enum_places_type";
  DROP TYPE "public"."enum_tags_type";
  DROP TYPE "public"."enum_articles_blocks_media_block_variant";
  DROP TYPE "public"."enum_articles_blocks_social_video_source";
  DROP TYPE "public"."enum_articles_type";
  DROP TYPE "public"."enum_experiences_blocks_media_block_variant";
  DROP TYPE "public"."enum_experiences_gallery_layout";`)
}
