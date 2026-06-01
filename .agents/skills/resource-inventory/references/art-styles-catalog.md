# 美术风格参考目录

本目录供 resource-inventory skill 的美术风格访谈阶段使用。在生成即梦提示词前，向用户展示此目录中的风格选项，获取偏好后作为全局风格参数。

---

## 风格大类

### 1. 水墨国风

- **即梦提示词前缀**：中国水墨画风格，传统国画笔触，宣纸质感，
- **风格锚点三元组**：
  - 流派/运动：Classical Chinese Ink Painting（中国古典水墨画）
  - 媒介/技法：sumi-e ink on rice paper（宣纸水墨）
  - 参照系：in the style of Qi Baishi loose brushwork, Song Dynasty landscape scrolls
- **排除指令**：--no 3D render, photorealistic, harsh shadows, modern city, neon lights
- **关键词**：水墨、写意、留白、意境、传统、古韵
- **适用场景**：古村探索、历史文化、诗意叙事、中式解谜
- **注意**：人物面部细节偏弱，适合远景/氛围图；近景需补充「精细面部刻画」

### 2. 像素复古

- **即梦提示词前缀**：16位像素艺术风格，复古游戏画面，清晰像素边缘，
- **风格锚点三元组**：
  - 流派/运动：Pixel Art / 16-bit Era Gaming（像素艺术/16位游戏时代）
  - 媒介/技法：indexed color pixel grid, limited palette（索引色像素网格，有限调色板）
  - 参照系：in the style of SNES RPG tilesets, Hyper Light Drifter pixel art
- **排除指令**：--no smooth gradients, photorealistic, anti-aliased edges, 3D render
- **关键词**：像素、8-bit、16-bit、复古、怀旧、NES/SNES
- **适用场景**：独立游戏、怀旧风格、解谜冒险、轻量叙事
- **注意**：提示词需注明分辨率偏好（如 32x32、64x64），大场景需强调「多层级像素细节」

### 3. 手绘插画风

- **即梦提示词前缀**：温暖手绘插画风格，柔和铅笔线条，水彩晕染质感，
- **风格锚点三元组**：
  - 流派/运动：Contemporary Children's Book Illustration（当代绘本插画）
  - 媒介/技法：colored pencil and watercolor on textured paper（彩铅与水彩，肌理纸）
  - 参照系：in the style of Studio Ghibli background art, Tove Jansson illustration
- **排除指令**：--no photorealistic, 3D render, dark horror, harsh lighting, neon
- **关键词**：手绘、插画、温暖、童趣、绘本、水彩、铅笔
- **适用场景**：儿童向、轻松冒险、叙事驱动、温馨风格
- **注意**：色彩饱和度偏低，需要求 AI 补充色彩层次

### 4. 写实3D

- **即梦提示词前缀**：写实3D渲染风格，电影级光影，虚幻引擎5渲染质感，
- **风格锚点三元组**：
  - 流派/运动：Cinematic Realism / Photorealism（电影级写实主义）
  - 媒介/技法：PBR rendered, Unreal Engine 5 Lumen GI（PBR 渲染，UE5 全局光照）
  - 参照系：in the style of AAA game cinematic trailers, Quixel Megascans environments
- **排除指令**：--no cartoon, low poly, flat shading, pixel art, anime
- **关键词**：3D、写实、光影、材质、电影感、次世代
- **适用场景**：沉浸式探索、恐怖/悬疑、高品质画面、建筑场景
- **注意**：对 AI 生图平台要求较高，即梦可能在复杂场景中出现结构错误，建议分元素生成

### 5. 二次元 / 日系动漫

- **即梦提示词前缀**：日系动漫插画风格，赛璐璐上色，明亮色彩，
- **风格锚点三元组**：
  - 流派/运动：Japanese Anime / Cel-shading（日系动画/赛璐璐着色）
  - 媒介/技法：cel-shaded digital painting, flat color fills（赛璐落数字绘画，平涂上色）
  - 参照系：in the style of Makoto Shinkai color palette, Kyoto Animation lighting
- **排除指令**：--no photorealistic, 3D render, western cartoon, dark grim, pixel art
- **关键词**：二次元、动漫、日系、Q版、萌系、赛璐璐
- **适用场景**：角色立绘、对话场景、轻松冒险、社交游戏
- **注意**：场景类提示词需补充「背景细节丰富」，避免画面过于简单

### 6. 扁平化设计

