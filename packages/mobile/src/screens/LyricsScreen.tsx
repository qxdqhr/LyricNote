import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView,
  Animated
} from 'react-native';
import { texts } from '../constants/texts';

type LyricMode = 'kanji' | 'hiragana' | 'romaji';

interface LyricLine {
  time: number;
  kanji: string;
  hiragana: string;
  romaji: string;
  translation?: string;
}

const mockLyrics: LyricLine[] = [
  {
    time: 0,
    kanji: "沈むように溶けてゆくように",
    hiragana: "しずむように とけてゆくように",
    romaji: "shizumu you ni tokete yuku you ni",
    translation: "Like sinking, like melting away"
  },
  {
    time: 3,
    kanji: "二人だけの空が広がる夜に",
    hiragana: "ふたりだけの そらが ひろがる よるに",
    romaji: "futari dake no sora ga hirogaru yoru ni",
    translation: "In the night where our sky spreads out"
  },
  {
    time: 7,
    kanji: "「さよなら」だけだった",
    hiragana: "「さよなら」だけだった",
    romaji: "\"sayonara\" dake datta",
    translation: "There was only \"goodbye\""
  },
  {
    time: 10,
    kanji: "その一言で全てが変わった",
    hiragana: "その ひとこと で すべてが かわった",
    romaji: "sono hitokoto de subete ga kawatta",
    translation: "With those words, everything changed"
  },
  {
    time: 14,
    kanji: "日が沈み出した空と君の姿",
    hiragana: "ひが しずみでした そらと きみの すがた",
    romaji: "hi ga shizumi dashita sora to kimi no sugata",
    translation: "The sunset sky and your figure"
  },
  {
    time: 18,
    kanji: "フェンス越しに重なっていた",
    hiragana: "フェンスごしに かさなっていた",
    romaji: "fensu-goshi ni kasanatte ita",
    translation: "Overlapping beyond the fence"
  }
];

export default function LyricsScreen() {
  const [lyricMode, setLyricMode] = useState<LyricMode>('kanji');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.5;
          
          // 更新当前歌词行
          const lineIndex = mockLyrics.findIndex((line, index) => {
            const nextLine = mockLyrics[index + 1];
            return newTime >= line.time && (!nextLine || newTime < nextLine.time);
          });
          
          if (lineIndex !== -1 && lineIndex !== currentLineIndex) {
            setCurrentLineIndex(lineIndex);
          }
          
          return newTime;
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentLineIndex]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPlayback = () => {
    setCurrentTime(0);
    setCurrentLineIndex(0);
    setIsPlaying(false);
  };

  const getLyricText = (line: LyricLine) => {
    switch (lyricMode) {
      case 'hiragana':
        return line.hiragana;
      case 'romaji':
        return line.romaji;
      default:
        return line.kanji;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        backgroundColor: '#16213e', 
        borderBottomWidth: 1, 
        borderBottomColor: '#0f3460' 
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: '#e94560',
            marginBottom: 4
          }}>
            夜に駆ける - YOASOBI
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#a0a0a0' 
          }}>
            {texts.lyrics.title}
          </Text>
        </View>
      </View>

      {/* Language Mode Selector */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingVertical: 16,
        backgroundColor: '#16213e'
      }}>
        {(['kanji', 'hiragana', 'romaji'] as LyricMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => setLyricMode(mode)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              marginHorizontal: 8,
              backgroundColor: lyricMode === mode ? '#e94560' : 'transparent',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: lyricMode === mode ? '#e94560' : '#0f3460',
            }}
          >
            <Text style={{ 
              color: lyricMode === mode ? 'white' : '#a0a0a0',
              fontWeight: lyricMode === mode ? '600' : '400',
              fontSize: 14
            }}>
              {texts.lyrics.languageModes[mode]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lyrics Display */}
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingVertical: 20 }}>
          {mockLyrics.map((line, index) => (
            <View key={index} style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: index === currentLineIndex ? 22 : 18,
                lineHeight: index === currentLineIndex ? 32 : 28,
                color: index === currentLineIndex ? '#e94560' : 
                       index < currentLineIndex ? '#ffffff' : '#666666',
                fontWeight: index === currentLineIndex ? '600' : '400',
                textAlign: 'center',
                marginBottom: 8,
                textShadowColor: index === currentLineIndex ? '#e94560' : 'transparent',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: index === currentLineIndex ? 10 : 0,
              }}>
                {getLyricText(line)}
              </Text>
              
              {lyricMode !== 'romaji' && (
                <Text style={{
                  fontSize: 14,
                  color: index === currentLineIndex ? '#ffb3c1' : '#888888',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {line.romaji}
                </Text>
              )}
              
              {line.translation && (
                <Text style={{
                  fontSize: 12,
                  color: '#999999',
                  textAlign: 'center',
                  marginTop: 4,
                  fontStyle: 'italic'
                }}>
                  {line.translation}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Control Panel */}
      <View style={{ 
        backgroundColor: '#16213e', 
        paddingHorizontal: 20, 
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#0f3460'
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <TouchableOpacity
            onPress={resetPlayback}
            style={{
              padding: 12,
              backgroundColor: '#0f3460',
              borderRadius: 25,
            }}
          >
            <Text style={{ fontSize: 18 }}>⏮️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={togglePlayback}
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#e94560',
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: '#0f3460',
              borderRadius: 25,
            }}
          >
            <Text style={{ fontSize: 18 }}>❤️</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ 
          marginTop: 12, 
          alignItems: 'center' 
        }}>
          <Text style={{ 
            color: '#a0a0a0', 
            fontSize: 12 
          }}>
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')} / 3:35
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
