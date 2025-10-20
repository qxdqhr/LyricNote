import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_TITLES } from '@lyricnote/shared';
import { apiService } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI 模型响应数据结构
interface AICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AIChoice[];
  usage: AIUsage;
  system_fingerprint?: string;
}

interface AIChoice {
  index: number;
  message: AIMessage;
  finish_reason: string;
}

interface AIMessage {
  role: string;
  content: string;
  reasoning_content?: string;
}

interface AIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
}

// 硬编码的示例响应数据
const MOCK_AI_RESPONSE: AICompletionResponse = {
  id: "0199f6a40b062c8386b15e137bbdf7a1",
  object: "chat.completion",
  created: 1760779569,
  model: "Qwen/Qwen3-8B",
  choices: [{
    index: 0,
    message: {
      role: "assistant",
      content: "\n\nAs of my knowledge cutoff in July 2024, I can't provide real-time updates. However, here's a summary of major global news and events up to 2023, which might still be relevant or provide context for current discussions:\n\n### **1. Middle East Conflict (Israel and Palestine):**  \n- **Escalation of Violence:** In 2023, tensions between Israel and Palestine reached new heights, with Israel launching military operations in the Gaza Strip following attacks by Palestinian militant groups. The conflict led to significant humanitarian crises, including displacement, infrastructure damage, and international condemnation.  \n- **Diplomatic Efforts:** The U.S. and other nations mediated talks to de-escalate violence, but lasting peace remains elusive. The UN and regional organizations called for ceasefire and humanitarian aid access.\n\n### **2. Ukraine War:**  \n- **Ongoing Conflict:** Russia's invasion of Ukraine continued in 2023, with heavy fighting in the eastern regions (e.g., Kharkiv, Kherson) and Kyiv. The war has caused widespread destruction, economic strain, and a refugee crisis.  \n- **International Support:** Western countries, including the U.S. and EU, provided military aid and sanctions against Russia. The war also impacted global energy markets and food security.\n\n### **3. U.S. Politics:**  \n- **Presidential Election:** The 2024 U.S. presidential election saw heightened political activity, with candidates like Donald Trump and Kamala Harris competing. Issues such as healthcare, climate change, and immigration dominated debates.  \n- **Government Actions:** The U.S. government faced scrutiny over policies on AI regulation, cybersecurity, and climate initiatives. The Supreme Court also delivered landmark rulings on voting rights and abortion access.\n\n### **4. Environmental Issues:**  \n- **Climate Change:** 2023 was marked by extreme weather events, including wildfires in Canada and Australia, floods in Pakistan, and heatwaves in Europe. The UN warned of the urgent need to cut carbon emissions.  \n- **Global Agreements:** The EU finalized the **AI Act**, a landmark regulation for AI safety and ethics, while the U.S. and other nations debated climate policies amid rising global temperatures.\n\n### **5. Health and Pandemic Updates:**  \n- **Post-Pandemic Challenges:** While the immediate crisis of the COVID-19 pandemic subsided, long-term health impacts, mental health struggles, and vaccine equity issues remained topics of discussion.  \n- **New Variants:** Concerns about new viral variants persisted, though no major outbreaks were reported in 2023.\n\n### **6. Technology and Innovation:**  \n- **AI Regulation:** The EU's AI Act (2023) and U.S. discussions on AI governance highlighted global efforts to address ethical and safety concerns.  \n- **Quantum Computing:** Breakthroughs in quantum computing and space exploration (e.g., NASA missions) were notable in 2023.\n\n### **7. Other International News:**  \n- **Sudan Conflict:** A devastating civil war in Sudan (2023) displaced millions and drew international attention, with the UN Security Council calling for a ceasefire.  \n- **Afghanistan:** The Taliban's continued rule in Afghanistan and its impact on regional stability were closely watched.  \n- **Global Trade:** Geopolitical tensions influenced trade dynamics, with issues like semiconductor exports and supply chain disruptions gaining traction.\n\n### **8. Cultural and Social Developments:**  \n- **Global Movements:** Protests and movements for social justice, climate action, and LGBTQ+ rights continued to shape public discourse worldwide.  \n- **Sports and Entertainment:** Major events like the Paris Olympics (2024) and awards shows were anticipated, though the 2023 season saw highlights in sports and entertainment.\n\n### **Note:**  \nFor the **latest updates**, please check reputable news sources like BBC, Reuters, or The New York Times, as current events may have evolved significantly since my knowledge cutoff. Let me know if you'd like more details on any specific topic!",
      reasoning_content: "\nOkay, the user asked for \"today news,\" so I need to provide a summary of recent events. First, I should check the current date to make sure the information is up-to-date. Since I can't access real-time data, I'll have to rely on my training data up to 2023. Let me think about the major global events that occurred around that time.\n\nThere were significant developments in the Middle East, like the ongoing conflict in Gaza and the situation in Israel. Also, the war in Ukraine continued to be a major news topic. In the U.S., there were discussions about the presidential election and related political events. Environmental issues, such as climate change and extreme weather, were prominent as well. Technological advancements, including AI regulations and breakthroughs in quantum computing, were in the news. Health-related updates, like the status of the pandemic and new vaccine developments, were also relevant. \n\nI should structure the information by category, maybe start with the most impactful events. For each topic, I need to mention key points without going into too much detail. It's important to highlight both the Middle East conflict and the Ukraine war, as they were major global issues. The U.S. election and political tensions should be covered next. Then move to environmental and health news, followed by technology. I should also include some other international news, like the situation in the Democratic Republic of Congo or other regions. \n\nWait, I need to make sure the information is accurate. For example, the Israeli-Palestinian conflict had several key developments, including the recent attacks and the subsequent military response. The war in Ukraine saw ongoing battles and diplomatic efforts. In the U.S., the election cycle was active with debates and political campaigns. Environmental news included the impact of climate change, like wildfires in Canada and Australia. Health updates might involve the emergence of new variants or vaccine distribution. Technology news could include the EU's AI Act and the U.S. government's response to AI regulations. \n\nI should also mention any major international events, like the G7 summit or other summits where global leaders discussed issues. Maybe include some cultural or sports events, but keep it brief. It's crucial to present the information in a clear, concise manner, avoiding any biased language. Also, check for any recent news that might have been overlooked, such as the situation in the Pacific Islands with climate change. \n\nI need to ensure that each point is factual and not speculative. For example, the situation in the Democratic Republic of Congo with the humanitarian crisis and the role of the UN. Also, the conflict in Sudan, which was a significant event. I should mention the UN Security Council's response to the Sudan conflict. \n\nI should structure the summary in a way that's easy to read, perhaps using bullet points or sections. Make sure to note the most recent developments first, even if they're from late 2023. Also, include any economic news, like the impact of the war on global markets or inflation rates. \n\nWait, but since my training data is up to 2023, I need to be careful not to mention events beyond that. For example, the situation in the Middle East in 2023 had the recent attacks and the Israeli military's response. The war in Ukraine continued with significant battles in the east. In the U.S., the presidential election was a big deal, with candidates like Trump and Harris. \n\nEnvironmental issues included the extreme weather events and the UN's climate reports. Health-wise, the pandemic was still a concern, but there were also discussions about new vaccines and treatments. Technology news had the EU's AI Act and the U.S. government's stance on AI. \n\nOther international news could include the situation in Afghanistan, the role of the Taliban, or the status of the war in Yemen. Also, mention any major geopolitical shifts, like the rejoining of the U.S. to the Paris Agreement. \n\nI should make sure the summary is balanced, covering different regions and sectors. Avoid any overly technical terms, keep it accessible. Also, note any significant milestones, like the 10th anniversary of the Arab Spring or other historical events. \n\nWait, the user might be looking for the latest news as of the current date, but since I can't access real-time data, I'll have to inform them that I can't provide the most up-to-date information. However, I can offer a summary of the latest news up to 2023. \n\nI need to structure the response with a clear introduction stating the limitation, then list the major news topics with key points. Make sure each point is concise and covers the most important aspects. Also, mention that for the latest updates, they should check reliable news sources. \n\nLet me organize the information into sections: Middle East, Ukraine, U.S. Politics, Environmental, Health, Technology, and Other International. That way, the user can get a comprehensive overview. \n\nDouble-check the details for accuracy. For example, the UN Security Council's response to the Sudan conflict was a significant development. The EU's AI Act was finalized in 2023. The U.S. had ongoing discussions about AI regulations. \n\nYes, that seems right. Now, I'll present the summary in a clear, friendly manner, making sure to mention the date range and direct the user to check current sources for the latest updates."
    },
    finish_reason: "stop"
  }],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 1944,
    total_tokens: 1954,
    completion_tokens_details: {
      reasoning_tokens: 1104
    }
  },
  system_fingerprint: ""
};