- **即梦提示词前缀**：扁平化矢量插画风格，简洁色块，无阴影，现代设计感，
- **风格锚点三元组**：
  - 流派/运动：Flat Design / Swiss Style（扁平化/瑞士国际主义风格）
  - 媒介/技法：vector shapes, solid fills, no gradients（矢量图形，纯色填充，无渐变）
  - 参照系：in the style of Google Material Design icons, Malika Favre illustration
- **排除指令**：--no texture, noise, gradient, photorealistic, 3D, skeuomorphism
- **关键词**：扁平化、矢量、简洁、现代、UI风格、色块
- **适用场景**：UI元素、图标、地图、教学图解、信息图
- **注意**：适合图标和 UI，不适合作为场景主视觉风格

### 7. 赛博朋克 / 科幻

- **即梦提示词前缀**：赛博朋克科幻风格，霓虹灯光，暗色基调，科技感，
- **风格锚点三元组**：
  - 流派/运动：Cyberpunk / Retro-futurism（赛博朋克/复古未来主义）
  - 媒介/技法：neon glow on dark substrate, holographic overlay（暗色基底上的霓虹光晕，全息叠加）
  - 参照系：in the style of Blade Runner 2049 color grading, Ghost in the Shell UI design
- **排除指令**：--no bright daylight, pastoral, natural organic, pastel colors, medieval
- **关键词**：赛博朋克、霓虹、未来、科幻、暗色调、科技
- **适用场景**：未来都市、科幻叙事、电子世界
- **注意**：色彩对比强烈，需指定具体色调（偏蓝/偏紫/偏红）

### 8. 日式和风

- **即梦提示词前缀**：日式和风插画风格，浮世绘元素，雅致配色，
- **风格锚点三元组**：
  - 流派/运动：Ukiyo-e / Shin-hanga（浮世绘/新版画运动）
  - 媒介/技法：woodblock print, washi paper texture（木版画，和纸质感）
  - 参照系：in the style of Hokusai Great Wave composition, Kawase Hasui landscape prints
- **排除指令**：--no 3D render, photorealistic, western medieval, neon, modern city
- **关键词**：和风、浮世绘、日本、雅致、樱花、鸟居
- **适用场景**：日式场景、和风角色、日式庭院
- **注意**：与水墨国风有重叠，区别在于日式偏装饰性、国风偏意境

### 9. 极简线条

- **即梦提示词前缀**：极简线条插画风格，单色线稿，大量留白，
- **风格锚点三元组**：
  - 流派/运动：Minimalism / Zen Aesthetic（极简主义/禅意美学）
  - 媒介/技法：single-weight line drawing on white field（等宽线稿，白底）
  - 参照系：in the style of Picasso line drawings, Tao Ma minimalist ink illustration
- **排除指令**：--no color fill, shading, texture, 3D, gradient, photorealistic
- **关键词**：极简、线条、线稿、留白、禅意、素描
- **适用场景**：概念图、地图线稿、UI线框、文艺风格
- **注意**：需补充色彩要求，否则默认黑白

### 10. 拼贴 / 混合媒体

- **即梦提示词前缀**：拼贴艺术风格，混合媒体质感，纸张撕裂边缘，复古纹理叠加，
- **风格锚点三元组**：
  - 流派/运动：Dada Collage / Mixed Media Art（达达拼贴/混合媒体艺术）
  - 媒介/技法：cut paper, torn edges, layered textures, found materials（剪纸，撕裂边缘，层叠纹理，现成材料）
  - 参照系：in the style of Hannah Höch photomontage, Eric Carle tissue paper collage
- **排除指令**：--no clean vector, smooth edges, photorealistic, 3D render, digital painting
- **关键词**：拼贴、混合媒体、复古、纸张、纹理、手工艺
- **适用场景**：日记风格、回忆叙事、手账美学
- **注意**：生成结果随机性较大，建议多生成几个变体后挑选

### 11. 工笔画 / 新中式

- **即梦提示词前缀**：新中式工笔画风格，细腻线条勾勒，矿物色彩，金箔点缀，
- **风格锚点三元组**：
  - 流派/运动：Gongbi / Neo-Chinese Art（工笔画/新中式艺术）
  - 媒介/技法：fine brushwork on silk, mineral pigment, gold leaf details（绢本细笔，矿物颜料，金箔细节）
  - 参照系：in the style of Tang Dynasty court painting, contemporary Chinese neo-traditional art
- **排除指令**：--no loose brushwork, impressionist, 3D render, western oil painting, neon
- **关键词**：工笔画、新中式、精细、描金、矿物色、典雅
- **适用场景**：高品质国风、古建筑细节、器物展示、高品质角色立绘
- **注意**：适合近景和特写，远景可能过于繁复

