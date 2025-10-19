// 语言类型
export type LanguageMode = 'kanji' | 'hiragana' | 'romaji' | 'learning';

// 学习状态类型
export type LearningStatus = 'not_started' | 'learning' | 'mastered';

// 歌曲信息类型
export interface Song {
  id: string;
  title: string;
  titleHiragana?: string;
  titleRomaji?: string;
  artist: string;
  artistHiragana?: string;
  artistRomaji?: string;
  album?: string;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  animeSource?: string;
}

// 导航参数类型
export type RootStackParamList = {
  TabNavigator: undefined;
  KTVMode: undefined;
};

export type TabParamList = {
  Home: undefined;
  AITest: undefined;
  Profile: undefined;
};