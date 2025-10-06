# TabBar 图标配置指南

## 当前状态

已临时移除 tabBar 图标配置，小程序现在可以正常运行，但 tabBar 只显示文字。

## 如何添加自定义图标

### 1. 准备图标文件

你需要准备 4 个图标文件：
- `tab-home.png` - 首页未选中图标
- `tab-home-active.png` - 首页选中图标
- `tab-profile.png` - 我的未选中图标
- `tab-profile-active.png` - 我的选中图标

**图标要求：**
- 尺寸：建议 81px × 81px（微信小程序官方推荐）
- 格式：PNG 格式（支持透明背景）
- 大小：每个图标文件不超过 40KB
- 颜色：未选中图标建议使用灰色，选中图标使用品牌色（#8b5cf6）

### 2. 图标获取方式

#### 方式一：使用图标库（推荐）
从以下网站下载免费图标：
- [iconfont](https://www.iconfont.cn/) - 阿里巴巴矢量图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节跳动图标库
- [Flaticon](https://www.flaticon.com/) - 国际图标库

搜索关键词：
- 首页：home / 主页 / 房子
- 我的：user / profile / 个人

#### 方式二：自己设计
使用设计工具如 Figma、Sketch、Photoshop 等设计图标

### 3. 添加图标到项目

1. 将准备好的 4 个图标文件放到 `src/assets/` 目录：
```bash
cd /Users/qihongrui/Desktop/LyricNote/packages/miniapp
mkdir -p src/assets
# 复制你的图标文件到这个目录
```

2. 恢复 `src/app.config.ts` 中的图标配置：
```typescript
tabBar: {
  color: '#9ca3af',
  selectedColor: '#8b5cf6',
  backgroundColor: '#ffffff',
  borderStyle: 'black',
  list: [
    {
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: 'assets/tab-home.png',
      selectedIconPath: 'assets/tab-home-active.png'
    },
    {
      pagePath: 'pages/profile/index',
      text: '我的',
      iconPath: 'assets/tab-profile.png',
      selectedIconPath: 'assets/tab-profile-active.png'
    }
  ]
}
```

3. 重新编译：
```bash
npm run build:weapp
```

### 4. 验证

在微信开发者工具中打开项目，检查 tabBar 是否正确显示图标。

## 快速示例（使用 iconfont）

1. 访问 [iconfont.cn](https://www.iconfont.cn/)
2. 搜索 "home" 和 "user"，选择合适的图标
3. 下载 PNG 格式，尺寸选择 81px
4. 使用图片编辑工具调整颜色：
   - 未选中：灰色 (#9ca3af)
   - 选中：紫色 (#8b5cf6)
5. 重命名并放入 `src/assets/` 目录

## 注意事项

- 图标文件必须放在 `src/assets/` 目录，编译时会自动复制到 `dist/assets/`
- 配置路径使用相对路径：`assets/xxx.png`
- 如果图标不显示，检查文件大小是否超过 40KB
- 建议使用简洁的线条图标，避免过于复杂的设计