### 12. 低多边形 (Low Poly)

- **即梦提示词前缀**：低多边形3D风格，几何面片构成，柔和光影，
- **风格锚点三元组**：
  - 流派/运动：Low Poly / Geometric Minimalism（低多边形/几何极简主义）
  - 媒介/技法：flat-shaded polygon mesh, limited color palette（平面着色多边形网格，有限调色板）
  - 参照系：in the style of Monument Valley game art, Timothy Reynolds isometric low poly
- **排除指令**：--no photorealistic, smooth shading, high-poly detail, organic texture, pixel art
- **关键词**：低多边形、Low Poly、几何、多边形、简约3D
- **适用场景**：地图场景、建筑、轻松冒险风格
- **注意**：角色表情有限，适合远景和道具

---

## 色调选项

| 选项 | 关键词 | 即梦提示词附加 |
|---|---|---|
| 暖色明亮 | 温暖、阳光、金色 | 暖色调，明亮光线，金色阳光 |
| 暖色暗沉 | 复古、黄昏、烛光 | 暖色调，昏暗光线，暖黄灯光 |
| 冷色明亮 | 清冷、清晨、月光 | 冷色调，明亮月光，清冷氛围 |
| 冷色暗沉 | 深夜、神秘、幽蓝 | 冷色调，暗夜氛围，深蓝紫色调 |
| 中性柔和 | 淡雅、素净、水墨灰 | 中性色调，柔和光线，淡雅配色 |
| 高饱和 | 鲜艳、浓烈、节日 | 高饱和度，浓烈色彩，鲜明对比 |
| 单色/双色 | 极简、水墨、线稿 | 单色/双色，极简配色，大面积留白 |

---

## 精细度选项

| 选项 | 即梦提示词附加 | 适用场景 |
|---|---|---|
| 极简 | 简洁概括，少量细节，大面积留白 | 概念图、图标、缩略图 |
| 中等 | 适度细节，平衡留白与内容 | 常规场景、角色半身像 |
| 精细 | 丰富细节，精细纹理，高清画质 | 角色立绘、场景全景、宣传图 |
| 超精细 | 极致细节，8K画质，微距级纹理，大师级作品 | 宣传海报、关键场景、BOSS战场景 |

---

## 提示词生成公式

每条提示词按以下结构生成：

```
[主体描述] + [风格锚点三元组] + [质感参数] + [排除指令]
```

展开为具体模板：

```
{主体描述}，{流派/运动}，{媒介/技法}，{参照系}，{色调附加}，{质感/精细度附加}，{排除指令}
```

**风格锚点三元组**是最关键的精度控制要素，缺一不可：

| 锚点类型 | 作用 | 示例 |
|---|---|---|
| **流派/运动** | 锁定时代与美学基因 | Art Nouveau, Ukiyo-e, De Stijl, Memphis Design |
| **媒介/技法** | 锁定物质质感 | woodblock print, stained glass, cel-shaded, sumi-e ink |
| **参照系** | 锁定具体坐标（艺术家/作品/品牌） | in the style of Moebius, Studio Ghibli background art, 1960s Polish poster |

**规则**：
- 主体描述用中文；三元组中的专业术语保留英文（即梦平台对英文艺术术语理解更精准）
- 50-120 字（不含排除指令）
- 同类资源保持三元组一致，只替换主体描述
- 复杂场景提供 2-3 个变体

---

## 即梦提示词示例

**示例 1**（水墨国风 + 冷色暗沉 + 精细）：

> 一位身着青衫的古代书生独自行走在月下的石板小巷中，两侧徽派建筑白墙黛瓦若隐若现，Classical Chinese Ink Painting，sumi-e ink on rice paper，in the style of Qi Baishi loose brushwork and Song Dynasty landscape scrolls，冷色调，暗夜氛围，深蓝紫色调，丰富细节，精细纹理，高清画质，大面积留白，意境深远 --no 3D render, photorealistic, harsh shadows, modern city, neon lights

**示例 2**（手绘插画风 + 暖色明亮 + 中等）：

> 一个扎着马尾的小女孩站在开满油菜花的田边微笑，远处是连绵的青山和飘着白云的蓝天，Contemporary Children's Book Illustration，colored pencil and watercolor on textured paper，in the style of Studio Ghibli background art and Tove Jansson illustration，暖色调，明亮光线，金色阳光，适度细节，平衡留白与内容，温馨治愈 --no photorealistic, 3D render, dark horror, harsh lighting, neon
