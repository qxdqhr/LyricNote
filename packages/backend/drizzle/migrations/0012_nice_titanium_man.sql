CREATE TYPE "public"."PaymentStatus" AS ENUM('pending', 'paid', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."TradeType" AS ENUM('JSAPI', 'NATIVE', 'APP', 'MWEB');--> statement-breakpoint
CREATE TYPE "public"."WechatPlatform" AS ENUM('web', 'miniapp', 'mobile');--> statement-breakpoint
CREATE TABLE "homepage_sections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "homepage_sections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"background_image" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" text NOT NULL,
	"action" text NOT NULL,
	"request_data" jsonb,
	"response_data" jsonb,
	"status" text NOT NULL,
	"error_message" text,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" text NOT NULL,
	"user_id" text NOT NULL,
	"platform" text DEFAULT 'wechat' NOT NULL,
	"trade_type" "TradeType" NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'CNY' NOT NULL,
	"product_id" text,
	"product_name" text NOT NULL,
	"description" text,
	"status" "PaymentStatus" DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"prepay_id" text,
	"payment_time" timestamp(3),
	"callback_data" jsonb,
	"notify_count" integer DEFAULT 0 NOT NULL,
	"client_ip" text,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "payment_orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "user_wechat_bindings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_wechat_bindings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"platform" "WechatPlatform" NOT NULL,
	"openid" text NOT NULL,
	"unionid" text,
	"nickname" text,
	"avatar" text,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp(3),
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wechat_bindings" ADD CONSTRAINT "user_wechat_bindings_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "homepage_sections_order_idx" ON "homepage_sections" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "homepage_sections_is_active_idx" ON "homepage_sections" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "payment_logs_order_id_idx" ON "payment_logs" USING btree ("order_id" text_ops);--> statement-breakpoint
CREATE INDEX "payment_logs_action_idx" ON "payment_logs" USING btree ("action" text_ops);--> statement-breakpoint
CREATE INDEX "payment_logs_created_at_idx" ON "payment_logs" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "payment_orders_user_id_idx" ON "payment_orders" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "payment_orders_status_idx" ON "payment_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_orders_transaction_id_idx" ON "payment_orders" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "payment_orders_created_at_idx" ON "payment_orders" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "user_wechat_bindings_user_platform_key" ON "user_wechat_bindings" USING btree ("user_id" text_ops,"platform");--> statement-breakpoint
CREATE UNIQUE INDEX "user_wechat_bindings_platform_openid_key" ON "user_wechat_bindings" USING btree ("platform","openid" text_ops);--> statement-breakpoint
CREATE INDEX "user_wechat_bindings_user_id_idx" ON "user_wechat_bindings" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "user_wechat_bindings_unionid_idx" ON "user_wechat_bindings" USING btree ("unionid" text_ops);