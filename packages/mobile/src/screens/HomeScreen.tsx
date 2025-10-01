import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { texts } from '../constants/texts';
import { apiService } from '../services/api';
import { Recognition, Song } from '@lyricnote/shared';

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isKTVMode, setIsKTVMode] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<{recognition: Recognition, song: Song} | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '需要麦克风访问权限才能录音。');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('录音错误', '无法开始录音，请重试。');
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsRecording(false);
    setIsRecognizing(true);
    setError(null);
    
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        
        if (uri) {
          // 调用API进行音乐识别
          const response = await apiService.recognizeAudio(uri);
          
          if (response.success && response.data) {
            setRecognitionResult(response.data);
            console.log('Recognition successful:', response.data);
          } else {
            throw new Error(response.error || '识别失败');
          }
        } else {
          throw new Error('录音文件无效');
        }
      } catch (error) {
        console.error('Recognition failed:', error);
        const errorMessage = error instanceof Error ? error.message : '识别失败，请重试';
        setError(errorMessage);
        Alert.alert('识别失败', errorMessage);
      } finally {
        setIsRecognizing(false);
        setRecording(null);
      }
    }
  };

  const handleRecognition = () => {
    if (isRecording) {
      stopRecording();
    } else {
      // 清除之前的结果和错误
      setRecognitionResult(null);
      setError(null);
      startRecording();
    }
  };

  const clearResult = () => {
    setRecognitionResult(null);
    setError(null);
  };

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
            🎌 {texts.home.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={{ padding: 8 }}>
              <Text>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 8 }}>
              <Text>📖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <TouchableOpacity
            onPress={handleRecognition}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: isRecording ? '#ef4444' : '#8b5cf6',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 48, color: 'white' }}>
              {isRecording ? '⏹️' : '🎤'}
            </Text>
          </TouchableOpacity>
          
          <Text style={{ 
            fontSize: 18, 
            color: '#6b7280', 
            textAlign: 'center',
            maxWidth: 300
          }}>
            {isRecording ? texts.home.recording : 
             isRecognizing ? texts.home.recognizing :
             error ? `❌ ${error}` :
             recognitionResult ? `🎵 ${recognitionResult.song.title} - ${recognitionResult.song.artist}` :
             texts.home.tapToRecord}
          </Text>
          
          {(recognitionResult || error) && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              {recognitionResult && (
                <TouchableOpacity
                  onPress={() => {
                    // 跳转到歌词页面
                    console.log('Navigate to lyrics screen with song:', recognitionResult.song);
                  }}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    backgroundColor: '#8b5cf6',
                    borderRadius: 25,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {texts.home.viewLyrics}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={clearResult}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: '#6b7280',
                  borderRadius: 25,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  {error ? '重试' : '清除'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* KTV Mode Toggle */}
        <View style={{ 
          width: '100%', 
          maxWidth: 350,
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: '#8b5cf6',
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Text style={{ fontSize: 24, color: 'white' }}>🎤</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
                  {texts.home.ktvMode}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  {texts.home.ktvModeDesc}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => setIsKTVMode(!isKTVMode)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: isKTVMode ? '#8b5cf6' : '#e5e7eb',
                borderRadius: 20,
              }}
            >
              <Text style={{ 
                color: isKTVMode ? 'white' : '#374151',
                fontWeight: '600',
                fontSize: 14
              }}>
                {isKTVMode ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}