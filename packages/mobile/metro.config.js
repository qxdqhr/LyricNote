const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 支持 monorepo 的 workspace 依赖
config.watchFolders = [
  path.resolve(__dirname, '../..'),
];

// 支持 NativeWind (可选)
try {
  const { withNativeWind } = require('nativewind/metro');
  module.exports = withNativeWind(config, { input: './global.css' });
} catch (error) {
  // 如果 NativeWind 导入失败，使用默认配置
  console.warn('NativeWind metro config not loaded, using default config');
  module.exports = config;
}
