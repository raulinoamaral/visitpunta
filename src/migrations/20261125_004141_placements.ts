import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_placements_slot" AS ENUM('home.season', 'home.stay', 'home.spotlight', 'home.eat', 'home.coffee', 'home.todo', 'home.notes', 'stay.first', 'eat.first', 'eat.beachNote', 'eat.coffeeNote', 'explore.start', 'explore.bandNote', 'explore.guides', 'zone.guide', 'zone.spotlight', 'zone.stayFirst', 'zone.eatFirst');
  CREATE TYPE "public"."enum_placements_locale" AS ENUM('all', 'es', 'pt');
  CREATE TABLE "placements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slot" "enum_placements_slot" NOT NULL,
  	"zone_id" integer,
  	"position" numeric DEFAULT 1,
  	"from" varchar,
  	"to" varchar,
  	"locale" "enum_placements_locale" DEFAULT 'all' NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "placements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"places_id" integer,
  	"articles_id" integer,
  	"experiences_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "placements_id" integer;
  ALTER TABLE "placements" ADD CONSTRAINT "placements_zone_id_destinations_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "placements_rels" ADD CONSTRAINT "placements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "placements_rels" ADD CONSTRAINT "placements_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "placements_rels" ADD CONSTRAINT "placements_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "placements_rels" ADD CONSTRAINT "placements_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "placements_slot_idx" ON "placements" USING btree ("slot");
  CREATE INDEX "placements_zone_idx" ON "placements" USING btree ("zone_id");
  CREATE INDEX "placements_updated_at_idx" ON "placements" USING btree ("updated_at");
  CREATE INDEX "placements_created_at_idx" ON "placements" USING btree ("created_at");
  CREATE INDEX "placements_rels_order_idx" ON "placements_rels" USING btree ("order");
  CREATE INDEX "placements_rels_parent_idx" ON "placements_rels" USING btree ("parent_id");
  CREATE INDEX "placements_rels_path_idx" ON "placements_rels" USING btree ("path");
  CREATE INDEX "placements_rels_places_id_idx" ON "placements_rels" USING btree ("places_id");
  CREATE INDEX "placements_rels_articles_id_idx" ON "placements_rels" USING btree ("articles_id");
  CREATE INDEX "placements_rels_experiences_id_idx" ON "placements_rels" USING btree ("experiences_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_placements_fk" FOREIGN KEY ("placements_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_placements_id_idx" ON "payload_locked_documents_rels" USING btree ("placements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "placements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "placements_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "placements" CASCADE;
  DROP TABLE "placements_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_placements_fk";
  
  DROP INDEX "payload_locked_documents_rels_placements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "placements_id";
  DROP TYPE "public"."enum_placements_slot";
  DROP TYPE "public"."enum_placements_locale";`)
}
