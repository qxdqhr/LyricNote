// 日语文本常量
export const japaneseTexts = {
  navigation: {
    home: 'ホーム',
    lyrics: '歌詞',
    create: '作成',
    collection: 'コレクション',
    profile: 'プロフィール',
  },
  
  home: {
    title: 'LyricNote',
    subtitle: '日本の音楽を認識する',
    ktvMode: 'KTVモード',
    ktvModeDesc: '大文字歌詞表示',
  },
  
  lyrics: {
    title: '歌詞同期',
    languageModes: {
      kanji: '漢字',
      hiragana: 'ひらがな',
      romaji: 'Romaji',
      learning: '学習モード',
    },
  },
  
  recognition: {
    status: {
      default: '日本の音楽を認識する',
      recording: '録音中... ({count}s)',
      recognizing: 'AI認識中...',
      success: '認識成功！',
    },
  },
} as const;