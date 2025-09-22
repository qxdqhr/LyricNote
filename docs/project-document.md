# LyricNote - 日语音乐识曲应用完整项目文档

## 📋 文档信息

| 项目 | 内容 |
|------|------|
| **文档名称** | LyricNote 日语音乐识曲应用完整项目文档 |
| **项目名称** | LyricNote - 专注日语歌曲的AI智能听歌识曲App |
| **文档版本** | v3.0 |
| **创建日期** | 2025年9月21日 |
| **最后修改** | 2025年9月21日 |
| **状态** | 已完成 |
| **核心特色** | 日语歌词多语言显示（汉字/假名/罗马音） |

---

## 🎯 项目概述

### 产品名称
**LyricNote** - 专注日语歌曲的AI智能听歌识曲应用

### 产品定位
一款专门针对日语歌曲优化的React Native Expo听歌识曲应用，通过先进的音频识别技术和DeepSeek大模型，帮助用户快速识别日语音乐，并提供**汉字、假名、罗马音三种显示模式**的智能歌词匹配和同步显示功能。特别为学习日语、喜爱日本音乐的用户群体设计。

**核心特色**：
- 🎌 **日语专精** - 专门优化日语歌曲识别和处理
- 📝 **三语切换** - 汉字、假名、罗马音一键切换
- 🤖 **AI智能** - DeepSeek大模型驱动的日语歌词智能处理
- 🎵 **秒级识别** - 快速准确识别日语音乐
- 🎤 **KTV救星** - 支持日语KTV场景，多语言显示
- 🎨 **歌词手帐** - AI辅助的精美日语歌词收藏和创意编辑
- 📱 **即时同步** - 实时跟随歌曲进度显示歌词
- 💫 **创意分享** - 分享个性化日语歌词手帐作品

### 技术栈
- **用户端**: React Native Expo
- **管理端**: Next.js
- **后端**: Next.js API Routes + Node.js
- **AI引擎**: 阿里云调用DeepSeek大模型API（日语专门优化）
- **数据库**: PostgreSQL + Redis
- **文件存储**: 阿里云OSS
- **日语处理**: Kuroshiro.js + MeCab形态素解析

---

## 👥 用户角色与需求

### 2.1 用户角色定义

#### 2.1.1 日语学习者
- **描述**: 正在学习日语，喜欢通过日语歌曲提升语言能力的用户
- **主要需求**: 
  - 快速识别日语歌曲
  - 汉字、假名、罗马音多角度学习歌词
  - 发音辅助和语言学习功能
  - 收藏和复习喜欢的日语歌词
- **使用场景**: 日常学习、听歌练习、语言复习
- **技术水平**: 基础移动应用使用能力

#### 2.1.2 日本音乐爱好者
- **描述**: 热爱日本音乐文化，经常听日语歌曲的用户
- **主要需求**:
  - 精准识别各类日语歌曲（J-POP、动漫歌曲、传统音乐等）
  - 理解歌词含义，享受音乐文化
  - 在KTV场景下能够准确演唱日语歌曲
  - 收集和整理喜爱的日语歌曲
- **使用场景**: 日常听歌、KTV包厢、音乐分享
- **技术水平**: 熟练的移动应用使用能力

#### 2.1.3 KTV用户（日语歌曲）
- **描述**: 经常在KTV演唱日语歌曲的用户
- **主要需求**: 
  - 快速识别正在播放的日语歌曲
  - 大字体显示歌词，支持假名读音
  - 罗马音辅助发音
  - 清晰的歌词同步显示
- **使用场景**: KTV包厢、家庭聚会、朋友聚会
- **技术水平**: 基础移动应用使用能力

#### 2.1.4 内容创作者
- **描述**: 制作日语相关内容的博主、教师、翻译者等
- **主要需求**:
  - 高精度日语歌词识别和处理
  - AI辅助的日语歌词手帐创作
  - 多语言歌词展示和分享功能
  - 批量日语歌词处理和管理
- **使用场景**: 内容制作、教学准备、文化推广
- **技术水平**: 高级移动应用使用能力

#### 2.1.5 管理员角色
- **描述**: 系统管理员，负责日语内容管理和用户管理
- **主要需求**:
  - 日语歌词质量管控和审核
  - 用户管理和权限控制
  - 日语AI模型管理和优化
  - 数据分析和系统监控
- **使用场景**: 后台管理、内容运营、数据分析
- **技术水平**: 专业系统管理能力

---

## 🔧 核心功能规格

### 3.1 日语音乐识别功能 (FR-001) ⭐ **核心功能**
**优先级**: 最高  
**需求描述**: 专门优化的日语音乐识别系统，支持各类日语歌曲类型

**详细需求**:
- [FR-001-01] 用户点击识别按钮开始录音
- [FR-001-02] 应用录制5-15秒的环境音频（KTV场景优化）
- [FR-001-03] **日语歌曲专门优化**：支持J-POP、动漫歌曲、传统音乐等
- [FR-001-04] 系统在3秒内返回识别结果
- [FR-001-05] 日语歌曲识别准确率达到95%以上
- [FR-001-06] 支持录音过程中的取消操作
- [FR-001-07] 显示录音进度和状态
- [FR-001-08] 识别成功后立即跳转到日语歌词显示页面

**日语优化特性**:
- 支持各大日本音乐平台的歌曲库
- 优化对日语发音特征的识别算法
- 特别支持动漫、游戏音乐的识别

**验收标准**:
- 识别按钮响应时间 < 500ms
- 日语歌曲识别准确率 ≥ 95%
- 识别响应时间 ≤ 3秒
- 支持至少10万首日语歌曲的识别库

