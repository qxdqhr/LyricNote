# i18n 方案对比与选择

## 为什么需要自建 i18n？

在 Monorepo 多平台项目中，我们需要一个：

- ✅ 跨平台兼容（Web、React Native、Taro、Electron）
- ✅ 轻量级（不增加包体积负担）
- ✅ 零依赖（减少依赖冲突）
- ✅ 类型安全（TypeScript 友好）
- ✅ 易于维护（代码可控）

## 方案对比

### 1. LyricNote i18n（自建方案）⭐ 推荐

#### 优点

- ✅ **零依赖**：无外部依赖，避免版本冲突
- ✅ **极小体积**：< 5KB，对移动端友好
- ✅ **完全可控**：代码可控，易于定制和维护
- ✅ **跨平台**：原生支持 Web、RN、Taro、Electron
- ✅ **类型安全**：完整的 TypeScript 类型定义
- ✅ **简单易用**：API 类似 i18next，学习成本低
- ✅ **按需加载**：可以轻松实现懒加载

#### 缺点

- ⚠️ 功能相对简单（但满足大多数场景）
- ⚠️ 需要自己维护（但代码量小，容易维护）
- ⚠️ 没有复杂的复数规则（只支持简单的 one/other）

#### 适用场景

- ✅ **推荐用于 LyricNote**：完美符合我们的需求
- ✅ 中小型项目
- ✅ 移动端应用（对体积敏感）
- ✅ Monorepo 多平台项目

---

### 2. i18next

**包体积**：~50KB (i18next) + ~15KB (react-i18next) = **~65KB**

#### 优点

- ✅ 功能强大，社区活跃
- ✅ 插件生态完善
- ✅ 支持复杂的复数规则
- ✅ 支持命名空间
- ✅ 懒加载支持

#### 缺点

- ❌ 体积较大（65KB+）
- ❌ 依赖较多
- ❌ React Native 支持需要额外配置
- ❌ 小程序支持不友好
- ❌ 学习曲线稍陡

#### 代码示例

```bash
# 安装
npm install i18next react-i18next
```

```typescript
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome'
        }
      },
      zh: {
        translation: {
          welcome: '欢迎'
        }
      }
    },
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

function App() {
  const { t } = useTranslation();
  return <div>{t('welcome')}</div>;
}
```

#### 适用场景

- ✅ 大型企业级项目
- ✅ 需要复杂国际化功能
- ✅ 主要面向 Web
- ❌ 不太适合 LyricNote（体积大，功能过剩）

---

### 3. react-intl (FormatJS)

**包体积**：~60KB

#### 优点

- ✅ React 集成好
- ✅ 强大的日期、数字、货币格式化
- ✅ ICU 消息格式
- ✅ TypeScript 支持好

#### 缺点

- ❌ 体积大（60KB+）
- ❌ 只适合 React
- ❌ React Native 支持需要额外配置
- ❌ 小程序不支持
- ❌ API 较复杂

#### 代码示例

```bash
# 安装
npm install react-intl
```

```typescript
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';

const messages = {
  en: { welcome: 'Welcome' },
  zh: { welcome: '欢迎' }
};

function App() {
  return (
    <IntlProvider messages={messages.zh} locale="zh">
      <FormattedMessage id="welcome" />
    </IntlProvider>
  );
}
```

#### 适用场景

- ✅ React Web 应用
- ✅ 需要复杂格式化
- ❌ 不适合 LyricNote（不跨平台）

---

### 4. next-intl

**包体积**：~30KB

#### 优点

- ✅ Next.js 深度集成
- ✅ SSR/SSG 支持好
- ✅ 类型安全
- ✅ 体积适中

#### 缺点

- ❌ 只适合 Next.js
- ❌ 不能用于其他平台
- ❌ 功能相对简单

#### 代码示例

```bash
# 安装
npm install next-intl
```

```typescript
import { useTranslations } from 'next-intl';

function Page() {
  const t = useTranslations('Index');
  return <h1>{t('title')}</h1>;
}
```

#### 适用场景

- ✅ Next.js 专用项目
- ❌ 不适合 LyricNote（不跨平台）

---

### 5. lingui

**包体积**：~40KB

#### 优点

- ✅ 编译时优化
- ✅ 类型安全
- ✅ CLI 工具强大
- ✅ 体积相对较小

#### 缺点

- ❌ 需要额外的编译步骤
- ❌ 配置复杂
- ❌ 跨平台支持一般

#### 代码示例

```bash
# 安装
npm install @lingui/macro @lingui/react
```

```typescript
import { Trans, t } from '@lingui/macro';

function App() {
  return <Trans>Welcome</Trans>;
}
```

#### 适用场景

- ✅ 需要编译时优化的大型项目
- ❌ 不适合 LyricNote（配置复杂）

