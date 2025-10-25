'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useConfigs } from '@/hooks/useConfigs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Database,
  Cloud,
  Bot,
  Shield,
  Smartphone,
  Settings,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  BarChart3,
  Plus,
  X,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Home,
} from 'lucide-react';
import { AnalyticsDashboard } from '@lyricnote/shared/analytics/components';
import { OrderManager } from '@/components/order-manager';
import type { OrderableItem, OrderManagerOperations } from '@/components/order-manager';

interface ConfigItem {
  key: string;
  value: any;
  type: string;
  isRequired: boolean;
  isSensitive: boolean;
  description?: string;
  defaultValue?: any;
  readonly?: boolean;
}

interface ConfigCategory {
  [key: string]: ConfigItem;
}

interface AllConfigs {
  [category: string]: ConfigCategory;
}

const CONFIG_CATEGORIES = {
  homepage: {
    name: '首页配置',
    icon: Home,
    description: '管理首页展示内容、背景图片和显示顺序',
    color: 'text-pink-600 bg-pink-100',
  },
  database: {
    name: '数据库配置',
    icon: Database,
    description: 'PostgreSQL和Redis数据库连接配置',
    color: 'text-blue-600 bg-blue-100',
  },
  storage: {
    name: '存储配置',
    icon: Cloud,
    description: '阿里云OSS对象存储配置',
    color: 'text-green-600 bg-green-100',
  },
  ai_service: {
    name: 'AI服务配置',
    icon: Bot,
    description: 'DeepSeek AI服务配置',
    color: 'text-purple-600 bg-purple-100',
  },
  security: {
    name: '安全配置',
    icon: Shield,
    description: 'JWT、会话等安全相关配置',
    color: 'text-red-600 bg-red-100',
  },
  mobile: {
    name: '移动端配置',
    icon: Smartphone,
    description: 'Expo移动端构建配置',
    color: 'text-orange-600 bg-orange-100',
  },
  analytics: {
    name: '埋点数据分析',
    icon: BarChart3,
    description: '查看和分析用户行为数据',
    color: 'text-indigo-600 bg-indigo-100',
  },
  developer: {
    name: '开发者调试',
    icon: Settings,
    description: '日志和埋点输出控制',
    color: 'text-gray-600 bg-gray-100',
  },
} as const;

type ConfigCategoryKey = keyof typeof CONFIG_CATEGORIES;

// 首页配置接口
interface HomepageSection extends OrderableItem {
  id: number;
  title: string;
  description: string;
  backgroundImage: string | null;
  order: number;
  isActive: boolean;
}

