/**
 * 通用文件服务模块入口（后端）
 */

// 导出核心服务类
export { UniversalFileService, createUniversalFileServiceWithConfigManager } from './UniversalFileService';

// 导出配置管理
export {
  FileServiceConfigManager,
  createFileServiceConfig,
  getDefaultConfig,
  validateAliyunOSSConfig,
  validateAliyunCDNConfig,
  getStorageProviderDisplayName,
  getCDNProviderDisplayName
} from './config';

// 从 shared 包重新导出客户端类型和工具
export type * from '@lyricnote/shared/universalFile';
export {
  FileServiceError,
  FileUploadError,
  FileProcessingError,
  StorageProviderError,
  CDNProviderError,
} from '@lyricnote/shared/universalFile';

// 导出后端特定类型
export type {
  UniversalFileServiceConfig,
  IStorageProvider,
  ICDNProvider,
  IFileProcessor,
  StorageConfig,
  LocalStorageConfig,
  AliyunOSSConfig,
  CDNConfig,
  AliyunCDNConfig,
  StorageResult,
  CDNResult,
  ProcessingResult,
} from './types';

// 导出常量
export const UNIVERSAL_FILE_SERVICE_VERSION = '1.0.0';
export const UNIVERSAL_FILE_SERVICE_NAME = '@profile-v1/universal-file-service';