### 3.2 AI智能日语歌词处理功能 (FR-002) ⭐ **核心功能**
**优先级**: 最高  
**需求描述**: 利用DeepSeek大模型和日语处理引擎，提供汉字、假名、罗马音的智能转换和显示

**详细需求**:
- [FR-002-01] 根据识别结果自动搜索对应的日语歌词
- [FR-002-02] **智能语言分析**：自动识别汉字、假名混合文本
- [FR-002-03] **假名转换**：汉字自动标注假名读音
- [FR-002-04] **罗马音生成**：假名自动转换为罗马音
- [FR-002-05] **AI品质检测**：DeepSeek模型验证转换准确性
- [FR-002-06] 支持手动校正和编辑功能
- [FR-002-07] 智能断句和语法分析
- [FR-002-08] 无歌词时提供AI生成的日语学习建议

**AI集成点**:
- 日语语义理解和歌词匹配
- 汉字假名标注的准确性验证
- 歌词质量评分和优化建议
- 日语语法和语言学习辅助

**验收标准**:
- 日语歌词匹配成功率 ≥ 90%
- 假名标注准确率 ≥ 98%
- 罗马音转换准确率 ≥ 99%
- 歌词搜索响应时间 ≤ 2秒
- AI处理延迟 ≤ 3秒

### 3.3 多语言歌词显示功能 (FR-003) ⭐ **核心特色功能**
**优先级**: 最高  
**需求描述**: 基于全局KTV模式的智能歌词显示系统，支持汉字、假名、罗马音三种模式切换

**详细需求**:
- [FR-003-01] 根据识别时刻精准计算歌曲当前播放位置
- [FR-003-02] **智能模式切换**：根据全局KTV开关自动切换显示界面
- [FR-003-03] **三语言切换**：支持汉字、假名、罗马音一键切换
  - **汉字模式**：显示原文汉字歌词（日语原文）
  - **假名模式**：显示假名读音，帮助发音学习
  - **罗马音模式**：显示罗马音转写，便于外国学习者
- [FR-003-04] **标准模式**：歌词逐行滚动显示，高亮当前演唱句
- [FR-003-05] **KTV模式**：全屏大字体、高对比度显示
- [FR-003-06] 支持手动时间偏移调节（±5秒范围）
- [FR-003-07] 支持歌词字体大小调节
- [FR-003-08] 支持暂停/继续同步功能
- [FR-003-09] **语言学习模式**：同时显示多种语言形式
- [FR-003-10] **全局配置**：首页KTV开关控制全局歌词显示模式

**语言切换逻辑**:
```
汉字模式: 恋をしたのは (原文显示)
↓
假名模式: こいをしたのは (假名读音)
↓  
罗马音模式: koi wo shita no wa (罗马音转写)
```

**验收标准**:
- 歌词同步延迟 ≤ 100ms
- 时间定位精度 ± 0.5秒
- 语言切换响应时间 ≤ 200ms
- KTV模式下5米外清晰可读
- 支持3-5级字体大小调节
- 三种语言模式准确率 ≥ 98%

### 3.4 日语歌词手帐创作功能 (FR-004) ⭐ **特色功能**
**优先级**: 中  
**需求描述**: 用户能够创作个性化的日语歌词手帐作品，AI提供日语文化相关的创作辅助

**详细需求**:
- [FR-004-01] 日语歌词文本导入和编辑功能
- [FR-004-02] **日式风格模板**：AI推荐和风、现代日式等风格
- [FR-004-03] **日语字体支持**：明朝体、黑体、书法体等
- [FR-004-04] 颜色和字体大小自定义
- [FR-004-05] **日式装饰元素**：樱花、和风图案、季节元素
- [FR-004-06] AI辅助日式布局模板推荐
- [FR-004-07] **多语言展示**：支持在手帐中同时展示汉字/假名/罗马音
- [FR-004-08] 实时预览和撤销/重做功能
- [FR-004-09] 高清图片导出（至少1080p）
- [FR-004-10] AI生成日语文化相关的创作建议

**AI集成点**:
- 日式美学布局推荐
- 和风色彩搭配建议
- 日语文化元素推荐
- 季节性装饰建议

**验收标准**:
- 编辑操作响应时间 < 500ms
- AI推荐准确率 > 85%
- 支持至少10种日式风格模板
- 图片导出质量清晰
- 多语言显示无乱码

### 3.5 智能收藏管理功能 (FR-005) ⭐ **功能增强**
**优先级**: 中  
**需求描述**: 专门针对日语歌曲的多收藏夹管理系统，支持按艺人、类型、学习进度分类

**详细需求**:
- [FR-005-01] **日语分类收藏夹**：支持按艺人、动漫、时代等分类
- [FR-005-02] **学习进度管理**：标记学习状态（已学会/练习中/待学习）
- [FR-005-03] **智能分类**：系统预设"J-POP"、"动漫歌曲"、"学习中"等
- [FR-005-04] **默认收藏夹设置**：设置识别歌曲自动添加的目标收藏夹
- [FR-005-05] 收藏夹管理：重命名、删除、排序收藏夹
- [FR-005-06] **日语搜索**：支持汉字、假名、罗马音搜索
- [FR-005-07] 歌曲归类：支持将歌曲移动到不同收藏夹
- [FR-005-08] 批量操作：多选歌曲进行批量管理
- [FR-005-09] 重复检测：避免同一首歌重复添加
- [FR-005-10] **学习统计**：记录学习进度和复习频率

**自动化功能**:
- 识别成功的日语歌曲自动添加到当前默认收藏夹
- 基于歌曲类型的智能分类建议
- 学习进度的智能提醒和推荐

**验收标准**:
- 支持创建至少30个自定义收藏夹
- 收藏夹切换响应时间 ≤ 300ms
- 批量操作支持最多100首歌曲
- 日语搜索结果返回时间 ≤ 500ms
- 支持多种日语输入方式

