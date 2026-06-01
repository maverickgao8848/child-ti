# HTML in Canvas 创意改造模式库

这个文件包含详细的代码模板和创意模式，供 SKILL.md 调用。

---

## 当前技术全景

### 方法对比矩阵

| 方法 | 今天可用 | 保留交互 | 视觉效果上限 | 适合场景 |
|------|---------|---------|------------|---------|
| SVG foreignObject hack | ✅ 全部浏览器 | ❌ 快照 | 2D 滤镜、扭曲 | 视觉特效优先 |
| WICG `drawElementImage` | 🚧 Chrome Canary | ✅ 全保留 | 2D 无限制 | 未来标准 |
| `texElementImage2D` (WebGL) | 🚧 Chrome Canary | ✅ 有 raycasting | 3D 纹理/着色器 | 3D 场景 |
| `copyElementImageToTexture` (WebGPU) | 🚧 Chrome Canary | ✅ 有 raycasting | GPU 着色器极限 | 最前卫体验 |
| Three.js CSS3DRenderer | ✅ 全部浏览器 | ✅ 保留 | 3D 几何变换 | 3D 展示 |
| html2canvas + canvas filter | ✅ 全部浏览器 | ❌ 快照 | 2D 滤镜 | 截图类效果 |

---

## 模式 P1：粒子爆炸溃散

**视觉描述**：鼠标悬停时，卡片像被高压气流击碎，分解成数十个发光粒子向外飞散，离开时粒子重新汇聚回原形。

**技术路线**：SVG foreignObject → Canvas 快照 → 粒子系统

```javascript
class CardParticleEffect {
  constructor(element, canvas) {
    this.element = element;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.snapshot = null;
    this.isExploded = false;
  }

  // 捕获 HTML 元素快照
  async captureElement() {
    const rect = this.element.getBoundingClientRect();
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${this.element.outerHTML}
          </div>
        </foreignObject>
      </svg>`;

    return new Promise(resolve => {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        // 绘入离屏 canvas 以读取像素数据
        const offscreen = document.createElement('canvas');
        offscreen.width = rect.width;
        offscreen.height = rect.height;
        const octx = offscreen.getContext('2d');
        octx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        resolve({ img, offscreen, ctx: octx, rect });
      };
    });
  }

  async explode() {
    if (this.isExploded) return;
    this.isExploded = true;

    const { offscreen, ctx: octx, rect } = await this.captureElement();

    // 每 4×4 像素块变成一个粒子
    const pixelSize = 4;
    for (let y = 0; y < rect.height; y += pixelSize) {
      for (let x = 0; x < rect.width; x += pixelSize) {
        const pixel = octx.getImageData(x, y, 1, 1).data;
        if (pixel[3] < 10) continue; // 跳过透明像素

        this.particles.push({
          x: rect.left + x,
          y: rect.top + y,
          originX: rect.left + x,
          originY: rect.top + y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12 - 4,
          color: `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255})`,
          size: pixelSize,
          life: 1,
          decay: Math.random() * 0.02 + 0.01
        });
      }
    }

    // 隐藏原始元素
    this.element.style.opacity = '0';
    this.animate();
  }

  animate() {
    if (!this.isExploded) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let allDead = true;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // 重力
      p.life -= p.decay;
      p.vx *= 0.98;

      if (p.life > 0) {
        allDead = false;
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(p.x, p.y, p.size * p.life, p.size * p.life);
      }
    });

    this.ctx.globalAlpha = 1;
    if (!allDead) requestAnimationFrame(() => this.animate());
  }

  reassemble() {
    // 粒子归位动画
    this.particles.forEach(p => {
      p.life = 1;
      p.vx = (p.originX - p.x) * 0.1;
      p.vy = (p.originY - p.y) * 0.1;
    });
    this.isExploded = false;
    this.element.style.opacity = '1';
    this.particles = [];
  }
}
```

---

## 模式 P5：磁力吸附场

**视觉描述**：鼠标在页面上移动，附近的 UI 元素像受到引力影响，向鼠标方向弯折倾斜，营造出有质量的、真实物理感的界面空间。

**技术路线**：WICG API（未来）或 CSS transform + requestAnimationFrame（当下）

```javascript
class MagneticField {
  constructor(targetElements, canvas) {
    this.elements = [...targetElements];
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mouse = { x: 0, y: 0 };
    this.strength = 0.3; // 引力强度 0-1

    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.loop();
  }

