import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView,
  TextInput
} from 'react-native';
import { texts } from '../constants/texts';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverColor: string;
  dateAdded: string;
  duration: string;
  category: '最近' | '喜爱' | '歌单';
}

const mockSongs: Song[] = [
  {
    id: '1',
    title: '夜に駆ける',
    artist: 'YOASOBI',
    coverColor: '#e94560',
    dateAdded: '2024-03-20',
    duration: '4:23',
    category: '最近'
  },
  {
    id: '2',
    title: '猫',
    artist: 'DISH//',
    coverColor: '#4f46e5',
    dateAdded: '2024-03-19',
    duration: '3:45',
    category: '喜爱'
  },
  {
    id: '3',
    title: 'Pretender',
    artist: 'Official髭男dism',
    coverColor: '#059669',
    dateAdded: '2024-03-18',
    duration: '5:29',
    category: '喜爱'
  },
  {
    id: '4',
    title: '廻廻奇譚',
    artist: 'Eve',
    coverColor: '#dc2626',
    dateAdded: '2024-03-17',
    duration: '3:26',
    category: '最近'
  },
  {
    id: '5',
    title: '炎',
    artist: 'LiSA',
    coverColor: '#ea580c',
    dateAdded: '2024-03-16',
    duration: '4:17',
    category: '歌单'
  }
];

type FilterCategory = '全部' | '最近' | '喜爱' | '歌单';

export default function CollectionScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('全部');

  const categories: FilterCategory[] = ['全部', '最近', '喜爱', '歌单'];

  const filteredSongs = mockSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || song.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const SongItem = ({ song }: { song: Song }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Album Cover */}
      <View style={{
        width: 60,
        height: 60,
        backgroundColor: song.coverColor,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
      }}>
        <Text style={{ fontSize: 24, color: 'white' }}>🎵</Text>
      </View>

      {/* Song Info */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#111827',
          marginBottom: 4
        }}>
          {song.title}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6b7280',
          marginBottom: 2
        }}>
          {song.artist}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#9ca3af'
        }}>
          {song.dateAdded} • {song.duration}
        </Text>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ padding: 8, marginLeft: 8 }}>
          <Text style={{ fontSize: 18 }}>▶️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 8, marginLeft: 4 }}>
          <Text style={{ fontSize: 18 }}>⋯</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e5e7eb' 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: '#8b5cf6' 
          }}>
            📚 {texts.collection.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={{ padding: 8 }}>
              <Text>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 8 }}>
              <Text>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        backgroundColor: 'white'
      }}>
        <TextInput
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: '#111827'
          }}
          placeholder={texts.collection.search}
          placeholderTextColor="#9ca3af"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60 }}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingVertical: 12,
          backgroundColor: 'white'
        }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              marginRight: 12,
              backgroundColor: selectedCategory === category ? '#8b5cf6' : '#f3f4f6',
              borderRadius: 20,
            }}
          >
            <Text style={{
              color: selectedCategory === category ? 'white' : '#6b7280',
              fontWeight: selectedCategory === category ? '600' : '400',
              fontSize: 14
            }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Songs List */}
      <ScrollView style={{ flex: 1, paddingTop: 8 }}>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <SongItem key={song.id} song={song} />
          ))
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40
          }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎵</Text>
            <Text style={{ fontSize: 18, color: '#6b7280', marginBottom: 8 }}>
              {texts.collection.empty.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingHorizontal: 40 }}>
              {texts.collection.empty.subtitle}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Stats Footer */}
      <View style={{
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 12
      }}>
        <Text style={{
          fontSize: 12,
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          显示 {filteredSongs.length} 首 • 共收藏 {mockSongs.length} 首歌曲
        </Text>
      </View>
    </SafeAreaView>
  );
}
