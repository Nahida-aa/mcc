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