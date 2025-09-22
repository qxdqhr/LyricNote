#!/bin/bash

# 🎌 LyricNote 移动端构建脚本
set -e

echo "📱 LyricNote Mobile Build Script"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 进入移动端目录
cd packages/mobile

# 检查Expo CLI
check_expo() {
    if ! command -v npx expo &> /dev/null; then
        echo -e "${RED}❌ Expo CLI not found. Installing...${NC}"
        npm install -g @expo/cli
    fi
    echo -e "${GREEN}✅ Expo CLI is available${NC}"
}

# 检查EAS CLI
check_eas() {
    if ! command -v eas &> /dev/null; then
        echo -e "${YELLOW}⚠️ EAS CLI not found. Installing...${NC}"
        npm install -g eas-cli
    fi
    echo -e "${GREEN}✅ EAS CLI is available${NC}"
}

# 登录EAS
login_eas() {
    echo -e "${BLUE}🔐 Checking EAS authentication...${NC}"
    if ! eas whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️ Not logged in to EAS. Please login:${NC}"
        eas login
    else
        echo -e "${GREEN}✅ Already logged in to EAS as: $(eas whoami)${NC}"
    fi
}

# 配置项目
configure_project() {
    echo -e "${BLUE}⚙️ Configuring project...${NC}"
    
    # 更新app.json配置
    echo -e "${YELLOW}📝 Please update the following in app.json:${NC}"
    echo "  - owner: your-expo-username"
    echo "  - projectId: your-expo-project-id"
    echo "  - apiUrl: https://your-domain.com/api"
    
    read -p "Have you updated app.json? (y/n): " configured
    if [ "$configured" != "y" ]; then
        echo -e "${RED}❌ Please update app.json before continuing${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Project configuration verified${NC}"
}

# 构建开发版本
build_development() {
    echo -e "${BLUE}🔨 Building development version...${NC}"
    
    echo "📱 Available platforms:"
    echo "  1. iOS Simulator"
    echo "  2. Android APK"
    echo "  3. Both platforms"
    
    read -p "Choose platform (1-3): " platform
    
    case $platform in
        1)
            echo -e "${BLUE}🍎 Building iOS development version...${NC}"
            eas build --platform ios --profile development
            ;;
        2)
            echo -e "${BLUE}🤖 Building Android development version...${NC}"
            eas build --platform android --profile development
            ;;
        3)
            echo -e "${BLUE}📱 Building for both platforms...${NC}"
            eas build --platform all --profile development
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            exit 1
            ;;
    esac
}

# 构建预览版本
build_preview() {
    echo -e "${BLUE}🔨 Building preview version...${NC}"
    
    echo "📱 Available platforms:"
    echo "  1. iOS (TestFlight compatible)"
    echo "  2. Android APK"
    echo "  3. Both platforms"
    
    read -p "Choose platform (1-3): " platform
    
    case $platform in
        1)
            echo -e "${BLUE}🍎 Building iOS preview version...${NC}"
            eas build --platform ios --profile preview
            ;;
        2)
            echo -e "${BLUE}🤖 Building Android preview version...${NC}"
            eas build --platform android --profile preview
            ;;
        3)
            echo -e "${BLUE}📱 Building for both platforms...${NC}"
            eas build --platform all --profile preview
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            exit 1
            ;;
    esac
}

# 构建生产版本
build_production() {
    echo -e "${BLUE}🔨 Building production version...${NC}"
    
    echo -e "${YELLOW}⚠️ This will build app store ready versions${NC}"
    echo "📱 Available platforms:"
    echo "  1. iOS (App Store)"
    echo "  2. Android (Google Play)"
    echo "  3. Both platforms"
    
    read -p "Choose platform (1-3): " platform
    
    case $platform in
        1)
            echo -e "${BLUE}🍎 Building iOS production version...${NC}"
            eas build --platform ios --profile production
            ;;
        2)
            echo -e "${BLUE}🤖 Building Android production version...${NC}"
            eas build --platform android --profile production
            ;;
        3)
            echo -e "${BLUE}📱 Building for both platforms...${NC}"
            eas build --platform all --profile production
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            exit 1
            ;;
    esac
}

