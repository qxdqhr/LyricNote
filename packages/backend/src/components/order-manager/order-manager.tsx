'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, GripVertical, Save, RotateCcw, AlertCircle } from 'lucide-react';

export interface OrderableItem {
  id: number;
  [key: string]: any;
}

export interface OrderManagerOperations<T extends OrderableItem> {
  loadItems: () => Promise<T[]>;
  moveItemUp: (id: number) => Promise<void>; // 保留用于向后兼容，但在统一流程中不使用
  moveItemDown: (id: number) => Promise<void>; // 保留用于向后兼容，但在统一流程中不使用
  updateItemOrder: (orders: { id: number; order: number }[]) => Promise<void>; // 统一的批量更新接口
}

export interface OrderManagerProps<T extends OrderableItem> {
  operations: OrderManagerOperations<T>;
  renderItem: (item: T, index: number, isFirst: boolean, isLast: boolean) => React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  onOrderChanged?: () => void;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function OrderManager<T extends OrderableItem>({
  operations,
  renderItem,
  className = '',
  title = '顺序管理',
  description = '拖拽或使用按钮调整显示顺序',
  onOrderChanged,
  emptyMessage = '暂无数据',
  loadingMessage = '加载数据...',
}: OrderManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [originalOrder, setOriginalOrder] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // 加载数据
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await operations.loadItems();

      setItems(data);
      setOriginalOrder([...data]);
      setHasChanges(false);
    } catch (err) {
      console.error('❌ [排序管理] 加载数据错误:', err);
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // 检查是否有变更
  useEffect(() => {
    const hasOrderChanged = items.some((item, index) => originalOrder[index]?.id !== item.id);
    setHasChanges(hasOrderChanged);
  }, [items, originalOrder]);

  // 上移项目
  const handleMoveUp = async (itemId: number) => {
    try {
      setError(null);

      const currentIndex = items.findIndex((item) => item.id === itemId);
      if (currentIndex === -1) {
        setError('项目不存在');
        return;
      }
      if (currentIndex === 0) {
        setError('项目已经在最前面，无法上移');
        return;
      }

      // 调用后端API执行上移操作
      await operations.moveItemUp(itemId);

      // 重新加载数据以确保顺序正确
      await loadItems();

      // 通知父组件顺序已变更
      onOrderChanged?.();
    } catch (err) {
      console.error('❌ [排序管理] 上移项目错误:', err);
      setError(err instanceof Error ? err.message : '上移失败');
    }
  };

  // 下移项目
  const handleMoveDown = async (itemId: number) => {
    try {
      setError(null);

      const currentIndex = items.findIndex((item) => item.id === itemId);
      if (currentIndex === -1) {
        setError('项目不存在');
        return;
      }
      if (currentIndex === items.length - 1) {
        setError('项目已经在最后面，无法下移');
        return;
      }

      // 调用后端API执行下移操作
      await operations.moveItemDown(itemId);

      // 重新加载数据以确保顺序正确
      await loadItems();

      // 通知父组件顺序已变更
      onOrderChanged?.();
    } catch (err) {
      console.error('❌ [排序管理] 下移项目错误:', err);
      setError(err instanceof Error ? err.message : '下移失败');
    }
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 拖拽放置
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    try {
      setError(null);

      // 计算新的顺序
      const newItems = [...items];
      const draggedItemData = newItems[draggedItem];

      // 移除拖拽的项目
      newItems.splice(draggedItem, 1);
      // 在新位置插入
      newItems.splice(dropIndex, 0, draggedItemData);

      // 生成新的显示顺序
      const itemOrders = newItems.map((item, index) => ({
        id: item.id,
        order: index, // 使用索引作为顺序
      }));

      // 调用后端API更新顺序
      await operations.updateItemOrder(itemOrders);

      // 重新加载数据以确保顺序正确
      await loadItems();

      // 通知父组件顺序已变更
      onOrderChanged?.();
    } catch (err) {
      console.error('❌ [排序管理] 拖拽排序错误:', err);
      setError(err instanceof Error ? err.message : '排序失败');
    } finally {
      setDraggedItem(null);
    }
  };

  // 保存新顺序（现在主要用于批量操作）
  const handleSaveOrder = async () => {
    try {
      setSaving(true);
      setError(null);

      // 生成新的显示顺序
      const itemOrders = items.map((item, index) => ({
        id: item.id,
        order: index, // 使用索引作为顺序
      }));

      await operations.updateItemOrder(itemOrders);

      // 更新原始顺序记录，标记为无变更
      setOriginalOrder([...items]);
      setHasChanges(false);

      onOrderChanged?.();
    } catch (err) {
      console.error('❌ [排序管理] 保存顺序错误:', err);
      setError(err instanceof Error ? err.message : '保存失败');
      // 如果保存失败，重新加载数据恢复状态
      await loadItems();
    } finally {
      setSaving(false);
    }
  };

  // 重置顺序
  const handleResetOrder = () => {
    setItems([...originalOrder]);
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 text-gray-600 ${className}`}>
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
        <span>{loadingMessage}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="m-0 text-gray-900 text-lg font-semibold">{title}</h3>
        <div className="flex gap-3">
          {hasChanges && (
            <>
              <button
                onClick={handleResetOrder}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 border-none rounded-lg font-medium cursor-pointer transition-colors hover:bg-amber-600"
                title="重置为原始顺序"
              >
                <RotateCcw size={16} />
                重置
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 border-none rounded-lg font-medium cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="保存新顺序"
              >
                <Save size={16} />
                {saving ? '保存中...' : '保存顺序'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-3 rounded-lg mb-4 border border-red-200">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Hint */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <p className="m-0 mb-2 text-slate-600 text-sm">{description}</p>
        <ul className="m-0 pl-6 text-slate-600 text-sm">
          <li className="mb-1">
            使用拖拽：点击并拖动{' '}
            <GripVertical size={14} className="inline-block align-middle text-gray-600" /> 图标
          </li>
          <li className="mb-1">
            使用按钮：点击{' '}
            <ChevronUp size={14} className="inline-block align-middle text-gray-600" /> 或{' '}
            <ChevronDown size={14} className="inline-block align-middle text-gray-600" /> 按钮
          </li>
          <li className="mb-1">完成调整后，点击"保存顺序"按钮保存更改</li>
        </ul>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${
              draggedItem === index ? 'opacity-50 rotate-[2deg] border-blue-600' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Drag Handle */}
            <div className="flex items-center cursor-grab text-gray-400 p-1 rounded transition-colors hover:text-gray-600 hover:bg-gray-100 active:cursor-grabbing">
              <GripVertical size={20} />
            </div>

            {/* Item Content */}
            <div className="flex-1 min-w-0">
              {renderItem(item, index, index === 0, index === items.length - 1)}
            </div>

            {/* Order Number */}
            <div className="flex items-center mx-3">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-semibold rounded-full">
                #{index + 1}
              </span>
            </div>

            {/* Move Buttons */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleMoveUp(item.id)}
                disabled={index === 0}
                className="flex items-center justify-center w-8 h-8 p-0 border border-gray-300 bg-white text-gray-600 rounded cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50"
                title="上移"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={() => handleMoveDown(item.id)}
                disabled={index === items.length - 1}
                className="flex items-center justify-center w-8 h-8 p-0 border border-gray-300 bg-white text-gray-600 rounded cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50"
                title="下移"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-400 italic">
          <p className="m-0">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
