import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Alert,
  AlertTitle,
  AlertDescription
} from '../components/ui'

export function UIShowcase() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 space-y-6">
        {/* 页面标题 */}
        <View className="text-center">
          <Text className="text-3xl font-bold text-gray-900">
            🎌 UI组件展示
          </Text>
          <Text className="text-gray-600 mt-2">
            React Native版本的shadcn/ui风格组件
          </Text>
        </View>

        {/* 按钮展示 */}
        <Card>
          <CardHeader>
            <CardTitle>按钮组件</CardTitle>
            <CardDescription>不同样式和尺寸的按钮</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <View className="flex-row flex-wrap gap-2">
                <Button>默认按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="outline">轮廓按钮</Button>
                <Button variant="ghost">幽灵按钮</Button>
              </View>
              
              <View className="flex-row flex-wrap gap-2">
                <Button variant="destructive">危险按钮</Button>
                <Button loading>加载中...</Button>
                <Button 
                  icon={<Ionicons name="heart" size={16} color="white" />}
                >
                  带图标
                </Button>
              </View>
              
              <View className="flex-row flex-wrap gap-2">
                <Button size="sm">小按钮</Button>
                <Button size="lg">大按钮</Button>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 徽章展示 */}
        <Card>
          <CardHeader>
            <CardTitle>徽章组件</CardTitle>
            <CardDescription>用于状态和标签显示</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              <Badge>默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="success">成功</Badge>
              <Badge variant="destructive">错误</Badge>
              <Badge variant="outline">轮廓</Badge>
            </View>
          </CardContent>
        </Card>

        {/* 输入框展示 */}
        <Card>
          <CardHeader>
            <CardTitle>输入框组件</CardTitle>
            <CardDescription>表单输入控件</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Input
                label="邮箱地址"
                placeholder="请输入邮箱"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon={<Ionicons name="mail" size={16} color="#6B7280" />}
              />
              
              <Input
                label="密码"
                placeholder="请输入密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Ionicons name="lock-closed" size={16} color="#6B7280" />}
                helperText="密码至少8位字符"
              />
              
              <Input
                label="错误示例"
                placeholder="这个输入框有错误"
                error="这是一个错误信息"
              />
            </View>
          </CardContent>
        </Card>

        {/* 警告框展示 */}
        <Card>
          <CardHeader>
            <CardTitle>警告框组件</CardTitle>
            <CardDescription>用于显示重要信息</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Alert 
                icon={<Ionicons name="information-circle" size={20} color="#3B82F6" />}
              >
                <AlertTitle>信息提示</AlertTitle>
                <AlertDescription>
                  这是一个普通的信息提示框，用于展示一般信息。
                </AlertDescription>
              </Alert>
              
              <Alert 
                variant="success"
                icon={<Ionicons name="checkmark-circle" size={20} color="#10B981" />}
              >
                <AlertTitle variant="success">操作成功</AlertTitle>
                <AlertDescription variant="success">
                  您的操作已经成功完成！
                </AlertDescription>
              </Alert>
              
              <Alert 
                variant="warning"
                icon={<Ionicons name="warning" size={20} color="#F59E0B" />}
              >
                <AlertTitle variant="warning">注意事项</AlertTitle>
                <AlertDescription variant="warning">
                  请仔细检查您的输入信息。
                </AlertDescription>
              </Alert>
              
              <Alert 
                variant="destructive"
                icon={<Ionicons name="close-circle" size={20} color="#EF4444" />}
              >
                <AlertTitle variant="destructive">错误警告</AlertTitle>
                <AlertDescription variant="destructive">
                  发生了一个错误，请重试或联系管理员。
                </AlertDescription>
              </Alert>
            </View>
          </CardContent>
        </Card>

        {/* 卡片嵌套展示 */}
        <Card>
          <CardHeader>
            <CardTitle>统计数据</CardTitle>
            <CardDescription>应用使用统计</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center p-3 bg-purple-50 rounded-lg">
                <View>
                  <Text className="text-sm text-gray-600">总用户数</Text>
                  <Text className="text-2xl font-bold text-purple-600">1,234</Text>
                </View>
                <Ionicons name="people" size={24} color="#8B5CF6" />
              </View>
              
              <View className="flex-row justify-between items-center p-3 bg-green-50 rounded-lg">
                <View>
                  <Text className="text-sm text-gray-600">识别成功</Text>
                  <Text className="text-2xl font-bold text-green-600">98.5%</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}