  loop() {
    // 如果支持 WICG API，使用 drawElementImage
    if (this.canvas.onpaint !== undefined) {
      this.canvas.onpaint = () => this.renderWithWICG();
      this.canvas.requestPaint();
    } else {
      // 降级方案：直接用 CSS transform
      this.renderWithCSS();
      requestAnimationFrame(() => this.loop());
    }
  }

  renderWithCSS() {
    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = this.mouse.x - centerX;
      const dy = this.mouse.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200; // 影响半径

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * this.strength;
        const tiltX = (dy / maxDist) * force * 20; // 最大倾斜20度
        const tiltY = -(dx / maxDist) * force * 20;
        const translateX = dx * force * 0.2;
        const translateY = dy * force * 0.2;

        el.style.transform = `
          perspective(600px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          translate(${translateX}px, ${translateY}px)
        `;
        el.style.transition = 'transform 0.1s ease-out';
      } else {
        el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translate(0, 0)';
        el.style.transition = 'transform 0.4s ease-out';
      }
    });
  }

  // 使用 WICG API 在 canvas 中直接渲染带效果的 UI
  renderWithWICG() {
    const ctx = this.ctx;
    ctx.reset();

    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = this.mouse.x - centerX;
      const dy = this.mouse.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist);

        // canvas 变换产生 perspective warp 感
        ctx.save();
        ctx.translate(centerX + dx * force * 0.1, centerY + dy * force * 0.1);

        // 添加光晕效果
        ctx.shadowColor = 'rgba(239, 207, 166, 0.4)';
        ctx.shadowBlur = force * 20;

        // 绘制元素（WICG API）
        const transform = ctx.drawElementImage(el, -rect.width/2, -rect.height/2);
        el.style.transform = transform.toString();

        ctx.restore();
      } else {
        const transform = ctx.drawElementImage(el, rect.left, rect.top);
        el.style.transform = transform.toString();
      }
    });
  }
}
```

---

## 模式 P6：量子贴图（HTML 作为 3D 纹理）

**视觉描述**：整块 UI 界面被贴在一个在 3D 空间缓缓旋转/飘动的平面上，像是宇宙中漂浮的信号板。鼠标控制视角，产生真实的 3D 透视。

**技术路线**：Three.js + WICG `texElementImage2D` 或 Three.js `CSS3DRenderer`

```javascript
// 方案 A：CSS3DRenderer（今天就能用，保留完整 HTML 交互性）
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

class FloatingUIPlane {
  constructor(htmlElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 800;

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // 把 HTML 元素变成 3D 对象
    const object = new CSS3DObject(htmlElement);
    object.position.set(0, 0, 0);
    this.scene.add(object);

    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };

    document.addEventListener('mousemove', e => {
      this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 缓动跟随鼠标（惰性）
    this.targetRotation.y += (this.mouse.x * 0.3 - this.targetRotation.y) * 0.05;
    this.targetRotation.x += (-this.mouse.y * 0.2 - this.targetRotation.x) * 0.05;

    this.scene.rotation.y = this.targetRotation.y;
    this.scene.rotation.x = this.targetRotation.x;

    this.renderer.render(this.scene, this.camera);
  }
}

// 方案 B：WebGL 纹理（未来 WICG API，视觉效果更震撼）
function setupHTMLTexture(canvas, htmlElement) {
  const gl = canvas.getContext('webgl2');

  // 创建纹理
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 将 HTML 元素用作纹理（Chrome Canary + flag）
  canvas.onpaint = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, htmlElement);
    gl.generateMipmap(gl.TEXTURE_2D);

