import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始数据库种子数据初始化...')

  // 创建管理员账户
  const adminPassword = await bcrypt.hash('admin123456', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lyricnote.com' },
    update: {},
    create: {
      email: 'admin@lyricnote.com',
      username: 'admin',
      password: adminPassword,
      nickname: '系统管理员',
      role: UserRole.SUPER_ADMIN,
      preferences: {
        language: 'zh-CN',
        defaultLyricMode: 'kanji',
        autoTranslate: true,
        enableKTVMode: true
      }
    }
  })

  console.log('✅ 创建管理员账户:', admin.email)

  // 创建系统配置
  const systemConfigs = [
    {
      key: 'app_name',
      value: 'LyricNote',
      description: '应用名称'
    },
    {
      key: 'app_version',
      value: '1.0.0',
      description: '应用版本'
    },
    {
      key: 'max_recognition_per_day',
      value: 100,
      description: '每日最大识别次数'
    },
    {
      key: 'enable_ai_processing',
      value: true,
      description: '启用AI处理'
    },
    {
      key: 'default_language_modes',
      value: ['kanji', 'hiragana', 'romaji'],
      description: '默认语言模式'
    }
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: {
        key: config.key,
        value: config.value,
        description: config.description
      }
    })
    console.log(`✅ 创建系统配置: ${config.key}`)
  }

  // 创建示例歌曲数据
  const sampleSongs = [
    {
      title: '夜に駆ける',
      artist: 'YOASOBI',
      album: 'THE BOOK',
      duration: 263,
      releaseYear: 2019,
      genre: 'J-POP',
      isJapanese: true,
      metadata: {
        popularity: 'high',
        difficulty: 'medium'
      }
    },
    {
      title: '猫',
      artist: 'DISH//',
      album: null,
      duration: 225,
      releaseYear: 2018,
      genre: 'J-POP',
      isJapanese: true,
      metadata: {
        popularity: 'high',
        difficulty: 'easy'
      }
    },
    {
      title: 'Pretender',
      artist: 'Official髭男dism',
      album: 'Traveler',
      duration: 329,
      releaseYear: 2019,
      genre: 'J-POP',
      isJapanese: true,
      metadata: {
        popularity: 'very_high',
        difficulty: 'medium'
      }
    }
  ]

  for (const songData of sampleSongs) {
    const song = await prisma.song.upsert({
      where: {
        title_artist: {
          title: songData.title,
          artist: songData.artist
        }
      },
      update: {},
      create: songData
    })
    console.log(`✅ 创建示例歌曲: ${song.title} - ${song.artist}`)

    // 为每首歌创建示例歌词
    await prisma.lyric.upsert({
      where: {
        songId_version: {
          songId: song.id,
          version: 1
        }
      },
      update: {},
      create: {
        songId: song.id,
        content: `${songData.title}的日语歌词内容...`,
        kanji: `${songData.title}的汉字版本...`,
        hiragana: `${songData.title}的平假名版本...`,
        romaji: `${songData.title}的罗马音版本...`,
        translation: `${songData.title}的中文翻译...`,
        status: 'APPROVED',
        version: 1
      }
    })
    console.log(`✅ 创建示例歌词: ${song.title}`)
  }

  console.log('🎉 数据库种子数据初始化完成!')
  console.log('')
  console.log('📋 管理员登录信息:')
  console.log('   邮箱: admin@lyricnote.com')
  console.log('   密码: admin123456')
  console.log('')
  console.log('🚀 现在可以启动应用了!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