# 提交到应用商店
submit_stores() {
    echo -e "${BLUE}🚀 Submitting to app stores...${NC}"
    
    echo "📱 Available options:"
    echo "  1. Submit iOS to App Store"
    echo "  2. Submit Android to Google Play"
    echo "  3. Submit to both stores"
    
    read -p "Choose option (1-3): " option
    
    case $option in
        1)
            echo -e "${BLUE}🍎 Submitting to App Store...${NC}"
            eas submit --platform ios
            ;;
        2)
            echo -e "${BLUE}🤖 Submitting to Google Play...${NC}"
            eas submit --platform android
            ;;
        3)
            echo -e "${BLUE}📱 Submitting to both stores...${NC}"
            eas submit --platform all
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            exit 1
            ;;
    esac
}

# 检查构建状态
check_builds() {
    echo -e "${BLUE}📊 Checking build status...${NC}"
    eas build:list --limit=10
}

# 安装构建到设备
install_build() {
    echo -e "${BLUE}📱 Recent builds:${NC}"
    eas build:list --limit=5
    
    echo ""
    read -p "Enter build ID to install: " build_id
    
    if [ -n "$build_id" ]; then
        echo -e "${BLUE}📲 Installing build $build_id...${NC}"
        eas build:run $build_id
    else
        echo -e "${RED}❌ No build ID provided${NC}"
    fi
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}📋 LyricNote Mobile Build Commands:${NC}"
    echo ""
    echo "🔨 Build Commands:"
    echo "  dev        - Build development version (with debugging)"
    echo "  preview    - Build preview version (internal testing)"
    echo "  prod       - Build production version (app stores)"
    echo ""
    echo "🚀 Distribution Commands:"
    echo "  submit     - Submit to app stores"
    echo "  install    - Install build to device"
    echo ""
    echo "📊 Management Commands:"
    echo "  status     - Check build status"
    echo "  configure  - Configure project settings"
    echo ""
    echo "📖 Examples:"
    echo "  ./build-mobile.sh dev      # Build dev version"
    echo "  ./build-mobile.sh preview  # Build preview"
    echo "  ./build-mobile.sh prod     # Build production"
    echo "  ./build-mobile.sh submit   # Submit to stores"
}

# 主函数
main() {
    echo -e "${BLUE}🎌 LyricNote Mobile Build System${NC}"
    echo "================================="
    
    check_expo
    check_eas
    login_eas
    configure_project
    
    echo -e "${BLUE}📱 Build Options:${NC}"
    echo "  1. Development Build (debugging enabled)"
    echo "  2. Preview Build (internal testing)"
    echo "  3. Production Build (app stores)"
    echo "  4. Submit to App Stores"
    echo "  5. Check Build Status"
    echo "  6. Install Build to Device"
    
    read -p "Choose option (1-6): " option
    
    case $option in
        1)
            build_development
            ;;
        2)
            build_preview
            ;;
        3)
            build_production
            ;;
        4)
            submit_stores
            ;;
        5)
            check_builds
            ;;
        6)
            install_build
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            show_help
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}✅ Operation completed!${NC}"
    echo -e "${BLUE}📋 You can check build progress at: https://expo.dev/${NC}"
}

# 参数处理
case "${1:-}" in
    "dev"|"development")
        check_expo && check_eas && login_eas && build_development
        ;;
    "preview")
        check_expo && check_eas && login_eas && build_preview
        ;;
    "prod"|"production")
        check_expo && check_eas && login_eas && build_production
        ;;
    "submit")
        check_eas && login_eas && submit_stores
        ;;
    "status")
        check_eas && login_eas && check_builds
        ;;
    "install")
        check_eas && login_eas && install_build
        ;;
    "configure")
        configure_project
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
