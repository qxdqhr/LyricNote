#!/bin/bash

# 端口占用检查脚本
# 用于查看系统端口占用情况，特别是 LyricNote 项目相关端口

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目相关的默认端口
DEFAULT_PORTS=(
    "3000:Next.js开发服务器"
    "3001:Next.js开发服务器(备用)"
    "3004:Next.js开发服务器(当前)"
    "5432:PostgreSQL数据库"
    "5433:PostgreSQL数据库(生产)"
    "6379:Redis缓存"
    "8080:HTTP服务"
    "8081:HTTP服务(备用)"
    "19000:Expo开发服务器"
    "19001:Expo开发服务器(备用)"
    "19002:Expo Metro Bundler"
)

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

header() {
    echo -e "${BLUE}$1${NC}"
}

show_help() {
    echo -e "${CYAN}🔍 端口占用检查工具${NC}"
    echo "=================================================="
    echo ""
    echo "用法: $0 [选项] [端口号...]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -a, --all      显示所有监听端口"
    echo "  -p, --project  显示项目相关端口"
    echo "  -k, --kill     交互式终止进程"
    echo "  -l, --listen   只显示监听状态的端口"
    echo "  -t, --tcp      只显示TCP端口"
    echo "  -u, --udp      只显示UDP端口"
    echo ""
    echo "示例:"
    echo "  $0                    # 检查项目默认端口"
    echo "  $0 3000 5432         # 检查指定端口"
    echo "  $0 -a                # 显示所有端口"
    echo "  $0 -k 3000           # 终止占用3000端口的进程"
    echo "  $0 -l                # 只显示监听端口"
    echo ""
}

# 检查单个端口
check_single_port() {
    local port=$1
    local description=$2
    
    # 检查TCP端口
    local tcp_result=$(lsof -i :$port -P -n 2>/dev/null | grep LISTEN || true)
    # 检查UDP端口  
    local udp_result=$(lsof -i UDP:$port -P -n 2>/dev/null || true)
    
    if [[ -n "$tcp_result" || -n "$udp_result" ]]; then
        echo -e "${RED}● 端口 $port${NC} ${description:+($description)} ${RED}被占用${NC}"
        
        if [[ -n "$tcp_result" ]]; then
            echo -e "  ${PURPLE}TCP:${NC}"
            echo "$tcp_result" | while read line; do
                if [[ "$line" == *"LISTEN"* ]]; then
                    local pid=$(echo "$line" | awk '{print $2}')
                    local process=$(echo "$line" | awk '{print $1}')
                    local address=$(echo "$line" | awk '{print $9}')
                    echo -e "    PID: ${YELLOW}$pid${NC} | 进程: ${CYAN}$process${NC} | 地址: $address"
                fi
            done
        fi
        
        if [[ -n "$udp_result" ]]; then
            echo -e "  ${PURPLE}UDP:${NC}"
            echo "$udp_result" | while read line; do
                local pid=$(echo "$line" | awk '{print $2}')
                local process=$(echo "$line" | awk '{print $1}')
                local address=$(echo "$line" | awk '{print $9}')
                echo -e "    PID: ${YELLOW}$pid${NC} | 进程: ${CYAN}$process${NC} | 地址: $address"
            done
        fi
        echo ""
        return 1
    else
        echo -e "${GREEN}● 端口 $port${NC} ${description:+($description)} ${GREEN}空闲${NC}"
        return 0
    fi
}

# 显示所有监听端口
show_all_ports() {
    header "📋 所有监听端口:"
    echo "=================================================="
    
    # 获取所有监听端口
    local ports=$(netstat -tulnp 2>/dev/null | grep LISTEN | awk '{print $4}' | sed 's/.*://' | sort -n | uniq)
    
    if [[ -z "$ports" ]]; then
        warn "未发现任何监听端口"
        return
    fi
    
    echo -e "${CYAN}端口${NC}    ${CYAN}协议${NC}  ${CYAN}PID${NC}     ${CYAN}进程${NC}                ${CYAN}地址${NC}"
    echo "----------------------------------------------------------------------"
    
    for port in $ports; do
        # TCP端口
        local tcp_info=$(lsof -i TCP:$port -P -n 2>/dev/null | grep LISTEN | head -1)
        if [[ -n "$tcp_info" ]]; then
            local pid=$(echo "$tcp_info" | awk '{print $2}')
            local process=$(echo "$tcp_info" | awk '{print $1}')
            local address=$(echo "$tcp_info" | awk '{print $9}')
            printf "%-8s %-6s %-8s %-20s %s\n" "$port" "TCP" "$pid" "$process" "$address"
        fi
        
        # UDP端口
        local udp_info=$(lsof -i UDP:$port -P -n 2>/dev/null | head -1)
        if [[ -n "$udp_info" ]]; then
            local pid=$(echo "$udp_info" | awk '{print $2}')
            local process=$(echo "$udp_info" | awk '{print $1}')
            local address=$(echo "$udp_info" | awk '{print $9}')
            printf "%-8s %-6s %-8s %-20s %s\n" "$port" "UDP" "$pid" "$process" "$address"
        fi
    done
}