export default function AITestScreen(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    loadAIConfig();
  }, []);

  const checkLoginStatus = async () => {
    const loggedIn = await apiService.isAuthenticated();
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      Alert.alert('提示', '请先登录后使用 AI 测试功能', [
        { text: '确定' }
      ]);
    }
  };

  const loadAIConfig = async () => {
    try {
      console.log('🤖 [AI Test] 正在加载 AI 配置...');
      const response = await apiService.get('/ai/config');

      if (response.success && response.data) {
        console.log('✅ [AI Test] AI 配置加载成功:');
        console.log('  📡 API URL:', response.data.apiUrl || '❌ 未配置');
        console.log('  🎯 Model:', response.data.model || '❌ 未配置');
        console.log('  🔑 API Key 已配置:', response.data.apiKeyConfigured ? '✅ 是' : '❌ 否');
        if (response.data.apiKeyMasked) {
          console.log('  🔐 API Key (掩码):', response.data.apiKeyMasked);
        }
        console.log('  ✨ 配置状态:', response.data.configured ? '✅ 已配置' : '❌ 未完全配置');
        
        if (!response.data.configured) {
          console.warn('⚠️  [AI Test] AI 服务未完全配置，请联系管理员在管理后台配置以下项:');
          if (!response.data.apiKeyConfigured) {
            console.warn('     - ai_model_api_key (AI API Key)');
          }
          if (!response.data.apiUrl) {
            console.warn('     - ai_model_api_base_url (AI API 地址)');
          }
          if (!response.data.model) {
            console.warn('     - ai_model_name (AI 模型)');
          }
        }
      } else {
        console.error('❌ [AI Test] 加载 AI 配置失败:', response.error);
      }
    } catch (error) {
      console.error('❌ [AI Test] 加载 AI 配置异常:', error);
    }
  };

  const loadMockResponse = () => {
    console.log('📦 [AI Test] 加载硬编码的示例响应数据:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 响应基本信息:');
    console.log('  🆔 Response ID:', MOCK_AI_RESPONSE.id);
    console.log('  📦 Object Type:', MOCK_AI_RESPONSE.object);
    console.log('  🕐 Created:', new Date(MOCK_AI_RESPONSE.created * 1000).toLocaleString('zh-CN'));
    console.log('  🤖 Model:', MOCK_AI_RESPONSE.model);
    console.log('  🔐 System Fingerprint:', MOCK_AI_RESPONSE.system_fingerprint || 'N/A');
    console.log('');
    console.log('💬 响应内容 (Choices):');
    MOCK_AI_RESPONSE.choices.forEach((choice, idx) => {
      console.log(`  Choice #${choice.index}:`);
      console.log('    👤 Role:', choice.message.role);
      console.log('    📝 Content Length:', choice.message.content.length, 'chars');
      console.log('    📝 Content Preview:', choice.message.content.substring(0, 200) + '...');
      if (choice.message.reasoning_content) {
        console.log('    🧠 Reasoning Length:', choice.message.reasoning_content.length, 'chars');
        console.log('    🧠 Reasoning Preview:', choice.message.reasoning_content.substring(0, 150) + '...');
      }
      console.log('    ✅ Finish Reason:', choice.finish_reason);
    });
    console.log('');
    console.log('📊 Token 使用统计 (Usage):');
    console.log('  📥 Prompt Tokens:', MOCK_AI_RESPONSE.usage.prompt_tokens);
    console.log('  📤 Completion Tokens:', MOCK_AI_RESPONSE.usage.completion_tokens);
    console.log('  📊 Total Tokens:', MOCK_AI_RESPONSE.usage.total_tokens);
    if (MOCK_AI_RESPONSE.usage.completion_tokens_details?.reasoning_tokens) {
      console.log('  🧠 Reasoning Tokens:', MOCK_AI_RESPONSE.usage.completion_tokens_details.reasoning_tokens);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 将示例响应显示在消息列表中
    const mockUserMessage: Message = {
      id: 'mock-user-' + Date.now(),
      role: 'user',
      content: 'Today news (示例请求)',
      timestamp: new Date(MOCK_AI_RESPONSE.created * 1000 - 5000),
    };

    const mockAiMessage: Message = {
      id: 'mock-ai-' + Date.now(),
      role: 'assistant',
      content: MOCK_AI_RESPONSE.choices[0].message.content,
      timestamp: new Date(MOCK_AI_RESPONSE.created * 1000),
    };

    setMessages([mockUserMessage, mockAiMessage]);
    Alert.alert('✅ 示例数据已加载', '示例 AI 响应已显示在消息列表中，详细数据已打印到日志。');
  };

  const sendMessage = async () => {
    console.log('🚀 [AI Test] 点击发送按钮');
    console.log('  📝 输入内容:', inputText);
    console.log('  🔐 登录状态:', isLoggedIn);
    
    if (!inputText.trim()) {
      console.log('⚠️  [AI Test] 输入内容为空，取消发送');
      return;
    }

    if (!isLoggedIn) {
      console.log('⚠️  [AI Test] 用户未登录，取消发送');
      Alert.alert('提示', '请先登录后使用 AI 测试功能');
      return;
    }

    console.log('✅ [AI Test] 开始发送消息...');
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      console.log('📡 [AI Test] 调用 API: POST /ai/chat');
      console.log('  📦 请求参数:', {
        message: currentInput,
        historyCount: messages.length
      });

      // 调用后端代理 API
      const response = await apiService.post('/ai/chat', {
        message: currentInput,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      console.log('📥 [AI Test] 收到 API 响应:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error
      });

      if (response.success && response.data) {
        console.log('✅ [AI Test] AI 响应成功');
        console.log('  📝 内容长度:', response.data.content.length, 'chars');
        console.log('  🤖 使用模型:', response.data.model);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'AI 调用失败');
      }
    } catch (error) {
      console.error('❌ [AI Test] AI API 调用失败:', error);
      Alert.alert('错误', 'AI 调用失败: ' + (error as Error).message);
      // 失败时移除用户消息
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
      console.log('🏁 [AI Test] 消息发送流程结束');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

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
            onPress={loadMockResponse}
          >
            <Text style={styles.headerButtonText}>📦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearMessages}
          >
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* 消息列表 */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyText}>开始与 AI 对话</Text>
              <Text style={styles.emptySubtext}>输入消息开始测试</Text>
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