### 3.6 用户管理功能 (FR-006)
**优先级**: 中  
**需求描述**: 完整的用户注册登录和个人中心功能，支持日语学习偏好设置

**详细需求**:
- [FR-006-01] 支持手机号注册
- [FR-006-02] 支持第三方登录（微信、QQ、Apple）
- [FR-006-03] 提供密码重置功能
- [FR-006-04] 支持游客模式使用基础功能
- [FR-006-05] 用户资料编辑功能
- [FR-006-06] **日语学习偏好**：设置默认显示语言（汉字/假名/罗马音）
- [FR-006-07] **全局KTV模式设置**：用户偏好设置
- [FR-006-08] **学习统计**：日语歌曲学习进度和统计
- [FR-006-09] 账户注销功能

### 3.7 管理端功能 (FR-007)
**优先级**: 中  
**需求描述**: Next.js构建的管理端，专门用于日语内容管理和用户管理

**详细需求**:
- [FR-007-01] 用户管理：查看、编辑、封禁用户
- [FR-007-02] **日语内容管理**：歌词审核、质量管控、假名校正
- [FR-007-03] **日语歌曲库管理**：歌曲信息维护、分类管理
- [FR-007-04] 收藏夹管理：监控用户收藏夹使用情况
- [FR-007-05] **学习数据分析**：用户学习行为、歌曲热度、语言偏好统计
- [FR-007-06] AI模型管理：DeepSeek API调用监控，日语处理优化
- [FR-007-07] 系统监控：性能指标、错误日志
- [FR-007-08] **日语专项配置**：假名转换规则、罗马音标准设置

---

## 🏗️ 技术架构设计

### 4.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端                                │
├─────────────────────────────────────────────────────────────┤
│                React Native Expo App                       │
│          (iOS / Android - 日语优化)                       │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                        管理端                                │
├─────────────────────────────────────────────────────────────┤
│                     Next.js Web App                        │
│            (管理后台 + API Routes)                          │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      AI & 日语处理层                         │
├─────────────────────────────────────────────────────────────┤
│  阿里云API网关  │  DeepSeek大模型  │ Kuroshiro.js │ MeCab   │
│               │   (日语优化)     │  (假名处理)   │(形态素) │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │   Redis    │   阿里云OSS   │  日语歌词API     │
│ (主数据库)    │  (缓存)     │  (文件存储)    │ (多数据源)       │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 技术栈详细配置

#### 4.2.1 React Native Expo用户端（日语优化）
```json
{
  "expo": "~49.0.0",
  "react-native": "0.72.0",
  "typescript": "^5.0.0",
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "expo-av": "~13.4.1",
    "expo-file-system": "~15.4.3",
    "expo-permissions": "~14.2.1",
    "react-native-canvas": "^0.1.38",
    "react-native-svg": "^13.9.0",
    "react-native-reanimated": "~3.3.0",
    "react-native-vector-icons": "^10.0.0",
    "kuroshiro": "^1.2.0",
    "kuroshiro-analyzer-mecab": "^1.1.0",
    "wanakana": "^5.0.2"
  }
}
```

#### 4.2.2 Next.js管理端 + 后端（日语处理）
```json
{
  "next": "13.4.0",
  "react": "18.2.0",
  "typescript": "^5.0.0",
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "axios": "^1.4.0",
    "tailwindcss": "^3.3.0",
    "next-auth": "^4.22.0",
    "@alicloud/pop-core": "^1.7.12",
    "kuroshiro": "^1.2.0",
    "kuroshiro-analyzer-mecab": "^1.1.0",
    "node-mecab": "^0.2.6"
  }
}
```

### 4.3 日语处理引擎集成

#### 4.3.1 日语文本处理服务
```typescript
interface JapaneseTextProcessor {
  // 汉字转假名
  kanjiToHiragana(text: string): Promise<string>
  
  // 假名转罗马音
  hiraganaToRomaji(text: string): Promise<string>
  
  // 综合转换
  convertLyrics(text: string): Promise<{
    kanji: string      // 原文汉字
    hiragana: string   // 假名读音
    romaji: string     // 罗马音
    segments: Array<{  // 分段信息
      kanji: string
      hiragana: string
      romaji: string
      reading: string
    }>
  }>
  
  // 歌词质量检测
  validateJapaneseLyrics(lyrics: string): Promise<QualityScore>
}

class KuroshiroService implements JapaneseTextProcessor {
  private kuroshiro: any
  
  constructor() {
    this.initializeKuroshiro()
  }
  
  private async initializeKuroshiro() {
    const Kuroshiro = require('kuroshiro')
    const KuromojiAnalyzer = require('kuroshiro-analyzer-mecab')
    
    this.kuroshiro = new Kuroshiro()
    await this.kuroshiro.init(new KuromojiAnalyzer())
  }
  
  async kanjiToHiragana(text: string): Promise<string> {
    return await this.kuroshiro.convert(text, {
      to: 'hiragana',
      mode: 'spaced'
    })
  }
  
  async hiraganaToRomaji(text: string): Promise<string> {
    return await this.kuroshiro.convert(text, {
      to: 'romaji',
      mode: 'spaced'
    })
  }
  
  async convertLyrics(text: string): Promise<any> {
    const hiragana = await this.kanjiToHiragana(text)
    const romaji = await this.hiraganaToRomaji(hiragana)
    
    // 使用MeCab进行形态素分析
    const segments = await this.segmentText(text)
    
    return {
      kanji: text,
      hiragana,
      romaji,
      segments
    }
  }
}
```

