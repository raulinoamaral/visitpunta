import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_caption" varchar,
  	"spotlight_quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"articles_id" integer,
  	"places_id" integer,
  	"experiences_id" integer
  );
  
  ALTER TABLE "places" ADD COLUMN "home_season_from" varchar;
  ALTER TABLE "places" ADD COLUMN "home_season_to" varchar;
  ALTER TABLE "articles" ADD COLUMN "home_season_from" varchar;
  ALTER TABLE "articles" ADD COLUMN "home_season_to" varchar;
  ALTER TABLE "experiences" ADD COLUMN "home_season_from" varchar;
  ALTER TABLE "experiences" ADD COLUMN "home_season_to" varchar;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_locale_idx" ON "home_rels" USING btree ("locale");
  CREATE INDEX "home_rels_articles_id_idx" ON "home_rels" USING btree ("articles_id","locale");
  CREATE INDEX "home_rels_places_id_idx" ON "home_rels" USING btree ("places_id","locale");
  CREATE INDEX "home_rels_experiences_id_idx" ON "home_rels" USING btree ("experiences_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  ALTER TABLE "places" DROP COLUMN "home_season_from";
  ALTER TABLE "places" DROP COLUMN "home_season_to";
  ALTER TABLE "articles" DROP COLUMN "home_season_from";
  ALTER TABLE "articles" DROP COLUMN "home_season_to";
  ALTER TABLE "experiences" DROP COLUMN "home_season_from";
  ALTER TABLE "experiences" DROP COLUMN "home_season_to";`)
}
