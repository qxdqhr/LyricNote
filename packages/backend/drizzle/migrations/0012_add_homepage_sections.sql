-- 首页配置表
CREATE TABLE IF NOT EXISTS "homepage_sections" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "background_image" text,
  "order" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "homepage_sections_order_idx" ON "homepage_sections"("order");
CREATE INDEX IF NOT EXISTS "homepage_sections_is_active_idx" ON "homepage_sections"("is_active");

-- 插入默认数据
INSERT INTO "homepage_sections" ("title", "description", "background_image", "order", "is_active") VALUES
('欢迎使用 LyricNote', '一个现代化的音乐歌词管理平台，为您提供最佳的音乐体验', '/images/default-bg-1.jpg', 1, true),
('强大的功能', '支持歌词识别、智能匹配、多语言翻译等强大功能，让音乐管理变得简单高效', '/images/default-bg-2.jpg', 2, true),
('开始探索', '立即开始使用 LyricNote，体验全新的音乐歌词管理方式', '/images/default-bg-3.jpg', 3, true);