#### 4.3.2 DeepSeek AI日语优化
```typescript
class DeepSeekJapaneseService {
  private client: any
  
  async optimizeJapaneseLyrics(lyrics: string, options: {
    addFurigana?: boolean
    validateGrammar?: boolean
    suggestCorrections?: boolean
  }): Promise<OptimizedJapaneseLyrics> {
    
    const prompt = `
    你是一个专业的日语歌词分析专家。请分析以下日语歌词：
    
    歌词内容：${lyrics}
    
    请执行以下任务：
    1. 验证日语语法的正确性
    2. 为汉字标注假名读音（振り仮名）
    3. 提供准确的罗马音转写
    4. 识别可能的错误或不自然的表达
    5. 提供歌词的语义分析
    
    返回JSON格式的结果。
    `
    
    const response = await this.callDeepSeekAPI(prompt)
    return this.parseJapaneseLyricsResult(response)
  }
  
  async generateFurigana(text: string): Promise<FuriganaResult> {
    const prompt = `
    请为以下日语文本生成准确的振り仮名标注：
    ${text}
    
    要求：
    1. 只为汉字标注假名，假名部分保持不变
    2. 确保读音的准确性
    3. 考虑歌词的语境和情感表达
    4. 返回标准格式的假名标注
    `
    
    const response = await this.callDeepSeekAPI(prompt)
    return this.parseFuriganaResult(response)
  }
}
```

### 4.4 数据库设计（日语优化）

#### 4.4.1 核心数据表
```sql
-- 用户表（增加日语偏好）
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  nickname VARCHAR(50),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user',
  -- 日语学习偏好
  japanese_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
  default_display_mode VARCHAR(20) DEFAULT 'kanji', -- kanji, hiragana, romaji
  furigana_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- 日语歌曲表
CREATE TABLE japanese_songs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_hiragana VARCHAR(255), -- 假名标题
  title_romaji VARCHAR(255),   -- 罗马音标题
  artist VARCHAR(255) NOT NULL,
  artist_hiragana VARCHAR(255),
  artist_romaji VARCHAR(255),
  album VARCHAR(255),
  duration INTEGER,
  release_year INTEGER,
  genre VARCHAR(100), -- j-pop, anime, traditional, etc.
  anime_series VARCHAR(255), -- 关联的动漫作品
  cover_url TEXT,
  external_ids JSONB,
  ai_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日语歌词表（多语言支持）
CREATE TABLE japanese_lyrics (
  id SERIAL PRIMARY KEY,
  song_id INTEGER REFERENCES japanese_songs(id),
  -- 原文歌词
  lyrics_kanji TEXT NOT NULL,
  -- 假名歌词
  lyrics_hiragana TEXT,
  -- 罗马音歌词
  lyrics_romaji TEXT,
  -- 详细分段信息
  lyrics_segments JSONB, -- 包含每句的汉字、假名、罗马音对应
  -- 歌词元信息
  format VARCHAR(10) DEFAULT 'lrc',
  language VARCHAR(10) DEFAULT 'ja',
  source VARCHAR(50),
  -- AI处理信息
  ai_quality_score INTEGER,
  ai_furigana_accuracy DECIMAL(3,2),
  ai_romaji_accuracy DECIMAL(3,2),
  ai_optimized BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学习进度表
CREATE TABLE learning_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  song_id INTEGER REFERENCES japanese_songs(id),
  learning_status VARCHAR(20) DEFAULT 'not_started', -- not_started, learning, mastered
  favorite_display_mode VARCHAR(20) DEFAULT 'kanji',
  practice_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP,
  mastery_level INTEGER DEFAULT 0, -- 0-100
  notes TEXT, -- 用户学习笔记
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收藏夹表（日语分类）
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  name_japanese VARCHAR(255), -- 日语名称
  description TEXT,
  category VARCHAR(50), -- j-pop, anime, learning, etc.
  is_default BOOLEAN DEFAULT false,
  song_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI处理日志表
CREATE TABLE ai_processing_logs (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50), -- japanese_lyrics_convert, furigana_generate, quality_eval
  input_data JSONB,
  output_data JSONB,
  processing_time INTEGER,
  api_cost DECIMAL(10,4),
  accuracy_score DECIMAL(3,2), -- AI处理准确率
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.5 API设计（日语专门）

#### 4.5.1 RESTful API规范
```typescript
// 日语歌曲识别和处理
POST   /api/recognition/japanese      // 日语音乐识别
POST   /api/lyrics/japanese/convert   // 日语歌词多语言转换
POST   /api/lyrics/furigana/generate  // 假名标注生成
POST   /api/lyrics/romaji/convert     // 罗马音转换

// 学习相关
GET    /api/learning/progress         // 学习进度查询
POST   /api/learning/practice         // 记录练习
PUT    /api/learning/status           // 更新学习状态

// 收藏夹（日语分类）
GET    /api/playlists/japanese        // 日语收藏夹列表
POST   /api/playlists/japanese        // 创建日语收藏夹
PUT    /api/playlists/japanese/:id    // 更新收藏夹

