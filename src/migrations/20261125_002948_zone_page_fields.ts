import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "destinations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experiences_id" integer,
  	"places_id" integer
  );
  
  ALTER TABLE "destinations" ADD COLUMN "guide_id" integer;
  ALTER TABLE "destinations_locales" ADD COLUMN "hero_caption" varchar;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "destinations_rels_order_idx" ON "destinations_rels" USING btree ("order");
  CREATE INDEX "destinations_rels_parent_idx" ON "destinations_rels" USING btree ("parent_id");
  CREATE INDEX "destinations_rels_path_idx" ON "destinations_rels" USING btree ("path");
  CREATE INDEX "destinations_rels_experiences_id_idx" ON "destinations_rels" USING btree ("experiences_id");
  CREATE INDEX "destinations_rels_places_id_idx" ON "destinations_rels" USING btree ("places_id");
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_guide_id_articles_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "destinations_guide_idx" ON "destinations" USING btree ("guide_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "destinations_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "destinations_rels" CASCADE;
  ALTER TABLE "destinations" DROP CONSTRAINT "destinations_guide_id_articles_id_fk";
  
  DROP INDEX "destinations_guide_idx";
  ALTER TABLE "destinations" DROP COLUMN "guide_id";
  ALTER TABLE "destinations_locales" DROP COLUMN "hero_caption";`)
}
