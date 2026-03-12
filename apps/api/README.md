To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## redis

```sh
# install redis
# arch linux
yay -S redis
# start redis
redis-server
# stop redis
redis-cli shutdown
# 开机自启
systemctl enable redis.service
# 启动
systemctl start redis.service
# 停止
systemctl stop redis.service
```

## deploy

### nginx

```sh
ls /etc/nginx
ls /etc/nginx/sites-enabled/
sudo nano /etc/nginx/sites-enabled/default
```
```sh
# 前端 - 主域名
server {
    listen 80;
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        # ... 其他 proxy_set_header 同上
    }
}

# API - 子域名
server {
    listen 80;
    listen 443 ssl;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:4000/;
        # ... 其他 proxy_set_header 同上
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        # ... WebSocket 配置
    }
}
```

### cors

```sh
curl "https://api.xn--2qqt0eizbxcx84dyq3c.cn/socket.io/?EIO=4&transport=polling"
```

### docker

```sh
# 启动服务
sudo systemctl start docker

# 设置开机自启
sudo systemctl enable docker

docker ps

```

### redis

```sh
# 安装 redis
sudo apt-get install redis-server

# 启动 redis
sudo systemctl start redis-server
# 测试 redis
redis-cli ping # 显示: PONG

# 开机自启
sudo systemctl enable redis-server


# or 使用 docker 运行 redis
docker run -d -p 6379:6379 redis

# 解释: 
sudo docker run -d --name redisinsight -p 8001:8001 redis/redisinsight:latest

# 说明: 
-d: 后台运行
--name: 容器名
-p: 端口映射
redis/redisinsight:latest: 镜像名
```