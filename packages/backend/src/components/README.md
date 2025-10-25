# Backend 组件库

## 📚 组件列表

### 1. OrderManager - 排序管理器

**路径:** `@/components/order-manager`

通用的排序管理组件，支持拖拽和按钮两种排序方式。

```typescript
import { OrderManager, type OrderManagerProps } from '@/components/order-manager';

<OrderManager
  operations={operations}
  renderItem={renderItem}
  title="排序管理"
  description="拖拽或使用按钮调整顺序"
/>
```

**特性:**

- ✅ 拖拽排序
- ✅ 按钮排序(上移/下移)
- ✅ 批量保存
- ✅ 泛型支持
- ✅ 完整的错误处理

---

### 2. FileUploader - 文件上传器

**路径:** `@/components/file-uploader`

通用文件上传组件，支持拖拽上传和进度显示。

```typescript
import { FileUploader, type FileUploaderProps } from '@/components/file-uploader';

<FileUploader
  fileService={fileService}
  moduleId="profile"
  acceptedTypes={['image/*']}
  maxFileSize={10}
  onUploadSuccess={(files) => logger.info(files)}
/>
```

**特性:**

- ✅ 拖拽上传
- ✅ 多文件上传
- ✅ 进度显示
- ✅ 文件类型验证
- ✅ 大小限制

---

### 3. FileManager - 文件管理器

**路径:** `@/components/file-manager`

完整的文件管理解决方案，包含列表、预览、搜索、筛选等功能。

```typescript
import { FileManager, type FileManagerProps } from '@/components/file-manager';

<FileManager
  moduleId="documents"
  allowUpload
  allowDownload
  showPreview
  showSearch
/>
```

**子组件:**

- `FileShareModal` - 文件分享弹窗
- `FolderManager` - 文件夹管理

**特性:**

- ✅ 文件列表展示
- ✅ 搜索和筛选
- ✅ 文件预览
- ✅ 批量操作
- ✅ 分页功能

---

### 4. ExportButton - 导出按钮

**路径:** `@/components/export-button`

通用数据导出按钮，支持多种配置和格式。

```typescript
import { ExportButton, type ExportButtonProps } from '@/components/export-button';

<ExportButton
  exportService={exportService}
  moduleId="orders"
  availableFields={fields}
  dataSource={loadData}
/>
```

**特性:**

- ✅ 快速导出
- ✅ 配置管理
- ✅ 进度显示
- ✅ 多格式支持(CSV/Excel/JSON)

---

### 5. ExportConfigEditor - 导出配置编辑器

**路径:** `@/components/export-config-editor`

可视化的导出配置编辑器，支持字段选择、分组等高级功能。

```typescript
import { ExportConfigEditor, type ExportConfigEditorProps } from '@/components/export-config-editor';

<ExportConfigEditor
  moduleId="orders"
  availableFields={fields}
  onSave={handleSave}
  visible={showEditor}
/>
```

**特性:**

- ✅ 字段配置
- ✅ 分组设置
- ✅ 格式选项
- ✅ 配置管理
- ✅ 实时预览

**相关文档:** [分组功能指南](./export-config-editor/GROUPING_GUIDE.md)

---

## 🎨 命名规范

本项目组件遵循以下命名规范：

### 目录名: kebab-case (小写短横线)

```
order-manager/
file-uploader/
export-button/
```

### 文件名: kebab-case (小写短横线)

```
order-manager.tsx
file-uploader.tsx
export-button.tsx
```

### 组件名: PascalCase (大写开头)

```typescript
export function OrderManager() {}
export const FileUploader = () => {};
```

### 为什么这样命名？

1. **目录名小写** - URL友好，避免跨平台问题
2. **文件名大写** - 一眼识别React组件
3. **去掉前缀** - 更简洁，降低代码噪音

详见: [组件重命名记录](./COMPONENT_RENAMING.md)

---

## 📦 导入方式

### 推荐方式(从index导入)

```typescript
import { OrderManager } from '@/components/order-manager';
import { FileUploader } from '@/components/file-uploader';
import { ExportButton } from '@/components/export-button';
```

### 直接导入(也可以)

```typescript
import { OrderManager } from '@/components/order-manager/order-manager';
```

### 类型导入

```typescript
import type {
  OrderManagerProps,
  OrderableItem,
} from '@/components/order-manager';
```

---

## 🔧 开发指南

### 添加新组件

1. **创建目录(kebab-case)**

   ```bash
   mkdir packages/backend/src/components/my-component
   ```

2. **创建组件文件(kebab-case)**

   ```bash
   touch packages/backend/src/components/my-component/my-component.tsx
   ```

3. **创建导出文件**
   ```typescript
   // index.ts
   export { MyComponent } from './my-component';
   export type { MyComponentProps } from './my-component';
   ```

### 组件模板

```typescript
'use client';

import React from 'react';

export interface MyComponentProps {
  // Props定义
}

export function MyComponent({ }: MyComponentProps) {
  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
}
```

---

## 📖 相关文档

- [组件依赖修复记录](./COMPONENT_MIGRATION.md)
- [组件重命名记录](./COMPONENT_RENAMING.md)
- [导出分组功能指南](./export-config-editor/GROUPING_GUIDE.md)

---

## ✅ 组件状态

| 组件               | 状态 | TypeScript | Linter |
| ------------------ | ---- | ---------- | ------ |
| OrderManager       | ✅   | ✅         | ✅     |
| FileUploader       | ✅   | ✅         | ✅     |
| FileManager        | ✅   | ✅         | ✅     |
| ExportButton       | ✅   | ✅         | ✅     |
| ExportConfigEditor | ✅   | ✅         | ✅     |

---

## 💡 最佳实践

### 1. 使用TypeScript类型

```typescript
import type { OrderManagerProps } from '@/components/order-manager';

const props: OrderManagerProps = {
  // 获得完整的类型提示
};
```

### 2. 适当的错误处理

```typescript
<OrderManager
  operations={operations}
  renderItem={renderItem}
  onError={(error) => {
    // 处理错误
    toast.error(error.message);
  }}
/>
```

### 3. 使用泛型增强类型安全

```typescript
interface MyItem {
  id: number;
  name: string;
}

<OrderManager<MyItem>
  operations={operations}
  renderItem={(item) => {
    // item 自动推断为 MyItem 类型
    return <div>{item.name}</div>;
  }}
/>
```

---

## 🚀 未来计划

- [ ] 添加单元测试
- [ ] 添加Storybook文档
- [ ] 优化性能
- [ ] 添加更多自定义选项
- [ ] 支持主题定制

---

**维护团队:** LyricNote Team **最后更新:** 2024年10月25日
