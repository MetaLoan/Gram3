# Google Analytics 配置说明

## 如何配置 Google Analytics

1. **替换测量 ID**
   - 打开 `index.html` 文件
   - 找到 `G-XXXXXXXXXX` (共出现 2 次)
   - 替换为您的实际 Google Analytics 测量 ID (格式: `G-XXXXXXXXXX`)

2. **URL 参数跟踪**
   - 在页面 URL 末尾添加 `?start=渠道名称` 来跟踪不同投放渠道
   - 例如：
     - `https://yourdomain.com/index.html?start=facebook`
     - `https://yourdomain.com/index.html?start=instagram`
     - `https://yourdomain.com/index.html?start=google_ads`
     - `https://yourdomain.com/index.html?start=telegram`

3. **自动跟踪的事件**
   - `page_view` - 页面访问（包含渠道信息）
   - `cta_click` - CTA 按钮点击
   - `telegram_click` - Telegram 按钮点击

4. **Telegram 链接自动更新**
   - 当用户通过 `?start=xxx` 参数访问页面时
   - 所有 Telegram 链接会自动添加相应的 start 参数
   - 便于在 Telegram Bot 中识别用户来源

## 示例使用场景

### Facebook 广告
URL: `https://yourdomain.com/?start=fb_ad_001`

### Instagram 帖子
URL: `https://yourdomain.com/?start=ig_post_2024`

### Google 广告
URL: `https://yourdomain.com/?start=google_campaign_1`

## 在 Google Analytics 中查看数据

1. 登录 Google Analytics 控制台
2. 进入 "报告" > "参与度" > "事件"
3. 查看自定义事件：
   - `page_view` - 查看不同渠道的访问量
   - `cta_click` - 查看 CTA 按钮点击率
   - `telegram_click` - 查看 Telegram 按钮点击率
4. 点击事件查看参数 `channel` 了解流量来源分布

## 注意事项

- 确保您的网站已部署到 HTTPS 域名
- Google Analytics 通常需要 24-48 小时开始显示数据
- 测试时可以在 Google Analytics 的 "实时" 报告中查看即时数据