// AI服务（日语优化）
POST   /api/ai/japanese/optimize      // AI日语歌词优化
POST   /api/ai/japanese/validate      // AI日语语法验证
POST   /api/ai/japanese/suggest       // AI学习建议
```

#### 4.5.2 API实现示例
```typescript
// pages/api/lyrics/japanese/convert.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { KuroshiroService } from '../../../lib/japanese/kuroshiro'
import { DeepSeekJapaneseService } from '../../../lib/ai/deepseek-japanese'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { lyrics, options } = req.body
    const kuroshiroService = new KuroshiroService()
    const deepSeekService = new DeepSeekJapaneseService()
    
    // 基础转换
    const convertedLyrics = await kuroshiroService.convertLyrics(lyrics)
    
    // AI优化（可选）
    if (options?.aiOptimize) {
      const optimizedResult = await deepSeekService.optimizeJapaneseLyrics(
        lyrics, 
        options
      )
      convertedLyrics.aiOptimizations = optimizedResult
    }
    
    // 记录处理日志
    await logJapaneseProcessing({
      type: 'lyrics_convert',
      input: { lyrics, options },
      output: convertedLyrics,
      processingTime: Date.now() - startTime
    })
    
    res.status(200).json({
      success: true,
      data: convertedLyrics
    })
  } catch (error) {
    console.error('Japanese lyrics conversion failed:', error)
    res.status(500).json({ error: 'Japanese processing failed' })
  }
}
```

---

## 📱 用户界面设计（日语优化）

### 5.1 设计原则
- **日语友好**: 优化日语文字显示，支持假名和汉字混排
- **多语言切换**: 无缝的汉字/假名/罗马音切换体验
- **学习导向**: 界面设计有助于日语学习
- **文化适配**: 融入日式美学元素

### 5.2 主要页面设计

#### 5.2.1 首页/识别页（日语优化）
```
┌─────────────────────────────────────┐
│ [状态栏] 44px                        │
├─────────────────────────────────────┤
│ [导航栏] 56px                        │
│   🎌 LyricNote         [设置] [履歴]  │
├─────────────────────────────────────┤
│                                     │
│ [主识别区域] ~400px                   │
│                                     │
│        ┌─────────────┐               │
│        │             │               │
│        │   [识别按钮]  │               │
│        │    240px     │               │
│        │             │               │
│        └─────────────┘               │
│                                     │
│   状态文字: "日本の音楽を認識する"     │
│                                     │
├─────────────────────────────────────┤
│ [语言偏好设置] 120px                  │
│  ┌─────────────────────────────┐     │
│  │ 表示方法: [漢字] [ひらがな] [Romaji] │
│  └─────────────────────────────┘     │
│  ┌─────────────────────────────┐     │
│  │ 🎤 KTVモード    ○────●       │     │
│  │    大文字歌詞表示              │     │
│  └─────────────────────────────┘     │
├─────────────────────────────────────┤
│ [底部导航] 83px                       │
│   🏠ホーム 📝歌詞 ✨作成 💾コレクション 👤プロフィール │
└─────────────────────────────────────┘
```

#### 5.2.2 日语歌词显示页面 ⭐ **核心功能**

**语言切换控制栏**
```
┌─────────────────────────────────────┐
│ [语言切换栏] 50px                     │
│  [漢字] [ひらがな] [Romaji] [学習モード] │
└─────────────────────────────────────┘
```

**标准模式（汉字显示）**
```
┌─────────────────────────────────────┐
│ [歌曲信息区] 120px                    │
│  ┌──────┐ 《恋》                     │
│  │ 封面 │  星野源                    │
│  │ 80px │  恋 (Single)               │
│  └──────┘                          │
├─────────────────────────────────────┤
│ [歌词滚动区] ~500px                   │
│                                     │
│  [上一句] 胸に手をあて               │
│  [当前句] 恋をしたのは ←高亮          │
│  [下一句] あなたのせいだ             │
│  [后续歌词] 初めての気持ち...         │
│                                     │
├─────────────────────────────────────┤
│ [控制区] 80px                        │
│  ──●────────────────── 02:30/04:15  │
│   -2s  文字  ⏸  ♡  ⚙               │
└─────────────────────────────────────┘
```

**假名模式**
```
┌─────────────────────────────────────┐
│ [歌词滚动区] ~500px                   │
│                                     │
│  [上一句] むねにてをあて             │
│  [当前句] こいをしたのは ←高亮        │
│  [下一句] あなたのせいだ             │
│  [后续歌词] はじめてのきもち...       │
│                                     │
└─────────────────────────────────────┘
```

**罗马音模式**
```
┌─────────────────────────────────────┐
│ [歌词滚动区] ~500px                   │
│                                     │
│  [上一句] mune ni te wo ate          │
│  [当前句] koi wo shita no wa ←高亮   │
│  [下一句] anata no sei da            │
│  [后续歌词] hajimete no kimochi...   │
│                                     │
└─────────────────────────────────────┘
```

**学习模式（三语同显）**
```
┌─────────────────────────────────────┐
│ [歌词滚动区] ~500px                   │
│                                     │
│  [上一句] 胸に手をあて               │
│         むねにてをあて               │
│         mune ni te wo ate            │
│                                     │
│  [当前句] 恋をしたのは ←高亮          │
│         こいをしたのは ←高亮          │
│         koi wo shita no wa ←高亮     │
│                                     │
│  [下一句] あなたのせいだ             │
│         あなたのせいだ               │
│         anata no sei da              │
│                                     │
└─────────────────────────────────────┘
```

#### 5.2.3 KTV模式（日语优化）
```
┌─────────────────────────────────────┐
│ [全屏歌词显示] 100vh                  │
│                                     │
│  歌名: 《恋》                        │
│  歌手: 星野源                        │
│                                     │
│  ┌─────────────────────────────┐     │
│  │     [当前歌词行]              │     │
│  │    恋をしたのは               │     │
│  │  (こいをしたのは)             │     │ 
│  │   koi wo shita no wa         │     │
│  └─────────────────────────────┘     │
│                                     │
│  [下一句歌词]                        │
│  あなたのせいだ                      │
│  (あなたのせいだ)                    │
│  anata no sei da                    │
│                                     │
│  ────────────────────────────────    │
│  [进度条]                           │
│                                     │
│  [控制按钮区域] 60px                 │
│    ⏸一時停止  ⏮前  ⏭次  ⚙設定      │
│                                     │
└─────────────────────────────────────┘
```

#### 5.2.4 收藏管理页面（日语分类）
```
┌─────────────────────────────────────┐
│ [收藏夹选择] 60px                     │
│  📂 J-POPコレクション ▼  [➕新規作成]  │
├─────────────────────────────────────┤
│ [搜索头部] 100px                      │
│  ┌─────────────────────────────┐     │
│  │ 🔍 曲名・アーティスト検索...    │     │
│  └─────────────────────────────┘     │
│  [全て] [J-POP] [アニメ] [学習中]     │
├─────────────────────────────────────┤
│ [列表区域] ~580px                     │
│                                     │
│  ┌─────────────────────────────┐     │
│  │ ┌──┐ 《恋》              ♡ ⋯   │     │
│  │ │封面│  星野源 • 学習中    操作   │     │
│  │ └──┘  [漢字] [かな] [Romaji]     │     │
│  └─────────────────────────────┘     │
│                                     │
│  ┌─────────────────────────────┐     │
│  │ ┌──┐ 《前前前世》         📂 ⋯   │     │
│  │ │封面│  RADWIMPS • アニメ  操作   │     │
│  │ └──┘  [漢字] [かな] [Romaji]     │     │
│  └─────────────────────────────┘     │
│                                     │
├─────────────────────────────────────┤
│ [底部导航] 83px                       │
└─────────────────────────────────────┘
```

#### 5.2.5 日语手帐创作页面
```
┌─────────────────────────────────────┐
│ [顶部工具栏] 56px                     │
│  ↩戻る  日本語手帳  💾保存  📤共有     │
├─────────────────────────────────────┤
│ [主编辑区] ~600px                     │
│  ┌─────────────────────────────┐     │
│  │                             │     │
│  │        [编辑画布]            │     │
│  │         270x480             │     │
│  │                             │     │
│  │    恋をしたのは               │     │
│  │  (こいをしたのは)             │     │
│  │   koi wo shita no wa        │     │
│  │                             │     │
│  │    あなたのせいだ             │     │
│  │  (あなたのせいだ)             │     │
│  │   anata no sei da           │     │
│  │                             │     │
│  │        🌸 🍃 🎋            │     │
│  └─────────────────────────────┘     │
├─────────────────────────────────────┤
│ [AI助手面板] 120px                    │
│  🤖 AI和風アシスタント                │
│  💡 [和風レイアウト] [季節テーマ]      │
│  🎨 [春色] [夏色] [秋色] [冬色]       │
├─────────────────────────────────────┤
│ [工具栏] 60px                        │
│  📝文字 🎨背景 🌸装飾 📐レイアウト 🎯レイヤー │
└─────────────────────────────────────┘
```

---

## 🧩 核心UI组件库（日语优化）

### 6.1 语言切换组件 ⭐ **核心新增**

#### 语言切换标签
```css
.language-switcher {
  display: flex;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
}