---

## 功能对比表

| 功能             | LyricNote i18n | i18next | react-intl | next-intl | lingui |
| ---------------- | -------------- | ------- | ---------- | --------- | ------ |
| **体积**         | < 5KB          | 65KB    | 60KB       | 30KB      | 40KB   |
| **依赖**         | 0              | 多个    | 多个       | 1个       | 多个   |
| **React 支持**   | ✅             | ✅      | ✅         | ✅        | ✅     |
| **React Native** | ✅             | ⚠️      | ⚠️         | ❌        | ⚠️     |
| **Taro 小程序**  | ✅             | ❌      | ❌         | ❌        | ❌     |
| **Electron**     | ✅             | ✅      | ✅         | ❌        | ✅     |
| **类型安全**     | ✅             | ⚠️      | ✅         | ✅        | ✅     |
| **插值**         | ✅             | ✅      | ✅         | ✅        | ✅     |
| **复数**         | 简单           | 完整    | 完整       | 完整      | 完整   |
| **格式化**       | ❌             | ✅      | ✅         | ✅        | ✅     |
| **懒加载**       | 手动           | ✅      | ✅         | ✅        | ✅     |
| **SSR**          | ✅             | ✅      | ✅         | ✅        | ✅     |
| **学习成本**     | 低             | 中      | 中         | 低        | 高     |
| **维护成本**     | 自维护         | 社区    | 社区       | 社区      | 社区   |

## 性能对比

### 包体积影响

假设一个简单的移动应用：

```
| 方案 | 基础包 | i18n 库 | 总计 | 增加比例 |
|------|--------|---------|------|----------|
| 无 i18n | 500KB | 0KB | 500KB | 0% |
| LyricNote i18n | 500KB | 5KB | 505KB | +1% |
| i18next | 500KB | 65KB | 565KB | +13% |
| react-intl | 500KB | 60KB | 560KB | +12% |
```

### 运行时性能

- **LyricNote i18n**：简单的对象查找，性能极佳
- **i18next**：功能多，性能略低但可接受
- **react-intl**：ICU 解析，性能中等

## 成本对比

### 开发成本

| 方案           | 初期成本       | 维护成本       | 学习成本       |
| -------------- | -------------- | -------------- | -------------- |
| LyricNote i18n | 低（已实现）   | 低（代码简单） | 低（API 简单） |
| i18next        | 低（文档全）   | 中（版本更新） | 中（功能多）   |
| react-intl     | 中（配置复杂） | 中（版本更新） | 中（API 复杂） |

### 包体积成本

```
移动端流量成本估算（假设 1000 用户首次下载）:

LyricNote i18n: 5KB × 1000 = 5MB
i18next:       65KB × 1000 = 65MB  (+60MB)
react-intl:    60KB × 1000 = 60MB  (+55MB)
```

## 迁移成本

### 从 LyricNote i18n 迁移到 i18next

```typescript
// LyricNote i18n
const { t } = useTranslation();
t('common.hello');

// i18next (几乎相同)
const { t } = useTranslation();
t('common.hello');
```

迁移成本：**低** - API 设计类似，翻译文件可直接复用

### 从 i18next 迁移到 LyricNote i18n

迁移成本：**低** - 主要是简化配置，翻译内容几乎无需改动

## 决策建议

### 选择 LyricNote i18n（自建）如果：

✅ **强烈推荐**用于 LyricNote 项目：

- 需要跨多个平台（Web、RN、Taro、Electron）
- 对包体积敏感（移动端）
- 翻译需求相对简单（文本翻译为主）
- 希望完全控制代码
- 团队规模小，维护成本低

### 选择 i18next 如果：

- 大型企业级项目
- 需要复杂的国际化功能
- 主要面向 Web
- 团队大，有专人维护

### 选择 react-intl 如果：

- React Web 专用
- 需要强大的格式化功能
- 不考虑跨平台

### 选择 next-intl 如果：

- Next.js 专用项目
- 不需要支持其他平台

## 总结

对于 **LyricNote** 项目，**自建的 i18n 方案是最佳选择**，因为：

1. ✅ **跨平台**：原生支持所有目标平台
2. ✅ **轻量**：体积最小，对移动端友好
3. ✅ **简单**：API 简洁，易于使用和维护
4. ✅ **可控**：代码完全可控，可随时定制
5. ✅ **够用**：功能满足项目需求
6. ✅ **零依赖**：避免依赖冲突

**何时考虑迁移到 i18next？**

只有当你需要以下功能时：

- 复杂的复数规则（如阿拉伯语）
- 上下文变量（context）
- 高级格式化
- 复杂的命名空间管理

但对于大多数场景，**LyricNote i18n 已经足够**。
