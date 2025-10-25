/**
 * 通用导出服务模块入口（后端）
 */

// 导出核心服务类
export { UniversalExportService } from './UniversalExportService';

// 导出数据库服务
export { exportConfigDB, exportHistoryDB } from './database';

// 从 shared 包重新导出类型和工具
export type * from '@lyricnote/shared/universalExport';
export {
  ExportServiceError,
  ExportConfigError,
  ExportDataError,
  ExportFileError,
} from '@lyricnote/shared/universalExport';

// 导出常量
export const UNIVERSAL_EXPORT_SERVICE_VERSION = '1.0.0';
export const UNIVERSAL_EXPORT_SERVICE_NAME = '@profile-v1/universal-export-service';
