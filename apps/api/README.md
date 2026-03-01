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