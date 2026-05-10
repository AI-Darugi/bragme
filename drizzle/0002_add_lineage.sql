ALTER TABLE "cards" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "relation_type" text;--> statement-breakpoint
CREATE INDEX "cards_parent_id_idx" ON "cards" USING btree ("parent_id");