.language-tab {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
}

.language-tab.active {
  background: var(--primary-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.language-tab.inactive {
  color: var(--text-secondary);
}

.language-tab:hover:not(.active) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* 日语字体优化 */
.language-tab.japanese {
  font-family: 'Hiragino Sans', 'Meiryo', 'Yu Gothic', sans-serif;
}

.language-tab.romaji {
  font-family: 'SF Pro Display', -apple-system, sans-serif;
}
```

#### 多语言歌词行组件
```css
.lyrics-line-container {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.lyrics-line-container.current {
  background: rgba(59, 130, 246, 0.1);
  border-left: 4px solid var(--sync-500);
}

/* 单语言模式 */
.lyrics-line-single {
  font-size: var(--text-xl);
  line-height: 1.6;
  text-align: center;
  padding: var(--space-3) 0;
}

.lyrics-line-single.kanji {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-weight: 500;
}

.lyrics-line-single.hiragana {
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
  font-weight: 400;
}

.lyrics-line-single.romaji {
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-weight: 400;
  font-style: italic;
}

/* 学习模式（三语同显） */
.lyrics-line-learning {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: center;
}

.lyrics-text-kanji {
  font-size: var(--text-xl);
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  color: var(--text-primary);
  font-weight: 600;
}

.lyrics-text-hiragana {
  font-size: var(--text-lg);
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
  color: var(--text-secondary);
}

.lyrics-text-romaji {
  font-size: var(--text-base);
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  color: var(--text-tertiary);
  font-style: italic;
}

/* KTV模式多语言 */
.ktv-lyrics-multilang {
  text-align: center;
  margin-bottom: var(--space-6);
}

.ktv-text-kanji {
  font-size: var(--text-ktv-xl);
  color: var(--ktv-text-current);
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: var(--space-2);
}

.ktv-text-hiragana {
  font-size: var(--text-ktv-lg);
  color: var(--ktv-text-next);
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
  opacity: 0.9;
  margin-bottom: var(--space-2);
}

.ktv-text-romaji {
  font-size: var(--text-ktv-md);
  color: var(--ktv-text-next);
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-style: italic;
  opacity: 0.7;
}
```

### 6.2 日语输入支持组件

#### 搜索框（日语优化）
```css
.japanese-search-input {
  background: var(--bg-secondary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  width: 100%;
  transition: all 0.2s ease;
  /* 日语输入法优化 */
  ime-mode: auto;
  composition: auto;
}

.japanese-search-input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

.japanese-search-input::placeholder {
  color: var(--text-tertiary);
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
}

/* 输入建议下拉 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: var(--space-3);
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.2s ease;
}

.suggestion-item:hover {
  background: var(--bg-secondary);
}

.suggestion-kanji {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.suggestion-reading {
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
```

### 6.3 学习进度组件

#### 学习状态指示器
```css
.learning-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
}

.learning-status-badge.not-started {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.learning-status-badge.learning {
  background: rgba(249, 115, 22, 0.1);
  color: var(--secondary-500);
}

.learning-status-badge.mastered {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.progress-ring {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  position: relative;
}

.progress-ring::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
}
```

### 6.4 收藏夹分类组件

#### 日语分类标签
```css
.japanese-category-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.category-tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--text-sm);
  white-space: nowrap;
  border: 2px solid transparent;
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
}

.category-tab.active {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-600);
}

.category-tab:hover:not(.active) {
  background: var(--bg-primary);
  border-color: var(--border-medium);
}

/* 特定分类样式 */
.category-tab.j-pop {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  color: white;
}

.category-tab.anime {
  background: linear-gradient(135deg, #a8e6cf, #88d8c0);
  color: #2d3436;
}

.category-tab.learning {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}
```

---

## 🎬 动画与交互（日语优化）

### 7.1 语言切换动画

#### 切换过渡效果
```css
@keyframes language-switch {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.lyrics-line.switching {
  animation: language-switch 0.3s ease-out;
}

/* 文字方向动画 */
@keyframes text-reveal {
  0% {
    opacity: 0;
    filter: blur(3px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

.lyrics-text-entering {
  animation: text-reveal 0.5s ease-out;
}
```

#### 日语输入动画
```css
@keyframes ime-input {
  0% {
    border-color: var(--border-light);
  }
  50% {
    border-color: var(--primary-300);
  }
  100% {
    border-color: var(--primary-500);
  }
}

.japanese-input.composing {
  animation: ime-input 0.3s ease-in-out;
}
```

### 7.2 学习反馈动画

#### 正确答案动画
```css
@keyframes correct-answer {
  0% {
    transform: scale(1);
    background: var(--bg-primary);
  }
  50% {
    transform: scale(1.05);
    background: rgba(34, 197, 94, 0.1);
  }
  100% {
    transform: scale(1);
    background: var(--bg-primary);
  }
}

.lyrics-line.correct {
  animation: correct-answer 0.6s ease-out;
}
```

---

## 📊 性能优化（日语处理）

### 8.1 日语处理优化

#### 文本处理缓存
```typescript
interface JapaneseCache {
  kanjiToHiragana: Map<string, string>
  hiraganaToRomaji: Map<string, string>
  lyricsConversions: Map<string, ConvertedLyrics>
}

class JapaneseCacheManager {
  private cache: JapaneseCache
  private maxCacheSize = 10000
  
  constructor() {
    this.cache = {
      kanjiToHiragana: new Map(),
      hiraganaToRomaji: new Map(),
      lyricsConversions: new Map()
    }
  }
  
  async getOrConvert(text: string, type: 'hiragana' | 'romaji'): Promise<string> {
    const cacheKey = `${type}:${text}`
    
    if (this.cache[`${type === 'hiragana' ? 'kanjiToHiragana' : 'hiraganaToRomaji'}`].has(text)) {
      return this.cache[`${type === 'hiragana' ? 'kanjiToHiragana' : 'hiraganaToRomaji'}`].get(text)!
    }
    
    // 执行转换
    const result = await this.performConversion(text, type)
    
    // 缓存结果
    this.setCacheWithLRU(type === 'hiragana' ? this.cache.kanjiToHiragana : this.cache.hiraganaToRomaji, text, result)
    
    return result
  }
}
```

#### 批量处理优化
```typescript
class BatchJapaneseProcessor {
  async processLyricsBatch(lyrics: string[]): Promise<ConvertedLyrics[]> {
    // 批量处理减少API调用
    const batches = this.createBatches(lyrics, 10)
    const results = await Promise.all(
      batches.map(batch => this.processBatch(batch))
    )
    
    return results.flat()
  }
  
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }
}
```

### 8.2 字体加载优化

#### 日语字体预加载
```css
/* 字体预加载 */
@font-face {
  font-family: 'Hiragino Sans';
  src: local('Hiragino Sans'),
       local('HiraginoSans-W3');
  font-display: swap;
}

@font-face {
  font-family: 'Hiragino Mincho ProN';
  src: local('Hiragino Mincho ProN'),
       local('HiraginoMincho-ProN-W3');
  font-display: swap;
}

/* 字体回退策略 */
.japanese-text {
  font-family: 
    'Hiragino Sans',
    'Meiryo',
    'Yu Gothic',
    'MS PGothic',
    sans-serif;
}

.japanese-serif {
  font-family:
    'Hiragino Mincho ProN',
    'Yu Mincho',
    'MS PMincho',
    serif;
}
```

---

## 🛡️ 安全与隐私（日语数据保护）

### 9.1 日语数据安全
- **文本脱敏**: 发送给AI的日语文本进行必要的脱敏处理
- **本地处理优先**: 基础假名转换优先使用本地Kuroshiro处理
- **API调用加密**: DeepSeek API调用全程HTTPS加密
- **缓存加密**: 敏感日语歌词数据缓存加密存储

### 9.2 学习数据隐私
```typescript
interface PrivacyPolicy {
  japaneseDataProcessing: {
    localFirst: '优先本地日语处理，减少数据传输'
    aiProcessing: 'AI处理的日语数据匿名化'
    learningData: '学习进度数据本地存储为主'
    cachePolicy: '日语转换缓存定期清理'
  }
  
  userLearningPrivacy: {
    progressData: '学习进度数据用户完全控制'
    exportOption: '支持学习数据导出'
    deleteOption: '支持完全删除学习记录'
  }
}
```

---

## 🚀 开发计划与里程碑

### 10.1 开发阶段

| 阶段 | 时间 | 主要任务 | 交付物 |
|------|------|----------|---------|
| **日语引擎集成** | 第1-2周 | Kuroshiro集成，MeCab配置 | 日语处理基础功能 |
| **核心识别开发** | 第3-4周 | 日语音乐识别，基础转换 | 识别+转换MVP |
| **多语言显示** | 第5-6周 | 三语切换界面，KTV模式 | 多语言显示完成 |
| **AI优化集成** | 第7-8周 | DeepSeek日语优化，质量提升 | AI优化版本 |
| **学习功能** | 第9-10周 | 学习进度，收藏分类 | 学习功能完整版 |
| **手帐创作** | 第11-12周 | 日式手帐，AI创作辅助 | 创作功能完成 |
| **测试优化** | 第13-14周 | 日语处理测试，性能优化 | 正式版本 |

### 10.2 里程碑

- [ ] **M1**: 日语处理引擎集成完成 (第2周)
- [ ] **M2**: 三语切换功能完成 (第6周)
- [ ] **M3**: AI日语优化完成 (第8周)
- [ ] **M4**: 学习管理功能完成 (第10周)
- [ ] **M5**: 正式版发布 (第14周)

---

## 💰 商业模式与成本分析

### 11.1 变现方式（日语学习导向）
1. **免费增值模式**
   - 基础识别和显示免费
   - 高级AI日语学习功能付费（￥29.9/月）
   
2. **学习服务包**
   - 日语学习助手（￥19.9/月）
   - 专业版AI语法分析（￥49.9/月）
   
3. **内容订阅**
   - 高质量日语歌词库（￥9.9/月）
   - 专业假名标注服务（￥15.9/月）

### 11.2 成本分析
- **DeepSeek API成本**: 预估￥8000/月（日语优化处理）
- **Kuroshiro处理成本**: 本地处理，服务器成本￥2000/月
- **阿里云服务成本**: 预估￥4000/月
- **日语歌词数据源**: 预估￥5000/月
- **开发维护成本**: ￥35000/月
- **总预算**: ￥54000/月

---

## 📚 附录

### 13.1 日语处理术语表
- **Kanji (漢字)**: 日语中的汉字
- **Hiragana (ひらがな)**: 日语平假名
- **Katakana (カタカナ)**: 日语片假名
- **Romaji (ローマ字)**: 日语罗马音转写
- **Furigana (振り仮名)**: 汉字上的假名注音
- **MeCab**: 日语形态素分析器
- **Kuroshiro**: 日语文本转换库

### 13.2 技术参考
- [Kuroshiro.js官方文档](https://github.com/hexenq/kuroshiro)
- [MeCab形态素分析器](https://taku910.github.io/mecab/)
- [WanaKana日语转换](https://github.com/WaniKani/WanaKana)
- [DeepSeek API文档](https://api.deepseek.com/docs)

### 13.3 日语歌词数据源
- J-Lyric (歌詞検索)
- Uta-Net (うたネット)
- PetitLyrics (プチリリ)
- Animelyrics (アニメ歌詞)

---

## 14. 🔑 系统访问信息

### 14.1 管理后台访问

#### 后端管理系统
- **访问地址**: http://localhost:3000/admin
- **系统首页**: http://localhost:3000
- **API 健康检查**: http://localhost:3000/api/health

#### 默认管理员账户
- **邮箱**: admin@lyricnote.com
- **密码**: admin123456
- **角色**: SUPER_ADMIN
- **权限**: 系统全部管理权限

#### 数据库管理
- **Prisma Studio**: `npm run db:studio`
- **访问地址**: http://localhost:5555
- **功能**: 可视化数据库管理

### 14.2 开发环境配置

#### 移动端应用
- **Expo 开发服务器**: http://localhost:8081
- **启动命令**: `cd LyricNoteApp && npx expo start`
- **状态**: ✅ 正常运行

#### 后端服务
- **Next.js 开发服务器**: http://localhost:3000
- **启动命令**: `cd lyricnote-backend && npm run dev`
- **状态**: ✅ 已完成构建

### 14.3 项目结构概览

```
LyricNote/
├── LyricNoteApp/                    # React Native 移动端
│   ├── src/                        # 源代码
│   │   ├── screens/               # 页面组件
│   │   ├── navigation/            # 导航配置
│   │   ├── constants/             # 常量配置
│   │   └── types/                 # 类型定义
│   └── package.json               # 依赖配置
│
├── lyricnote-backend/              # Next.js 后端系统
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── api/              # API 路由
│   │   │   ├── admin/            # 管理后台页面
│   │   │   └── page.tsx          # 系统首页
│   │   ├── lib/                   # 核心库
│   │   ├── services/              # 业务服务
│   │   └── middleware/            # 中间件
│   ├── prisma/                    # 数据库配置
│   │   ├── schema.prisma         # 数据库模式
│   │   └── seed.ts               # 初始数据
│   └── README.md                  # 后端文档
│
├── LyricNote-Comprehensive-Project-Document.md  # 完整项目文档
└── LyricNote-High-Fidelity-Prototype.html      # 高保真原型
```

### 14.4 快速启动指南

#### 1. 启动后端服务
```bash
cd lyricnote-backend
npm run dev
```

#### 2. 访问管理后台
- 打开浏览器访问: http://localhost:3000/admin
- 使用管理员账户登录

#### 3. 启动移动端
```bash
cd LyricNoteApp
npx expo start
```

#### 4. 测试 API 服务
- 健康检查: http://localhost:3000/api/health
- API 文档: 查看 README.md

### 14.5 重要提醒

⚠️ **安全注意事项**:
- 生产环境请务必修改默认管理员密码
- 配置强密码策略和双因素认证
- 定期更新 JWT_SECRET 等安全密钥

📋 **开发提醒**:
- 管理员账户由数据库种子脚本自动创建
- 如需重置，运行 `npm run db:seed`
- 所有敏感信息请使用环境变量配置

---

*文档版本: v3.1*  
*最后更新: 2025年9月22日*  
*专注日语歌曲的完整技术解决方案*
