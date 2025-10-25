export { FileManager } from './file-manager';
export { FileManager as default } from './file-manager';
export { default as FileShareModal } from './file-share-modal';
export { default as FolderManager } from './folder-manager';

// 导出相关类型
export type {
  FileManagerProps,
  FileManagerState,
  FilePreviewModalProps,
  UploadModalProps
} from './file-manager';

export type {
  FileShareModalProps,
  ShareInfo
} from './file-share-modal';

export type {
  FolderNode,
  FolderManagerProps
} from './folder-manager';
