# 📱 Tab Bar 图标

此目录用于存放小程序 Tab Bar 图标。

## 图标要求

### 尺寸
- 推荐尺寸：81px * 81px
- 支持格式：PNG, JPG

### 所需图标

1. **tab-home.png** - 首页图标（未选中）
2. **tab-home-active.png** - 首页图标（选中）
3. **tab-profile.png** - 我的图标（未选中）
4. **tab-profile-active.png** - 我的图标（选中）

## 设计建议

- 未选中状态：使用灰色 (#9ca3af)
- 选中状态：使用主题色 (#8b5cf6)
- 保持风格一致性

## 临时方案

在开发阶段，可以使用 Emoji 或纯色占位符。待设计师提供正式图标后替换。

## 如何添加

1. 将图标文件放入此目录
2. 图标会自动被 Taro 打包到小程序中
3. 在 `src/app.config.ts` 中配置图标路径

示例：
```typescript
tabBar: {
  list: [
    {
      iconPath: 'assets/tab-home.png',
      selectedIconPath: 'assets/tab-home-active.png'
    }
  ]
}
```





