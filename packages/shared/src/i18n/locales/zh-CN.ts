/**
 * 简体中文翻译
 */

export default {
  // 通用
  common: {
    hello: '你好',
    welcome: '欢迎',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    submit: '提交',
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    retry: '重试',
  },

  // 导航
  nav: {
    home: '首页',
    profile: '个人中心',
    settings: '设置',
    logout: '退出登录',
  },

  // 用户
  user: {
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    email: '邮箱',
    phone: '手机号',
    nickname: '昵称',
  },

  // 表单验证
  validation: {
    required: '{{field}}不能为空',
    invalid_email: '邮箱格式不正确',
    password_too_short: '密码至少需要{{count}}个字符',
    passwords_not_match: '两次密码不一致',
  },

  // 错误消息
  errors: {
    network: '网络错误，请稍后重试',
    server: '服务器错误',
    unauthorized: '未授权，请先登录',
    not_found: '未找到相关内容',
    unknown: '未知错误',
  },

  // 成功消息
  success: {
    saved: '保存成功',
    deleted: '删除成功',
    updated: '更新成功',
    created: '创建成功',
  },
} as const;

