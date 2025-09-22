#!/bin/bash

# 🚀 GitHub Actions 快速设置脚本
set -e

echo "🚀 Setting up GitHub Actions for LyricNote"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查Git仓库
check_git() {
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ This is not a Git repository${NC}"
        echo "Please run this script from the LyricNote project root"
        exit 1
    fi
    
    # 检查远程仓库
    if ! git remote get-url origin > /dev/null 2>&1; then
        echo -e "${RED}❌ No remote repository configured${NC}"
        echo "Please add your GitHub repository as origin:"
        echo "git remote add origin https://github.com/your-username/LyricNote.git"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Git repository configured${NC}"
}

# 显示需要配置的Secrets
show_secrets_guide() {
    echo -e "${BLUE}🔐 Required GitHub Secrets Configuration${NC}"
    echo "================================================"
    echo ""
    echo "Go to your GitHub repository:"
    echo "Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    echo -e "${YELLOW}📋 Production Environment Secrets:${NC}"
    echo ""
    
    cat << 'EOF'
# 🔐 Server Access
DEPLOY_HOST=your-production-server-ip
DEPLOY_USER=deploy
DEPLOY_SSH_KEY=your-ssh-private-key

# 🗄️ Database Configuration  
POSTGRES_PASSWORD=your-secure-postgres-password
REDIS_PASSWORD=your-secure-redis-password

# 🔑 Application Keys
JWT_SECRET=your-jwt-secret-minimum-32-characters  
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters

# 🤖 AI Service
DEEPSEEK_API_KEY=your-deepseek-api-key

# ☁️ Aliyun OSS
ALIYUN_OSS_ACCESS_KEY_ID=your-access-key-id
ALIYUN_OSS_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_OSS_BUCKET=your-bucket-name
ALIYUN_OSS_REGION=oss-cn-hangzhou

# 🌐 Domain
DOMAIN=your-production-domain.com

# 📱 Expo Configuration
EXPO_TOKEN=your-expo-auth-token
EXPO_USERNAME=your-expo-username
EOF

    echo ""
    echo -e "${YELLOW}🚧 Staging Environment Secrets (Optional):${NC}"
    echo ""
    
    cat << 'EOF'
STAGING_HOST=your-staging-server-ip
STAGING_USER=deploy
STAGING_SSH_KEY=your-staging-ssh-private-key
STAGING_POSTGRES_PASSWORD=your-staging-postgres-password
STAGING_REDIS_PASSWORD=your-staging-redis-password
STAGING_JWT_SECRET=your-staging-jwt-secret
STAGING_NEXTAUTH_SECRET=your-staging-nextauth-secret
STAGING_DOMAIN=staging.your-domain.com
EOF
}

# 生成示例密钥
generate_keys() {
    echo -e "${BLUE}🔑 Generating example secure keys${NC}"
    echo "================================================"
    echo ""
    
    echo "📋 Copy these generated keys to your GitHub Secrets:"
    echo ""
    
    # 生成JWT密钥
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET"
    
    # 生成NextAuth密钥
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    
    # 生成数据库密码
    POSTGRES_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
    
    # 生成Redis密码
    REDIS_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    echo "REDIS_PASSWORD=$REDIS_PASSWORD"
    
    echo ""
    echo -e "${YELLOW}💡 Save these keys securely!${NC}"
}

# 生成SSH密钥
generate_ssh_key() {
    echo -e "${BLUE}🔐 Generating SSH deployment key${NC}"
    echo "================================================"
    echo ""
    
    read -p "Enter your email for SSH key: " email
    
    if [ -z "$email" ]; then
        email="deploy@lyricnote.com"
    fi
    
    # 生成SSH密钥对
    ssh-keygen -t rsa -b 4096 -C "$email" -f ./deploy_key -N ""
    
    echo -e "${GREEN}✅ SSH key pair generated:${NC}"
    echo "Private key: ./deploy_key (add to GitHub Secrets as DEPLOY_SSH_KEY)"
    echo "Public key: ./deploy_key.pub (add to your server's ~/.ssh/authorized_keys)"
    echo ""
    
    echo -e "${YELLOW}📋 Private key content for GitHub Secret:${NC}"
    echo "----BEGIN PRIVATE KEY----"
    cat ./deploy_key
    echo "----END PRIVATE KEY----"
    echo ""
    
    echo -e "${YELLOW}📋 Public key content for server:${NC}"
    cat ./deploy_key.pub
    echo ""
    
    echo -e "${BLUE}🔧 Server setup commands:${NC}"
    echo "# On your server, run:"
    echo "mkdir -p ~/.ssh"
    echo "echo '$(cat ./deploy_key.pub)' >> ~/.ssh/authorized_keys"
    echo "chmod 600 ~/.ssh/authorized_keys"
    echo "chmod 700 ~/.ssh"
}

