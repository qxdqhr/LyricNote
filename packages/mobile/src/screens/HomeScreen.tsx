import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  APP_TITLES,
} from '@lyricnote/shared';

export default function HomeScreen(): React.JSX.Element {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const aiServiceRef = useRef<AIService | null>(null);

  // AI 配置（可以改为从存储中加载）
  const [config, setConfig] = useState<AIConfig>({
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: '',
    model: 'deepseek-chat',
  });

  // 从 AI 服务获取消息历史
  const [messages, setMessages] = useState<Message[]>([]);

  // 初始化 AI 服务
  useEffect(() => {
    if (config.apiKey) {
      aiServiceRef.current = createAIService(config, {
        maxMessages: 50,
        systemPrompt: '你是一个友好的 AI 助手，可以帮助用户解答问题。',
      });
      setMessages(aiServiceRef.current.getMessages());
    }
  }, [config.apiKey, config.apiUrl, config.model]);

  // 发送消息到 AI（使用业务逻辑层）
  const sendMessage = async () => {
    if (!inputText.trim()) {
      const alertMsg = '请输入消息';
      if (Platform.OS === 'web') {
        alert(alertMsg);
      } else {
        Alert.alert('提示', alertMsg);
      }
      return;
    }

    if (!config.apiKey || !aiServiceRef.current) {
      const alertMsg = '请先配置 API Key';
      if (Platform.OS === 'web') {
        alert(alertMsg);
      } else {
        Alert.alert('提示', alertMsg);
      }
      setShowConfig(true);
      return;
    }

    const userInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      // 使用 AI 业务逻辑发送消息
      await aiServiceRef.current.chat(userInput);
      
      // 更新消息列表
      setMessages(aiServiceRef.current.getMessages());
      
      // 滚动到底部
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('AI API 调用失败:', error);
      const errorMsg = error.message || 'AI 调用失败';
      
      if (Platform.OS === 'web') {
        alert(errorMsg);
      } else {
        Alert.alert('错误', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 清空对话
  const clearMessages = () => {
    const confirmMsg = '确定要清空所有对话吗？';
    
    const doClear = () => {
      aiServiceRef.current?.clearMessages();
      setMessages(aiServiceRef.current?.getMessages() || []);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        doClear();
      }
    } else {
      Alert.alert('确认', confirmMsg, [
        { text: '取消', style: 'cancel' },
        { text: '清空', style: 'destructive', onPress: doClear },
      ]);
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 {APP_TITLES.main} - AI 测试</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowConfig(!showConfig)}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearMessages}
          >
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 配置面板 */}
      {showConfig && (
        <View style={styles.configPanel}>
          <Text style={styles.configTitle}>API 配置</Text>
          
          <Text style={styles.configLabel}>API URL</Text>
          <TextInput
            style={styles.configInput}
            value={config.apiUrl}
            onChangeText={(text) => setConfig({ ...config, apiUrl: text })}
            placeholder="https://api.deepseek.com/v1/chat/completions"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />

          <Text style={styles.configLabel}>API Key</Text>
          <TextInput
            style={styles.configInput}
            value={config.apiKey}
            onChangeText={(text) => setConfig({ ...config, apiKey: text })}
            placeholder="sk-..."
            placeholderTextColor="#9ca3af"
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.configLabel}>Model</Text>
          <TextInput
            style={styles.configInput}
            value={config.model}
            onChangeText={(text) => setConfig({ ...config, model: text })}
            placeholder="deepseek-chat"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.configCloseButton}
            onPress={() => setShowConfig(false)}
          >
            <Text style={styles.configCloseButtonText}>关闭配置</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* 消息列表 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyText}>开始与 AI 对话</Text>
              <Text style={styles.emptySubtext}>
                {config.apiKey ? '输入消息开始测试' : '请先配置 API Key'}
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user'
                      ? styles.userText
                      : styles.assistantText,
                  ]}
                >
                  {message.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.role === 'user'
                      ? styles.userTime
                      : styles.assistantTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))
          )}
          
          {loading && (
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#8b5cf6" />
              <Text style={styles.loadingText}>AI 正在思考...</Text>
            </View>
          )}
        </ScrollView>

        {/* 输入框 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入消息..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={1000}
            editable={!loading}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>发送</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
  },
  // 配置面板
  configPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  configInput: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  configCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  configCloseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // 消息列表
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  assistantTime: {
    color: '#9ca3af',
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  // 输入框
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 22,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
