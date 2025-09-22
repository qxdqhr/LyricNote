#!/bin/bash

# 🎌 LyricNote 生产环境部署脚本
set -e

echo "🎌 LyricNote Production Deployment Starting..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
}

# 检查环境变量
check_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️ .env file not found. Creating from template...${NC}"
        cp env.production.example .env
        echo -e "${YELLOW}📝 Please edit .env file with your actual configuration${NC}"
        echo -e "${YELLOW}📋 Required configuration:${NC}"
        echo "  - POSTGRES_PASSWORD"
        echo "  - REDIS_PASSWORD"
        echo "  - JWT_SECRET"
        echo "  - NEXTAUTH_SECRET"
        echo "  - DEEPSEEK_API_KEY"
        echo "  - ALIYUN_OSS credentials"
        echo "  - DOMAIN"
        read -p "Press Enter after configuring .env file..."
    fi
    
    echo -e "${GREEN}✅ Environment configuration checked${NC}"
}

# 检查SSL证书
check_ssl() {
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        echo -e "${YELLOW}⚠️ SSL certificates not found${NC}"
        echo -e "${BLUE}📋 SSL Certificate Options:${NC}"
        echo "  1. Use self-signed certificate (for testing)"
        echo "  2. Use Let's Encrypt certificate"
        echo "  3. Use custom certificate"
        
        read -p "Choose option (1-3): " ssl_option
        
        case $ssl_option in
            1)
                echo -e "${YELLOW}🔐 Generating self-signed certificate...${NC}"
                openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                    -keyout nginx/ssl/key.pem \
                    -out nginx/ssl/cert.pem \
                    -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
                ;;
            2)
                echo -e "${BLUE}📖 Let's Encrypt setup:${NC}"
                echo "  1. Install certbot: apt-get install certbot"
                echo "  2. Get certificate: certbot certonly --standalone -d your-domain.com"
                echo "  3. Copy cert: cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem"
                echo "  4. Copy key: cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem"
                exit 1
                ;;
            3)
                echo -e "${BLUE}📂 Please place your SSL certificate files:${NC}"
                echo "  - Certificate: nginx/ssl/cert.pem"
                echo "  - Private key: nginx/ssl/key.pem"
                exit 1
                ;;
        esac
    fi
    
    echo -e "${GREEN}✅ SSL certificates configured${NC}"
}

# 构建应用
build_app() {
    echo -e "${BLUE}🔨 Building application...${NC}"
    
    # 构建共享包
    echo "📦 Building shared package..."
    npm run build:shared
    
    # 构建Docker镜像
    echo "🐳 Building Docker images..."
    docker-compose build
    
    echo -e "${GREEN}✅ Application built successfully${NC}"
}

# 数据库初始化
init_database() {
    echo -e "${BLUE}🗄️ Initializing database...${NC}"
    
    # 启动数据库
    docker-compose up -d postgres redis
    
    # 等待数据库启动
    echo "⏳ Waiting for database to start..."
    sleep 10
    
    # 运行数据库迁移
    echo "🔄 Running database migrations..."
    docker-compose exec -T backend npx prisma db push
    docker-compose exec -T backend npx prisma db seed
    
    echo -e "${GREEN}✅ Database initialized${NC}"
}

# 启动服务
start_services() {
    echo -e "${BLUE}🚀 Starting services...${NC}"
    
    # 启动所有服务
    docker-compose up -d
    
    # 检查服务状态
    echo "⏳ Checking service health..."
    sleep 15
    
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose ps
    
    echo -e "${GREEN}✅ All services started${NC}"
}

# 健康检查
health_check() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # 检查后端API
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${GREEN}✅ Backend API is healthy${NC}"
    else
        echo -e "${RED}❌ Backend API health check failed${NC}"
        docker-compose logs backend
        exit 1
    fi
    
    # 检查数据库连接
    if docker-compose exec -T postgres pg_isready -U lyricnote > /dev/null; then
        echo -e "${GREEN}✅ Database is healthy${NC}"
    else
        echo -e "${RED}❌ Database health check failed${NC}"
        exit 1
    fi
    
    # 检查Redis连接
    if docker-compose exec -T redis redis-cli ping > /dev/null; then
        echo -e "${GREEN}✅ Redis is healthy${NC}"
    else
        echo -e "${RED}❌ Redis health check failed${NC}"
        exit 1
    fi
}

# 显示部署信息
show_deployment_info() {
    echo -e "${GREEN}"
    echo "🎉 LyricNote Deployment Completed Successfully!"
    echo "=============================================="
    echo -e "${NC}"
    echo -e "${BLUE}📱 Access Information:${NC}"
    echo "  🌐 API Endpoint: https://your-domain.com/api"
    echo "  🔧 Admin Panel: https://your-domain.com/admin"
    echo "  📊 Health Check: https://your-domain.com/api/health"
    echo ""
    echo -e "${BLUE}🔑 Default Admin Credentials:${NC}"
    echo "  📧 Email: admin@lyricnote.com"
    echo "  🔒 Password: admin123456"
    echo "  ⚠️ Please change the default password immediately!"
    echo ""
    echo -e "${BLUE}📋 Management Commands:${NC}"
    echo "  🔄 Restart: docker-compose restart"
    echo "  📊 Status: docker-compose ps"
    echo "  📜 Logs: docker-compose logs -f [service]"
    echo "  ⏹️ Stop: docker-compose down"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo "  1. Configure your domain DNS to point to this server"
    echo "  2. Update nginx/nginx.conf with your actual domain"
    echo "  3. Set up SSL certificates for production"
    echo "  4. Configure backup for database and uploads"
    echo "  5. Set up monitoring and alerting"
}

# 主函数
main() {
    echo -e "${BLUE}🎌 Starting LyricNote Production Deployment${NC}"
    echo "=============================================="
    
    check_docker
    check_env
    check_ssl
    build_app
    init_database
    start_services
    health_check
    show_deployment_info
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# 参数处理
case "${1:-}" in
    "build")
        build_app
        ;;
    "start")
        start_services
        ;;
    "stop")
        docker-compose down
        ;;
    "restart")
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "health")
        health_check
        ;;
    *)
        main
        ;;
esac
