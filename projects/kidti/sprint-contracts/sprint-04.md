# Sprint #4 — 分享海报生成 + OG 卡片（UI Layer）

## Sprint #4

**goal:** 实现结果页的分享功能，包括 HTML5 Canvas 海报生成、kjua 二维码集成、OG meta 标签、海报下载/分享触发。

**impl:**
1. 引入 kjua 二维码库（CDN 或本地 `kjua.min.js`，~8KB gzip）。
2. **结果页「分享给朋友」按钮**：点击后触发 Canvas 海报绘制流程。
3. **Canvas 海报绘制**（750×1334 px，适配手机截图分享）：
   - 顶部：品牌名「儿童TI」
   - 中间：当前人格配图（缩小版，居中）
   - 人格代号（大字号）+ 中文名
   - 一句话定义
   - Slogan（引用样式）
   - *注：海报篇幅有限，不展示完整人格解读 `reading`，仅保留最精炼的 Slogan 作为记忆点。*
   - 底部：当前结果页 URL 的二维码 + 「扫码测测你是什么儿童」
4. **海报展示与下载**：绘制完成后以浮层/弹窗形式展示海报预览，提供「保存图片」按钮触发 `canvas.toBlob()` + 下载。
5. **kjua 回退**：若 kjua 加载失败，隐藏二维码区域，仅保留「复制链接」按钮作为回退方案。
6. **OG meta 标签**：在 `<head>` 中完善 Open Graph 标签（title、description、image、width、height），适配微信/社交平台分享卡片。
7. **「重新测试」功能**：结果页点击后清空 `state`（`currentQuestion=0`、`answers=[]`、`scores` 归零、`personaCode=null`），URL 恢复根路径，显示首页。
8. 微信分享适配：结果页提供「复制链接」按钮，将当前带 `?code=` 的 URL 写入剪贴板。

**criteria:**
1. 点击「分享给朋友」后，Canvas 海报在 2 秒内绘制完成并以浮层展示。
2. 海报包含以下全部元素：品牌名、人格配图、代号、中文名、定义、Slogan、二维码、「扫码测测你是什么儿童」文案。
3. 海报尺寸为 750×1334 px（通过 Playwright 截图或手动验证）。
4. 二维码扫描后跳转的 URL 与当前结果页 `?code=` URL 完全一致。
5. kjua 加载失败时，二维码区域自动隐藏，页面不报错，「复制链接」按钮仍可正常使用。
6. OG meta 标签在 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 或微信分享时正确抓取：标题「儿童TI — 你是什么儿童？」、描述「24道题测出你的童年人格。纯属娱乐，不构成育儿建议。」、封面图 `assets/og-share-square.png`。
7. 「保存图片」按钮触发后，浏览器下载 `.png` 格式海报文件。
8. 「重新测试」点击后，所有答题记录、分数、人格结果清空，页面回到首页，URL 无参数。
9. 通过 Playwright 或手动测试验证上述 1-8 条。

**layer:** ui

**blocked_by:** Sprint #3
