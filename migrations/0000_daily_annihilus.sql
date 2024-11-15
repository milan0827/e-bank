CREATE TYPE "public"."currency_enum" AS ENUM('NRS', 'EURO', 'USD');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"balance" double precision NOT NULL,
	"currency" "currency_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"acmount" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_account_id" integer NOT NULL,
	"to_account_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_account_id_accounts_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_account_id_accounts_id_fk" FOREIGN KEY ("to_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "full_name_idx" ON "accounts" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_idx" ON "entries" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "from_account_idx" ON "transfers" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "to_account_idx" ON "transfers" USING btree ("id");