# 显示项目相关端口
show_project_ports() {
    header "🎯 LyricNote 项目相关端口:"
    echo "=================================================="
    
    local occupied_count=0
    local total_count=${#DEFAULT_PORTS[@]}
    
    for port_info in "${DEFAULT_PORTS[@]}"; do
        IFS=':' read -r port description <<< "$port_info"
        if ! check_single_port "$port" "$description"; then
            ((occupied_count++))
        fi
    done
    
    echo ""
    if [[ $occupied_count -eq 0 ]]; then
        info "✅ 所有项目端口都空闲"
    else
        warn "⚠️  有 $occupied_count/$total_count 个端口被占用"
    fi
}

# 终止进程
kill_process() {
    local port=$1
    
    if [[ -z "$port" ]]; then
        error "请指定要终止的端口号"
        return 1
    fi
    
    # 获取占用端口的进程
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    
    if [[ -z "$pids" ]]; then
        info "端口 $port 未被占用"
        return 0
    fi
    
    echo -e "${YELLOW}端口 $port 被以下进程占用:${NC}"
    for pid in $pids; do
        local process_info=$(ps -p $pid -o pid,ppid,cmd --no-headers 2>/dev/null || echo "$pid ? 进程已退出")
        echo "  PID: $pid - $process_info"
    done
    
    echo ""
    read -p "确认要终止这些进程吗? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for pid in $pids; do
            if kill -TERM $pid 2>/dev/null; then
                info "已发送终止信号给进程 $pid"
                sleep 1
                
                # 检查进程是否还在运行
                if kill -0 $pid 2>/dev/null; then
                    warn "进程 $pid 仍在运行，尝试强制终止..."
                    if kill -KILL $pid 2>/dev/null; then
                        info "已强制终止进程 $pid"
                    else
                        error "无法终止进程 $pid"
                    fi
                else
                    info "进程 $pid 已正常退出"
                fi
            else
                error "无法终止进程 $pid (权限不足?)"
            fi
        done
        
        # 再次检查端口状态
        sleep 1
        echo ""
        check_single_port "$port" ""
    else
        info "操作已取消"
    fi
}

# 显示监听端口统计
show_port_stats() {
    header "📊 端口占用统计:"
    echo "=================================================="
    
    local tcp_count=$(netstat -tln 2>/dev/null | grep LISTEN | wc -l)
    local udp_count=$(netstat -uln 2>/dev/null | wc -l)
    local total_processes=$(lsof -i -P -n 2>/dev/null | wc -l)
    
    echo -e "TCP监听端口: ${GREEN}$tcp_count${NC}"
    echo -e "UDP端口: ${GREEN}$udp_count${NC}"
    echo -e "网络进程总数: ${GREEN}$total_processes${NC}"
    
    # 显示最常用的端口
    echo ""
    echo -e "${CYAN}最常用的端口:${NC}"
    netstat -tuln 2>/dev/null | grep LISTEN | awk '{print $4}' | sed 's/.*://' | sort -n | uniq -c | sort -nr | head -5 | while read count port; do
        echo "  端口 $port: $count 个连接"
    done
}

# 主函数
main() {
    # 检查必要的命令
    for cmd in lsof netstat ps; do
        if ! command -v $cmd >/dev/null 2>&1; then
            error "缺少必要的命令: $cmd"
            exit 1
        fi
    done
    
    # 解析参数
    local show_all=false
    local show_project=false
    local kill_mode=false
    local listen_only=false
    local tcp_only=false
    local udp_only=false
    local custom_ports=()
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -a|--all)
                show_all=true
                shift
                ;;
            -p|--project)
                show_project=true
                shift
                ;;
            -k|--kill)
                kill_mode=true
                shift
                ;;
            -l|--listen)
                listen_only=true
                shift
                ;;
            -t|--tcp)
                tcp_only=true
                shift
                ;;
            -u|--udp)
                udp_only=true
                shift
                ;;
            -*)
                error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                # 数字参数作为端口号
                if [[ "$1" =~ ^[0-9]+$ ]]; then
                    custom_ports+=("$1")
                else
                    error "无效的端口号: $1"
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # 显示标题
    echo -e "${CYAN}"
    echo "🔍 端口占用检查工具"
    echo "===================="
    echo -e "${NC}"
    
    # 执行相应操作
    if [[ "$kill_mode" == true ]]; then
        if [[ ${#custom_ports[@]} -eq 0 ]]; then
            error "终止模式需要指定端口号"
            exit 1
        fi
        for port in "${custom_ports[@]}"; do
            kill_process "$port"
        done
    elif [[ "$show_all" == true ]]; then
        show_all_ports
        echo ""
        show_port_stats
    elif [[ "$show_project" == true ]]; then
        show_project_ports
    elif [[ ${#custom_ports[@]} -gt 0 ]]; then
        header "🔍 检查指定端口:"
        echo "=================================================="
        for port in "${custom_ports[@]}"; do
            check_single_port "$port" ""
        done
    else
        # 默认显示项目相关端口
        show_project_ports
    fi
}

# 运行主函数
main "$@"
