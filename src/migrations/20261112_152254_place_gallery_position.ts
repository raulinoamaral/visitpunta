import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_places_gallery_layout" ADD VALUE 'single' BEFORE 'duo';
  ALTER TABLE "places_gallery" ADD COLUMN "after_paragraph" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "places_gallery" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "places_gallery" ALTER COLUMN "layout" SET DEFAULT 'duo'::text;
  DROP TYPE "public"."enum_places_gallery_layout";
  CREATE TYPE "public"."enum_places_gallery_layout" AS ENUM('duo', 'grid', 'featured-bottom', 'featured-side');
  ALTER TABLE "places_gallery" ALTER COLUMN "layout" SET DEFAULT 'duo'::"public"."enum_places_gallery_layout";
  ALTER TABLE "places_gallery" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_places_gallery_layout" USING "layout"::"public"."enum_places_gallery_layout";
  ALTER TABLE "places_gallery" DROP COLUMN "after_paragraph";`)
}
