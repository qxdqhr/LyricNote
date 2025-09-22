import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎌 LyricNote Backend
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            日语音乐识别应用后端系统 + Web 管理平台
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Next.js 15
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Prisma ORM
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              PostgreSQL
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Redis
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold mb-2">音乐识别 API</h3>
            <p className="text-gray-600">
              基于 AI 的日语歌曲识别，支持多种音频格式，高准确率识别
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">歌词处理</h3>
            <p className="text-gray-600">
              汉字、平假名、罗马音多语言转换，AI 增强的翻译服务
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">用户管理</h3>
            <p className="text-gray-600">
              完整的用户注册、登录、权限控制和会话管理系统
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">收藏管理</h3>
            <p className="text-gray-600">
              智能分类的歌曲收藏系统，支持学习进度跟踪
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI 集成</h3>
            <p className="text-gray-600">
              DeepSeek 大模型日语优化处理，智能歌词转换和翻译
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">管理后台</h3>
            <p className="text-gray-600">
              完整的 Web 管理界面，数据分析和系统监控
            </p>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">API 状态</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <h3 className="font-semibold">认证服务</h3>
              <p className="text-sm text-gray-600">正常运行</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <h3 className="font-semibold">音乐识别</h3>
              <p className="text-sm text-gray-600">正常运行</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <h3 className="font-semibold">歌词处理</h3>
              <p className="text-sm text-gray-600">正常运行</p>
            </div>
            <div className="text-center">
              <div className="text-yellow-500 text-2xl mb-2">⚠️</div>
              <h3 className="font-semibold">AI 服务</h3>
              <p className="text-sm text-gray-600">需要配置</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">快速开始</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              管理后台
            </Link>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              API 健康检查
            </a>
            <a
              href="https://github.com/your-org/lyricnote-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              GitHub 文档
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            LyricNote Backend v1.0.0 • 专注日语音乐识别和歌词处理
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Built with ❤️ using Next.js, TypeScript, and modern web technologies
          </p>
        </div>
      </div>
    </div>
  )
}