    // 现在纹理包含完整的 HTML 渲染（包括文字、CSS）
    // 可以在 glsl shader 中任意操作：扭曲、chromatic aberration、水波...
    renderScene(gl, texture);
  };

  canvas.requestPaint();
}
```

---

## 模式 P7：信号噪声/故障波纹

**视觉描述**：页面内容周期性地"失去信号"——文字和卡片产生电子故障感的抖动、色差分离、扫描线闪烁，然后恢复清晰。

**技术路线**：SVG foreignObject → Canvas 快照 → 故障着色器效果

```javascript
class GlitchEffect {
  constructor(element) {
    this.element = element;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed; top: 0; left: 0; pointer-events: none; z-index: 999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.isGlitching = false;
  }

  async trigger(duration = 800) {
    if (this.isGlitching) return;
    this.isGlitching = true;

    const snapshot = await this.captureSnapshot();
    const startTime = performance.now();

    const glitch = (now) => {
      const elapsed = now - startTime;
      if (elapsed > duration) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isGlitching = false;
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const rect = this.element.getBoundingClientRect();

      // 随机切片偏移（水平扫描线故障）
      const slices = Math.floor(Math.random() * 8) + 3;
      const sliceHeight = rect.height / slices;

      for (let i = 0; i < slices; i++) {
        const offset = Math.random() > 0.7 ? (Math.random() - 0.5) * 30 : 0;

        this.ctx.drawImage(
          snapshot,
          0, i * sliceHeight,            // 源区域：横向切片
          rect.width, sliceHeight,
          rect.left + offset, rect.top + i * sliceHeight, // 偏移绘制
          rect.width, sliceHeight
        );
      }

      // 色差分离（RGB 通道错位）
      if (Math.random() > 0.5) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 0.4;

        // 红色通道向左偏
        this.ctx.filter = 'url(#redChannel)'; // 需要 SVG filter
        this.ctx.drawImage(snapshot, rect.left - 3, rect.top);

        // 蓝色通道向右偏
        this.ctx.filter = 'url(#blueChannel)';
        this.ctx.drawImage(snapshot, rect.left + 3, rect.top);

        this.ctx.restore();
      }

      requestAnimationFrame(glitch);
    };

