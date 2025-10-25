# 部署指南

## 快速排查问题

### 1. 检查容器状态

```bash
# SSH 连接到服务器后执行
docker ps | grep lyricnote-backend
```

### 2. 查看容器日志

```bash
docker logs lyricnote-backend
```

### 3. 检查端口监听

```bash
# 检查 3002 端口是否被监听
netstat -tlnp | grep 3002
# 或
ss -tlnp | grep 3002
```

### 4. 测试本地访问

```bash
# 在服务器上测试
curl http://localhost:3002
```

## 访问方式

### 直接访问（需要开放防火墙）

```bash
# 访问地址（注意是 http 不是 https）
http://qhr062.top:3002
```

### 通过 Nginx 反向代理（推荐）

不暴露 3002 端口，通过 Nginx 80/443 端口代理。

## 防火墙配置

### Ubuntu/Debian (UFW)

```bash
# 开放 3002 端口
sudo ufw allow 3002/tcp
sudo ufw reload
sudo ufw status
```

### CentOS/RHEL (Firewalld)

```bash
# 开放 3002 端口
sudo firewall-cmd --permanent --add-port=3002/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### 云服务器安全组

如果使用阿里云、腾讯云等，需要在控制台的**安全组**中添加规则：
- 端口范围: 3002
- 授权对象: 0.0.0.0/0
- 协议: TCP

## Nginx 反向代理配置（推荐）

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/lyricnote
```

### HTTP 配置

```nginx
server {
    listen 80;
    server_name qhr062.top;

    # API 代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 日志
    access_log /var/log/nginx/lyricnote_access.log;
    error_log /var/log/nginx/lyricnote_error.log;
}
```

### HTTPS 配置（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
# 或
sudo yum install certbot python3-certbot-nginx  # CentOS/RHEL

# 获取 SSL 证书
sudo certbot --nginx -d qhr062.top

# Certbot 会自动修改 Nginx 配置，添加 SSL
```

### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/lyricnote /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

配置完成后，访问：
- HTTP: `http://qhr062.top`
- HTTPS: `https://qhr062.top`

## 使用 docker-compose 部署（更推荐）

### 1. 在服务器上创建部署目录

```bash
mkdir -p ~/lyricnote-deploy
cd ~/lyricnote-deploy
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    image: crpi-pnnot5dqi45utyya.cn-beijing.personal.cr.aliyuncs.com/lyricnote/lyricnote:latest
    container_name: lyricnote-backend
    restart: unless-stopped
    ports:
      - "3002:3000"
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - lyricnote-network

networks:
  lyricnote-network:
    driver: bridge
```

### 3. 创建 .env.production

```bash
nano .env.production
```

填入你的环境变量（从 GitHub Secrets 或其他地方获取）。

### 4. 启动服务

```bash
# 拉取最新镜像
docker-compose pull

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

## 常见问题

### 1. 容器启动失败

```bash
# 查看详细日志
docker logs lyricnote-backend --tail 100

# 检查环境变量
docker exec lyricnote-backend env
```

### 2. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3002

# 停止占用的进程
kill -9 <PID>
```

### 3. 数据库连接失败

确保 `.env.production` 中的 `DATABASE_URL` 正确配置。

### 4. 内存不足

```bash
# 查看 Docker 容器资源使用
docker stats lyricnote-backend

# 如果需要，可以限制容器内存
docker run -d -p 3002:3000 --name lyricnote-backend \
  --memory="1g" \
  --restart unless-stopped \
  --env-file .env.production \
  <image>
```

## 更新部署

### 手动更新

```bash
# 拉取最新镜像
docker pull crpi-pnnot5dqi45utyya.cn-beijing.personal.cr.aliyuncs.com/lyricnote/lyricnote:latest

# 停止旧容器
docker stop lyricnote-backend
docker rm lyricnote-backend

# 启动新容器
docker run -d -p 3002:3000 --name lyricnote-backend \
  --restart unless-stopped \
  --env-file .env.production \
  crpi-pnnot5dqi45utyya.cn-beijing.personal.cr.aliyuncs.com/lyricnote/lyricnote:latest
```

### 使用 GitHub Actions 自动部署

推送到 `main` 分支时会自动触发部署流程。

## 监控和日志

### 实时日志

```bash
docker logs -f lyricnote-backend
```

### 查看最近日志

```bash
docker logs --tail 100 lyricnote-backend
```

### 导出日志

```bash
docker logs lyricnote-backend > lyricnote.log 2>&1
```