# 验证Expo设置
setup_expo() {
    echo -e "${BLUE}📱 Expo Setup Guide${NC}"
    echo "================================================"
    echo ""
    
    echo "1. Install Expo CLI globally:"
    echo "   npm install -g @expo/cli eas-cli"
    echo ""
    
    echo "2. Create Expo account (if you don't have one):"
    echo "   Visit: https://expo.dev/signup"
    echo ""
    
    echo "3. Login to Expo:"
    echo "   expo login"
    echo ""
    
    echo "4. Get your auth token:"
    echo "   expo whoami"
    echo "   # Your username will be displayed"
    echo ""
    
    echo "5. Generate auth token:"
    echo "   Visit: https://expo.dev/accounts/[username]/settings/access-tokens"
    echo "   Create a new token and copy it"
    echo ""
    
    echo "6. Configure mobile app:"
    echo "   Update packages/mobile/app.json:"
    echo '   "owner": "your-expo-username"'
    echo '   "projectId": "your-project-id"'
    echo ""
}

# 测试GitHub Actions
test_actions() {
    echo -e "${BLUE}🧪 Testing GitHub Actions${NC}"
    echo "================================================"
    echo ""
    
    # 检查工作流文件
    if [ -f ".github/workflows/test.yml" ]; then
        echo -e "${GREEN}✅ Test workflow configured${NC}"
    else
        echo -e "${RED}❌ Test workflow missing${NC}"
    fi
    
    if [ -f ".github/workflows/deploy.yml" ]; then
        echo -e "${GREEN}✅ Deploy workflow configured${NC}"
    else
        echo -e "${RED}❌ Deploy workflow missing${NC}"
    fi
    
    if [ -f ".github/workflows/mobile-build.yml" ]; then
        echo -e "${GREEN}✅ Mobile build workflow configured${NC}"
    else
        echo -e "${RED}❌ Mobile build workflow missing${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}💡 To test your setup:${NC}"
    echo "1. Push your code to GitHub"
    echo "2. Check Actions tab: https://github.com/your-username/LyricNote/actions"
    echo "3. Look for running workflows"
}

# 主菜单
main_menu() {
    echo -e "${BLUE}🎌 LyricNote GitHub Actions Setup${NC}"
    echo "=================================="
    echo ""
    echo "Choose an option:"
    echo "1. 📋 Show required Secrets guide"
    echo "2. 🔑 Generate secure keys"
    echo "3. 🔐 Generate SSH deployment key"
    echo "4. 📱 Expo setup guide"
    echo "5. 🧪 Test Actions configuration"
    echo "6. 🚀 Complete setup (all steps)"
    echo "7. ❌ Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            show_secrets_guide
            ;;
        2)
            generate_keys
            ;;
        3)
            generate_ssh_key
            ;;
        4)
            setup_expo
            ;;
        5)
            test_actions
            ;;
        6)
            echo -e "${BLUE}🚀 Running complete setup...${NC}"
            show_secrets_guide
            echo ""
            read -p "Press Enter to continue..."
            generate_keys
            echo ""
            read -p "Press Enter to continue..."
            generate_ssh_key
            echo ""
            read -p "Press Enter to continue..."
            setup_expo
            echo ""
            test_actions
            ;;
        7)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            main_menu
            ;;
    esac
    
    echo ""
    read -p "Press Enter to return to main menu..."
    main_menu
}

# 运行主程序
main() {
    check_git
    main_menu
}

# 执行主函数
main