    requestAnimationFrame(glitch);
  }

  async captureSnapshot() {
    const rect = this.element.getBoundingClientRect();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${this.element.outerHTML}</div>
      </foreignObject>
    </svg>`;

    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
}
```

---

## 模式 P8：光场折射（玻璃透镜效果）

**视觉描述**：一个随鼠标移动的隐形"透镜"跟随光标，透镜区域内的 HTML 内容产生凸面玻璃折射放大效果，周边区域轻微模糊，如同冰封在玻璃球中。

```javascript
class LensEffect {
  constructor(canvas, sourceElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sourceElement = sourceElement;
    this.mouse = { x: 0, y: 0 };
    this.lensRadius = 120;
    this.magnification = 1.5;

    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  // 使用 WICG API（推荐）或 SVG foreignObject 快照
  async render() {
    const snapshot = await this.getSnapshot();

    const loop = () => {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 在透镜之外：轻微模糊
      ctx.filter = 'blur(0.5px)';
      ctx.drawImage(snapshot, 0, 0);

      // 在透镜之内：放大清晰
      ctx.save();
      ctx.filter = 'none';
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.lensRadius, 0, Math.PI * 2);
      ctx.clip();

      // 放大绘制（以鼠标为中心）
      const scale = this.magnification;
      const tx = this.mouse.x - this.mouse.x * scale;
      const ty = this.mouse.y - this.mouse.y * scale;
      ctx.translate(tx, ty);
      ctx.scale(scale, scale);
      ctx.filter = 'contrast(1.05) brightness(1.1)'; // 透镜中心稍亮
      ctx.drawImage(snapshot, 0, 0);

      // 透镜边缘高光
      ctx.restore();
      const gradient = ctx.createRadialGradient(
        this.mouse.x - this.lensRadius * 0.3, this.mouse.y - this.lensRadius * 0.3, 0,
        this.mouse.x, this.mouse.y, this.lensRadius
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.2)');

      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.lensRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      requestAnimationFrame(loop);
    };

    loop();
  }
}
```

---

## 模式 P9：扫描线解码

**视觉描述**：页面内容从上到下被一条发光的扫描线"读取"——扫描经过的区域从噪点/模糊逐渐变得清晰，像是传真机或科幻电影中的数据传输视觉。

```javascript
class ScanReveal {
  constructor(element, canvas) {
    this.element = element;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scanY = 0;
    this.speed = 3; // px per frame
  }

  async start() {
    const snapshot = await this.captureAsCanvas();
    const rect = this.element.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    const scan = () => {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 已扫描区域：清晰显示
      if (this.scanY > 0) {
        ctx.drawImage(snapshot, 0, 0, rect.width, this.scanY, 0, 0, rect.width, this.scanY);
      }

      // 未扫描区域：噪点模糊
      if (this.scanY < rect.height) {
        ctx.save();
        ctx.filter = 'blur(4px) contrast(0.5) brightness(0.6)';
        ctx.drawImage(snapshot, 0, this.scanY, rect.width, rect.height - this.scanY,
                      0, this.scanY, rect.width, rect.height - this.scanY);
        ctx.restore();

        // 噪点叠加
        this.addNoise(this.scanY, rect.height);
      }

      // 扫描线本体：发光线条
      const lineGrad = ctx.createLinearGradient(0, this.scanY - 2, 0, this.scanY + 4);
      lineGrad.addColorStop(0, 'rgba(239, 207, 166, 0)');
      lineGrad.addColorStop(0.5, 'rgba(239, 207, 166, 0.9)');
      lineGrad.addColorStop(1, 'rgba(239, 207, 166, 0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, this.scanY - 2, rect.width, 6);

      this.scanY += this.speed;
      if (this.scanY < rect.height) requestAnimationFrame(scan);
    };

    scan();
  }

  addNoise(startY, endY) {
    const imageData = this.ctx.getImageData(0, startY, this.canvas.width, endY - startY);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.95) {
        const noise = (Math.random() - 0.5) * 40;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
    }
    this.ctx.putImageData(imageData, 0, startY);
  }
}
```

---

## 52Hz 项目专属改造思路

这些方案专门为 52Hz 宇宙频率社区的视觉语言设计：

### Hero改造：星座图 → 活体星图
- constellation SVG 节点改用 Canvas 驱动
- 节点间连线产生"信号脉冲"动画（光子沿线条传播）
- 悬停节点时成员信息卡片用 `drawElementImage` 绘入 canvas，施加 glow 滤镜

### 卡片改造：Activity Cards → 信号板
- hover 时卡片在 canvas 中被施加 `hue-rotate` + 微量 `blur`
- 造成"频率失共振"的视觉感
- 松开时 canvas 效果消失，卡片重归清晰

### 背景改造：grain纹理 → 实时噪声场
- 用 Canvas 实时生成 Perlin noise
- noise 场影响文字的微量位移（0.5-2px 随机漂移）
- 营造出"宇宙背景辐射"的底层噪声感

### 导航改造：sticky header → 透明空间站
- header 背景用 canvas `backdrop` 效果
- 滚动时对 header 后方内容施加 glass distortion
- 导航链接 hover 时产生 scan line 效果

---

## 性能注意事项

```javascript
// ✅ 好：离屏渲染，避免频繁 DOM readback
const offscreen = new OffscreenCanvas(width, height);
const ctx = offscreen.getContext('2d');

// ❌ 坏：每帧都重新捕获 SVG 快照（非常慢）
canvas.addEventListener('mousemove', () => captureElementToCanvas()); // 别这样

// ✅ 好：用 requestPaint（WICG API）而不是 requestAnimationFrame
canvas.requestPaint(); // 绑定到浏览器渲染循环，不会过度渲染

// ✅ 好：用 will-change 预告 GPU
element.style.willChange = 'transform';

// ✅ 好：debounce 快照捕获
const debouncedCapture = debounce(captureSnapshot, 100);
window.addEventListener('resize', debouncedCapture);
```

---

## 参考来源

- [WICG HTML in Canvas 提案](https://github.com/WICG/html-in-canvas)
- [WICG 规范文档](https://wicg.github.io/html-in-canvas/)
- [Chrome Flag: `#canvas-draw-element`](chrome://flags/#canvas-draw-element)
- [Three.js CSS3DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS3DRenderer)
- [WICG 实例演示](https://wicg.github.io/html-in-canvas/Examples/webGL.html)
