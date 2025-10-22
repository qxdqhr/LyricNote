import { APP_CONFIG, UI_TEXT } from '@lyricnote/shared';

export default defineAppConfig({
  pages: ['pages/index/index', 'pages/profile/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8b5cf6',
    navigationBarTitleText: APP_CONFIG.name,
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#9ca3af',
    selectedColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: UI_TEXT.navigation.home,
      },
      {
        pagePath: 'pages/profile/index',
        text: UI_TEXT.navigation.profile,
      },
    ],
  },
});
