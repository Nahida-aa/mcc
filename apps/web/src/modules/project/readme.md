## 创建(上传\发布) a 版本
> 当前 创建==上传~==发布 , 因为存在审核

```js
onSubmit = () => {
  get预签名() // client -> server
  上传文件() // client -> oss server
  创建版本() // client -> server
}

get预签名 = () => {
  插入文件表()
  return 预签名
}
```