// 首页配置组件
function HomepageConfig() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/homepage-sections');
      const result = await response.json();
      if (result.success) {
        setSections(result.data);
      }
    } catch (error) {
      console.error('获取首页配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const operations: OrderManagerOperations<HomepageSection> = {
    loadItems: async () => {
      const response = await fetch('/api/homepage-sections');
      const result = await response.json();
      return result.success ? result.data : [];
    },

    moveItemUp: async (id: number) => {
      const index = sections.findIndex((s) => s.id === id);
      if (index <= 0) return;

      const newSections = [...sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];

      const updates = newSections.map((s, idx) => ({ id: s.id, order: idx + 1 }));
      await updateOrder(updates);
    },

    moveItemDown: async (id: number) => {
      const index = sections.findIndex((s) => s.id === id);
      if (index >= sections.length - 1 || index === -1) return;

      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];

      const updates = newSections.map((s, idx) => ({ id: s.id, order: idx + 1 }));
      await updateOrder(updates);
    },

    updateItemOrder: async (orders: { id: number; order: number }[]) => {
      await updateOrder(orders);
    },
  };

  const updateOrder = async (orders: { id: number; order: number }[]) => {
    try {
      const response = await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: orders }),
      });

      if (response.ok) {
        await fetchSections();
      }
    } catch (error) {
      console.error('更新顺序失败:', error);
    }
  };

  const handleEdit = (section: HomepageSection) => {
    setEditingSection(section);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingSection({
      id: 0,
      title: '',
      description: '',
      backgroundImage: null,
      order: sections.length + 1,
      isActive: true,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个配置吗？')) return;

    try {
      const response = await fetch(`/api/homepage-sections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSections();
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const renderItem = (item: HomepageSection) => {
    return (
      <div className="flex items-center gap-4 w-full">
        <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {item.backgroundImage ? (
            <img
              src={item.backgroundImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
          <p className="text-sm text-gray-500 truncate">{item.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">加载中...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>首页配置管理</CardTitle>
              <CardDescription>管理首页展示的内容和顺序</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              添加配置
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              💡 调整配置顺序后，访问
              <a href="/" target="_blank" className="text-blue-600 hover:underline mx-1">
                首页
              </a>
              即可看到效果。首页支持纵向滚动浏览。
            </AlertDescription>
          </Alert>

          {sections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无配置</h3>
              <p className="text-gray-500 mb-4">点击"添加配置"按钮创建首页内容</p>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                添加配置
              </Button>
            </div>
          ) : (
            <OrderManager
              operations={operations}
              renderItem={renderItem}
              title="首页配置列表"
              description="拖拽或使用按钮调整配置显示顺序"
              emptyMessage="暂无配置"
            />
          )}
        </CardContent>
      </Card>

      {showEditor && editingSection && (
        <HomepageEditorModal
          section={editingSection}
          onClose={() => {
            setShowEditor(false);
            setEditingSection(null);
          }}
          onSave={async () => {
            await fetchSections();
            setShowEditor(false);
            setEditingSection(null);
          }}
        />
      )}
    </div>
  );
}

// 首页编辑器弹窗
function HomepageEditorModal({
  section,
  onClose,
  onSave,
}: {
  section: HomepageSection;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState(section);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPG、PNG、WebP、GIF 格式的图片');
      return;
    }

    // 验证文件大小
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('文件大小不能超过 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, backgroundImage: result.data.url }));
        setUploadProgress(100);
      } else {
        throw new Error(result.error || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert(`图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isCreate = formData.id === 0;
      const url = isCreate ? '/api/homepage-sections' : `/api/homepage-sections/${formData.id}`;
      const method = isCreate ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-amber-50 overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{formData.id === 0 ? '添加首页配置' : '编辑首页配置'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入首页标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">描述 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="输入首页描述"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">背景图片</label>
              <div className="space-y-4">
                {formData.backgroundImage && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={formData.backgroundImage}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, backgroundImage: null })}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                    id="image-upload-input"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="w-full"
                    asChild={false}
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        上传中 {uploadProgress > 0 ? `${uploadProgress}%` : '...'}
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 mr-2" />
                        {formData.backgroundImage ? '更换图片' : '上传背景图片'}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  建议尺寸：1920x1080px，支持 JPG、PNG、WebP、GIF 格式，最大 10MB
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    保存
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 开发者调试配置组件
function DeveloperDebugConfig() {
  const [loggerDebug, setLoggerDebug] = useLocalStorage('logger-debug', false);
  const [analyticsDebug, setAnalyticsDebug] = useLocalStorage('analytics-debug', false);

  const [saved, setSaved] = useState(false);

  const handleLoggerDebugChange = (enabled: boolean) => {
    setLoggerDebug(enabled);
    // 触发自定义事件，通知其他组件配置已更改
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('logger-debug-changed', { detail: { enabled } }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAnalyticsDebugChange = (enabled: boolean) => {
    setAnalyticsDebug(enabled);
    // 触发自定义事件，通知其他组件配置已更改
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('analytics-debug-changed', { detail: { enabled } }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAllLogs = () => {
    if (typeof window !== 'undefined') {
      console.clear();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>开发者调试配置</CardTitle>
                <CardDescription>控制日志库和埋点库在浏览器控制台的输出</CardDescription>
              </div>
            </div>
            {saved && (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                已保存
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 日志调试开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">日志调试模式</span>
                <Badge variant={loggerDebug ? 'default' : 'secondary'} className="text-xs">
                  {loggerDebug ? '已启用' : '已关闭'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                启用后，日志库会将所有日志输出到浏览器控制台（包括 info、warn、error 等级别）
              </p>
            </div>
            <button
              onClick={() => handleLoggerDebugChange(!loggerDebug)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-4 ${
                loggerDebug ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  loggerDebug ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 埋点调试开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">埋点调试模式</span>
                <Badge variant={analyticsDebug ? 'default' : 'secondary'} className="text-xs">
                  {analyticsDebug ? '已启用' : '已关闭'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                启用后，埋点库会将所有事件信息输出到浏览器控制台（包括事件追踪、上传等）
              </p>
            </div>
            <button
              onClick={() => handleAnalyticsDebugChange(!analyticsDebug)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-4 ${
                analyticsDebug ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  analyticsDebug ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 清除控制台按钮 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50">
            <div className="flex-1">
              <span className="font-medium text-gray-900 block mb-1">清除控制台日志</span>
              <p className="text-sm text-gray-600">清空浏览器控制台中的所有日志输出</p>
            </div>
            <Button
              variant="outline"
              onClick={clearAllLogs}
              className="ml-4 border-amber-300 hover:bg-amber-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              清除
            </Button>
          </div>

          {/* 提示信息 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>注意：</strong>这些设置保存在浏览器本地存储中，仅影响当前浏览器。
              在生产环境中，建议关闭调试模式以提高性能。
            </AlertDescription>
          </Alert>

          {/* 当前状态总结 */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">当前调试状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">日志调试：</span>
                  <Badge variant={loggerDebug ? 'default' : 'secondary'}>
                    {loggerDebug ? '开启' : '关闭'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">埋点调试：</span>
                  <Badge variant={analyticsDebug ? 'default' : 'secondary'}>
                    {analyticsDebug ? '开启' : '关闭'}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-gray-500">
                  按 F12 或 Cmd+Option+I (Mac) 打开开发者工具查看控制台输出
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

function ConfigManagementContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'database';

  // 使用 SWR 缓存配置数据
  const { configs, isLoading: loading, updateConfigs, refresh } = useConfigs();
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [editedConfigs, setEditedConfigs] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [showAllSensitive, setShowAllSensitive] = useState(false);
  // 添加配置
  const [showAddConfig, setShowAddConfig] = useState(false);
  const [newConfigKey, setNewConfigKey] = useState('');
  const [newConfigValue, setNewConfigValue] = useState('');
  const [newConfigDescription, setNewConfigDescription] = useState('');
  const [newConfigIsSensitive, setNewConfigIsSensitive] = useState(false);
  // 删除配置
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ key: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  // 同步配置模板
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  // 获取认证token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  };

  // 添加新配置
  const addNewConfig = async () => {
    if (!newConfigKey.trim()) {
      setError('请输入配置键名');
      return;
    }
    if (!newConfigValue.trim()) {
      setError('请输入配置值');
      return;
    }

    try {
      setSaving(true);
      const token = getAuthToken();

      const response = await fetch(`/api/admin/config/${activeCategory}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: {
            [newConfigKey]: newConfigValue,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token 过期，跳转到登录页
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(`成功添加配置：${newConfigKey}`);
        setError('');
        setShowAddConfig(false);
        setNewConfigKey('');
        setNewConfigValue('');
        setNewConfigDescription('');
        setNewConfigIsSensitive(false);
        refresh(); // 刷新缓存
      } else {
        setError(data.error || '添加配置失败');
      }
    } catch (error) {
      setError(`网络错误：${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setSaving(false);
    }
  };

  // 删除配置
  const deleteConfig = async (key: string) => {
    try {
      setDeleting(true);
      const token = getAuthToken();

      const response = await fetch(`/api/admin/config?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token 过期，跳转到登录页
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(`成功删除配置：${key}`);
        setError('');
        refresh(); // 刷新缓存
      } else {
        setError(data.error || '删除配置失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  // 同步配置模板
  const syncConfigTemplates = async () => {
    try {
      setSyncing(true);
      const token = getAuthToken();

      const response = await fetch('/api/admin/config/sync-templates', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setSyncResult(data.data);
        setError('');
        refresh(); // 刷新缓存
      } else {
        setError(data.error || '同步配置模板失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setSyncing(false);
    }
  };

  // 保存配置
  const saveConfigs = async (category: string) => {
    const categoryConfigs = editedConfigs[category];
    if (!categoryConfigs || Object.keys(categoryConfigs).length === 0) {
      setError('没有需要保存的配置');
      return;
    }

    // 过滤掉只读配置项
    const filteredConfigs = Object.fromEntries(
      Object.entries(categoryConfigs).filter(([key]) => {
        const config = configs?.[category]?.[key];
        return config && !config.readonly;
      })
    );

    if (Object.keys(filteredConfigs).length === 0) {
      setError('没有可保存的配置（只读配置不能修改）');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // 使用 Hook 提供的 updateConfigs（自动处理乐观更新和缓存）
      await updateConfigs(category, filteredConfigs);

      setSuccess(`成功保存 ${Object.keys(filteredConfigs).length} 个配置项`);
      // 清除编辑状态
      setEditedConfigs((prev) => ({ ...prev, [category]: {} }));
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 验证配置
  const validateConfigs = async (category: string) => {
    const categoryConfigs = editedConfigs[category] || {};
    const currentConfigs = configs?.[category] || {};

    // 合并当前配置和编辑的配置
    const configsToValidate = { ...currentConfigs };
    Object.keys(configsToValidate).forEach((key) => {
      if (categoryConfigs[key] !== undefined) {
        configsToValidate[key] = categoryConfigs[key];
      } else {
        configsToValidate[key] = currentConfigs[key]?.value;
      }
    });

    try {
      setValidating(true);
      const token = getAuthToken();

      const response = await fetch('/api/admin/config/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, configs: configsToValidate }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token 过期，跳转到登录页
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setValidationResults((prev) => ({ ...prev, [category]: data.data }));
        setError('');
      } else {
        setError(data.error || '验证失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setValidating(false);
    }
  };

  // 更新配置值
  const updateConfigValue = (category: string, key: string, value: any) => {
    setEditedConfigs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  // 获取配置值（优先使用编辑的值）
  const getConfigValue = (category: string, key: string) => {
    if (editedConfigs[category] && editedConfigs[category][key] !== undefined) {
      return editedConfigs[category][key];
    }
    return configs?.[category]?.[key]?.value || '';
  };

  // 检查是否有未保存的更改
  const hasUnsavedChanges = (category: string) => {
    return editedConfigs[category] && Object.keys(editedConfigs[category]).length > 0;
  };

  // 切换敏感信息显示
  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 切换所有敏感信息显示
  const toggleAllSensitiveVisibility = () => {
    setShowAllSensitive((prev) => {
      const newState = !prev;
      // 如果设置为显示所有，则更新所有敏感字段的状态
      if (configs?.[activeCategory]) {
        const sensitiveKeys = Object.entries(configs[activeCategory])
          .filter(([, config]) => config.isSensitive)
          .map(([key]) => key);

        setShowSensitive((prevSensitive) => {
          const newSensitive = { ...prevSensitive };
          sensitiveKeys.forEach((key) => {
            newSensitive[key] = newState;
          });
          return newSensitive;
        });
      }
      return newState;
    });
  };

  // SWR 自动加载配置数据，无需手动触发

  // 清除消息
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* 消息提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 配置详情 */}
        {!CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey] ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">未知的配置分类</h3>
              <p className="text-gray-600">请从左侧导航栏选择一个有效的配置分类。</p>
            </CardContent>
          </Card>
        ) : activeCategory === 'homepage' ? (
          // 首页配置特殊处理
          <HomepageConfig />
        ) : activeCategory === 'analytics' ? (
          // 埋点数据分析特殊处理
          <div className="space-y-6">
            <AnalyticsDashboard apiBaseUrl="/api/analytics" />
          </div>
        ) : activeCategory === 'developer' ? (
          // 开发者调试配置特殊处理
          <DeveloperDebugConfig />
        ) : !configs?.[activeCategory] ? (
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">正在加载配置数据...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].color}`}
                  >
                    {React.createElement(
                      CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].icon,
                      { className: 'h-5 w-5' }
                    )}
                  </div>
                  <div>
                    <CardTitle>
                      {CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].name}
                    </CardTitle>
                    <CardDescription>
                      {CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* 同步配置模板按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={syncConfigTemplates}
                    disabled={syncing}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        同步中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        同步模板
                      </>
                    )}
                  </Button>
                  {/* 添加配置按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddConfig(true)}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    添加配置项
                  </Button>
                  {/* 全局敏感信息开关 */}
                  {configs?.[activeCategory] &&
                    Object.values(configs[activeCategory]).some((config) => config.isSensitive) && (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                        <Shield className="h-3 w-3 text-amber-600" />
                        <span className="text-xs text-amber-700">敏感信息:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleAllSensitiveVisibility}
                          className="h-6 px-2 text-xs hover:bg-amber-100"
                        >
                          {showAllSensitive ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              隐藏
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              显示
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => validateConfigs(activeCategory)}
                    disabled={validating}
                  >
                    {validating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    验证配置
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveConfigs(activeCategory)}
                    disabled={saving || !hasUnsavedChanges(activeCategory)}
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    保存配置
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {configs?.[activeCategory] &&
                Object.entries(configs[activeCategory]).map(
                  ([key, config]: [string, ConfigItem]) => (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900">
                            {config.description || key}
                            {config.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">键名: {key}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* 删除按钮 */}
                          {!config.readonly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteTarget({ key });
                                setShowDeleteConfirm(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="删除配置"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {config.readonly && (
                            <Badge
                              variant="outline"
                              className="text-xs text-blue-600 border-blue-300"
                            >
                              📖 只读
                            </Badge>
                          )}
                          {config.isSensitive && (
                            <>
                              <Badge
                                variant="outline"
                                className="text-xs text-amber-600 border-amber-300"
                              >
                                🔒 敏感信息
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSensitiveVisibility(key)}
                                className="h-8 w-8 p-0 hover:bg-gray-100 relative group"
                                title={
                                  showSensitive[key] || showAllSensitive
                                    ? '隐藏敏感信息'
                                    : '显示敏感信息'
                                }
                              >
                                {showSensitive[key] || showAllSensitive ? (
                                  <EyeOff className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-600" />
                                )}
                                {/* 悬停提示 */}
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    {showSensitive[key] || showAllSensitive ? '隐藏' : '显示'}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {config.readonly ? (
                          // 只读显示
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-mono">
                            {getConfigValue(activeCategory, key)?.toString() || '未设置'}
                          </div>
                        ) : config.type === 'boolean' ? (
                          <select
                            value={getConfigValue(activeCategory, key) ? 'true' : 'false'}
                            onChange={(e) =>
                              updateConfigValue(activeCategory, key, e.target.value === 'true')
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="true">是</option>
                            <option value="false">否</option>
                          </select>
                        ) : (
                          <div className="relative">
                            {config.isSensitive && !(showSensitive[key] || showAllSensitive) ? (
                              // 敏感信息掩码显示
                              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-between min-h-[40px]">
                                <span className="text-gray-600 font-mono tracking-wider">
                                  {'*'.repeat(
                                    Math.min(
                                      getConfigValue(activeCategory, key)?.toString().length || 16,
                                      24
                                    )
                                  )}
                                </span>
                                <Badge variant="secondary" className="text-xs ml-2">
                                  已隐藏
                                </Badge>
                              </div>
                            ) : (
                              // 正常输入框
                              <input
                                type={config.type === 'number' ? 'number' : 'text'}
                                value={getConfigValue(activeCategory, key)}
                                onChange={(e) =>
                                  updateConfigValue(
                                    activeCategory,
                                    key,
                                    config.type === 'number'
                                      ? parseInt(e.target.value) || 0
                                      : e.target.value
                                  )
                                }
                                placeholder={
                                  config.defaultValue ? `默认值: ${config.defaultValue}` : ''
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              />
                            )}
                          </div>
                        )}

                        {/* 显示验证结果 */}
                        {validationResults[activeCategory]?.validationResults?.[key] && (
                          <div className="flex items-center space-x-2 text-sm">
                            {validationResults[activeCategory].validationResults[key].valid ? (
                              <>
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">验证通过</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {validationResults[activeCategory].validationResults[key].error}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <Separator />
                    </div>
                  )
                )}

              {/* 连接测试结果 */}
              {validationResults[activeCategory]?.connectionTest && (
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">连接测试结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationResults[activeCategory].connectionTest.success ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span>连接测试成功</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>
                          连接测试失败: {validationResults[activeCategory].connectionTest.error}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* 添加配置对话框 */}
        {showAddConfig && (
          <div
            className="fixed inset-0 bg-clear bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddConfig(false);
              }
            }}
          >
            <Card className="w-full max-w-md shadow-xl bg-white">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Plus className="h-5 w-5 text-purple-600" />
                      添加配置项
                    </CardTitle>
                    <CardDescription className="mt-1">
                      手动添加配置到 {CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey]?.name}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddConfig(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-4">
                {/* 配置键名 */}
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    配置键名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newConfigKey}
                    onChange={(e) => setNewConfigKey(e.target.value)}
                    placeholder="例如：ai_model_url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    配置的唯一标识符，建议使用小写字母和下划线
                  </p>
                </div>

                {/* 配置值 */}
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    配置值 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newConfigValue}
                    onChange={(e) => setNewConfigValue(e.target.value)}
                    placeholder="请输入配置值"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* 配置描述 (可选) */}
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    配置描述 <span className="text-gray-400">(可选)</span>
                  </label>
                  <input
                    type="text"
                    value={newConfigDescription}
                    onChange={(e) => setNewConfigDescription(e.target.value)}
                    placeholder="简要描述此配置的用途"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* 敏感信息标记 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isSensitive"
                    checked={newConfigIsSensitive}
                    onChange={(e) => setNewConfigIsSensitive(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isSensitive" className="text-sm text-gray-700 cursor-pointer">
                    标记为敏感信息（密钥、密码等）
                  </label>
                </div>

                {/* 按钮 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddConfig(false)}
                    disabled={saving}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={addNewConfig}
                    disabled={saving || !newConfigKey.trim() || !newConfigValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        添加中...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        确认添加
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 删除确认对话框 */}
        {showDeleteConfirm && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white shadow-xl">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">确认删除</CardTitle>
                    <CardDescription>此操作无法撤销</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 mb-2">您确定要删除以下配置吗？</p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{deleteTarget.key}</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteTarget(null);
                    }}
                    disabled={deleting}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={() => deleteConfig(deleteTarget.key)}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        删除中...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        确认删除
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function ConfigManagement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigManagementContent />
    </Suspense>
  );
}
