# 微信热搜榜定时推送工具

这是一个基于 Node.js 的微信热搜榜定时推送工具，使用天行API获取热搜数据，通过WxPusher推送到微信。

## 功能特点

- 🕒 定时推送：每天指定时间自动推送热搜榜
- 📱 微信接收：通过WxPusher直接推送到微信
- 🎯 可配置：支持自定义推送时间和热搜数量
- 🚀 简单易用：一键启动，自动运行

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，填入你的配置信息：

```env
# WxPusher配置
WXPUSHER_APP_TOKEN=你的WxPusher应用Token
WXPUSHER_UID=你的WxPusher用户UID

# 天行API配置
TIANAPI_KEY=你的天行API密钥
TIANAPI_URL=https://apis.tianapi.com/wxhottopic/index

# 推送配置
PUSH_HOUR=9          # 推送时间（小时）
PUSH_MINUTE=0        # 推送时间（分钟）
HOT_LIST_COUNT=10    # 推送热搜数量
```

### 3. 测试推送

```bash
npm run test
```

### 4. 启动定时服务

```bash
npm start
```

## 配置说明

### WxPusher配置

1. 访问 [WxPusher官网](https://wxpusher.zjiecode.com/)
2. 微信扫码登录
3. 创建应用获取 `APP_TOKEN`
4. 关注应用获取 `UID`

### 天行API配置

1. 访问 [天行API](https://www.tianapi.com/)
2. 注册账号并实名认证
3. 获取微信热搜榜接口的API密钥

## 使用方法

### 测试模式
```bash
node index.js --test
```

### 正常运行
```bash
node index.js
```

### 使用PM2管理（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start index.js --name "wechat-hotlist"

# 查看状态
pm2 status

# 查看日志
pm2 logs wechat-hotlist

# 停止服务
pm2 stop wechat-hotlist
```

## 项目结构

```
├── index.js          # 主程序文件
├── package.json      # 项目配置
├── .env             # 环境变量配置
├── README.md        # 使用说明
└── logs/            # 日志文件（自动生成）
```

## 注意事项

1. 确保网络连接正常，能够访问天行API和WxPusher服务
2. 天行API有调用次数限制，请合理设置推送频率
3. 保护好你的API密钥和Token，不要泄露给他人
4. 建议使用PM2等进程管理工具来保证服务稳定运行

## 故障排除

### 常见问题

1. **推送失败**
   - 检查网络连接
   - 验证API密钥和Token是否正确
   - 查看控制台错误信息

2. **获取数据失败**
   - 检查天行API密钥是否有效
   - 确认API调用次数是否超限
   - 验证API接口地址是否正确

3. **定时任务不执行**
   - 检查时区设置
   - 确认cron表达式格式正确
   - 查看系统时间是否准确

## 技术支持

如有问题，请检查：
1. 控制台输出的错误信息
2. 网络连接状态
3. API配置是否正确

## 许可证

MIT License