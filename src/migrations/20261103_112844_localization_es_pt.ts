import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'pt');
  CREATE TABLE "places_related_places_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "places_locales" (
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"summary" varchar,
  	"location" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"tagline" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "destinations_locales" (
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"tagline" varchar,
  	"summary" varchar,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "experiences_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"summary" varchar,
  	"tagline" varchar,
  	"timing_title" varchar DEFAULT 'Cuándo ir',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "places_slug_idx";
  DROP INDEX "articles_slug_idx";
  DROP INDEX "destinations_slug_idx";
  DROP INDEX "experiences_slug_idx";
  DROP INDEX "articles_rels_destinations_id_idx";
  DROP INDEX "articles_rels_places_id_idx";
  DROP INDEX "articles_rels_experiences_id_idx";
  DROP INDEX "articles_rels_articles_id_idx";
  DROP INDEX "experiences_rels_places_id_idx";
  DROP INDEX "experiences_rels_experiences_id_idx";
  DROP INDEX "experiences_rels_destinations_id_idx";
  ALTER TABLE "places_highlights" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_text_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_media_block_images" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_media_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_quote_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_place_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_social_carousel_slides" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_social_carousel" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_social_video" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_social_gallery_images" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_blocks_social_gallery" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "articles_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "experiences_blocks_text_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_blocks_media_block_images" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_blocks_media_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_blocks_quote_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_blocks_place_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_highlights" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_timing" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'es';
  ALTER TABLE "experiences_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "places_related_places_locales" ADD CONSTRAINT "places_related_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places_related_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_locales" ADD CONSTRAINT "places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_locales" ADD CONSTRAINT "experiences_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "places_related_places_locales_locale_parent_id_unique" ON "places_related_places_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "places_slug_idx" ON "places_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "places_locales_locale_parent_id_unique" ON "places_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "destinations_locales_locale_parent_id_unique" ON "destinations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "experiences_slug_idx" ON "experiences_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "experiences_locales_locale_parent_id_unique" ON "experiences_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "places_highlights_locale_idx" ON "places_highlights" USING btree ("_locale");
  CREATE INDEX "articles_blocks_text_block_locale_idx" ON "articles_blocks_text_block" USING btree ("_locale");
  CREATE INDEX "articles_blocks_media_block_images_locale_idx" ON "articles_blocks_media_block_images" USING btree ("_locale");
  CREATE INDEX "articles_blocks_media_block_locale_idx" ON "articles_blocks_media_block" USING btree ("_locale");
  CREATE INDEX "articles_blocks_quote_block_locale_idx" ON "articles_blocks_quote_block" USING btree ("_locale");
  CREATE INDEX "articles_blocks_place_block_locale_idx" ON "articles_blocks_place_block" USING btree ("_locale");
  CREATE INDEX "articles_blocks_social_carousel_slides_locale_idx" ON "articles_blocks_social_carousel_slides" USING btree ("_locale");
  CREATE INDEX "articles_blocks_social_carousel_locale_idx" ON "articles_blocks_social_carousel" USING btree ("_locale");
  CREATE INDEX "articles_blocks_social_video_locale_idx" ON "articles_blocks_social_video" USING btree ("_locale");
  CREATE INDEX "articles_blocks_social_gallery_images_locale_idx" ON "articles_blocks_social_gallery_images" USING btree ("_locale");
  CREATE INDEX "articles_blocks_social_gallery_locale_idx" ON "articles_blocks_social_gallery" USING btree ("_locale");
  CREATE INDEX "articles_rels_locale_idx" ON "articles_rels" USING btree ("locale");
  CREATE INDEX "experiences_blocks_text_block_locale_idx" ON "experiences_blocks_text_block" USING btree ("_locale");
  CREATE INDEX "experiences_blocks_media_block_images_locale_idx" ON "experiences_blocks_media_block_images" USING btree ("_locale");
  CREATE INDEX "experiences_blocks_media_block_locale_idx" ON "experiences_blocks_media_block" USING btree ("_locale");
  CREATE INDEX "experiences_blocks_quote_block_locale_idx" ON "experiences_blocks_quote_block" USING btree ("_locale");
  CREATE INDEX "experiences_blocks_place_block_locale_idx" ON "experiences_blocks_place_block" USING btree ("_locale");
  CREATE INDEX "experiences_highlights_locale_idx" ON "experiences_highlights" USING btree ("_locale");
  CREATE INDEX "experiences_timing_locale_idx" ON "experiences_timing" USING btree ("_locale");
  CREATE INDEX "experiences_rels_locale_idx" ON "experiences_rels" USING btree ("locale");
  CREATE INDEX "articles_rels_destinations_id_idx" ON "articles_rels" USING btree ("destinations_id","locale");
  CREATE INDEX "articles_rels_places_id_idx" ON "articles_rels" USING btree ("places_id","locale");
  CREATE INDEX "articles_rels_experiences_id_idx" ON "articles_rels" USING btree ("experiences_id","locale");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id","locale");
  CREATE INDEX "experiences_rels_places_id_idx" ON "experiences_rels" USING btree ("places_id","locale");
  CREATE INDEX "experiences_rels_experiences_id_idx" ON "experiences_rels" USING btree ("experiences_id","locale");
  CREATE INDEX "experiences_rels_destinations_id_idx" ON "experiences_rels" USING btree ("destinations_id","locale");
  
  -- ── Data copy (hand-written): all existing content becomes the Spanish version ──
  INSERT INTO "places_locales" ("slug", "published", "summary", "location", "description", "seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "slug", true, "summary", "location", "description", "seo_title", "seo_description", 'es', "id" FROM "places";
  INSERT INTO "places_related_places_locales" ("title", "_locale", "_parent_id")
    SELECT "title", 'es', "id" FROM "places_related_places";
  INSERT INTO "tags_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'es', "id" FROM "tags";
  INSERT INTO "articles_locales" ("title", "slug", "published", "tagline", "seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "title", "slug", COALESCE("published", true), "tagline", "seo_title", "seo_description", 'es', "id" FROM "articles";
  INSERT INTO "destinations_locales" ("slug", "published", "tagline", "summary", "description", "seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "slug", true, "tagline", "summary", "description", "seo_title", "seo_description", 'es', "id" FROM "destinations";
  INSERT INTO "experiences_locales" ("title", "slug", "published", "summary", "tagline", "timing_title", "seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "title", "slug", COALESCE("published", true), "summary", "tagline", "timing_title", "seo_title", "seo_description", 'es', "id" FROM "experiences";
  -- Relationships inside the (now localized) blocks belong to the Spanish version; the rest stay shared (NULL)
  UPDATE "articles_rels" SET "locale" = 'es' WHERE "path" LIKE 'layout.%';
  UPDATE "experiences_rels" SET "locale" = 'es' WHERE "path" LIKE 'content.%';
  ALTER TABLE "places_highlights" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_text_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_media_block_images" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_media_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_quote_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_place_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_social_carousel_slides" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_social_carousel" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_social_video" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_social_gallery_images" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "articles_blocks_social_gallery" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_blocks_text_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_blocks_media_block_images" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_blocks_media_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_blocks_quote_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_blocks_place_block" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_highlights" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "experiences_timing" ALTER COLUMN "_locale" DROP DEFAULT;
  -- ── End of data copy ──
  ALTER TABLE "places_related_places" DROP COLUMN "title";
  ALTER TABLE "places" DROP COLUMN "slug";
  ALTER TABLE "places" DROP COLUMN "summary";
  ALTER TABLE "places" DROP COLUMN "location";
  ALTER TABLE "places" DROP COLUMN "description";
  ALTER TABLE "places" DROP COLUMN "seo_title";
  ALTER TABLE "places" DROP COLUMN "seo_description";
  ALTER TABLE "tags" DROP COLUMN "label";
  ALTER TABLE "articles" DROP COLUMN "title";
  ALTER TABLE "articles" DROP COLUMN "slug";
  ALTER TABLE "articles" DROP COLUMN "published";
  ALTER TABLE "articles" DROP COLUMN "tagline";
  ALTER TABLE "articles" DROP COLUMN "seo_title";
  ALTER TABLE "articles" DROP COLUMN "seo_description";
  ALTER TABLE "destinations" DROP COLUMN "slug";
  ALTER TABLE "destinations" DROP COLUMN "tagline";
  ALTER TABLE "destinations" DROP COLUMN "summary";
  ALTER TABLE "destinations" DROP COLUMN "description";
  ALTER TABLE "destinations" DROP COLUMN "seo_title";
  ALTER TABLE "destinations" DROP COLUMN "seo_description";
  ALTER TABLE "experiences" DROP COLUMN "title";
  ALTER TABLE "experiences" DROP COLUMN "slug";
  ALTER TABLE "experiences" DROP COLUMN "published";
  ALTER TABLE "experiences" DROP COLUMN "summary";
  ALTER TABLE "experiences" DROP COLUMN "tagline";
  ALTER TABLE "experiences" DROP COLUMN "timing_title";
  ALTER TABLE "experiences" DROP COLUMN "seo_title";
  ALTER TABLE "experiences" DROP COLUMN "seo_description";`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Irreversible on purpose: going back would drop all translations and recreate empty
  // columns. Restore the pre-migration database backup instead.
  throw new Error('localization_es_pt cannot be reverted; restore the pre-migration backup')
}
