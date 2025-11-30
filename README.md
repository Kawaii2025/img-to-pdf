# 图片转PDF工具 - 完整文档

**一个基于组件架构的在线图片转PDF工具，支持图片上传、预览、编辑、排序和批量转换为PDF文件。**

---

## 🚀 快速开始

### 1. 创建目录结构
```bash
mkdir -p project/css project/js/components
cd project
```

### 2. 创建文件
复制以下文件到对应位置：
- `index.html` → 项目根目录
- `styles.css` → `css/` 文件夹
- 所有组件JS文件 → `js/components/` 文件夹
- `app.js` → `js/` 文件夹

### 3. 运行应用
直接在浏览器中打开 `index.html`：
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

或使用本地服务器（推荐）：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

然后访问：`http://localhost:8000`

---

## 📁 项目结构

```
project/
├── index.html                      # 主HTML文件
├── css/
│   └── styles.css                  # 所有样式
├── js/
│   ├── components/                 # 组件模块
│   │   ├── UploadArea.js           # 上传区域组件
│   │   ├── PreviewItem.js          # 单个预览项
│   │   ├── PreviewContainer.js     # 预览网格容器
│   │   ├── ProgressBar.js          # 进度条组件
│   │   ├── PreviewModal.js         # 全屏预览模态框
│   │   ├── ControlPanel.js         # 控制按钮组件
│   │   └── LoadingIndicator.js     # 加载指示器
│   └── app.js                      # 主应用程序
└── README.md                       # 本文件
```

---

## 🎯 主要功能

### 📤 文件上传
- ✅ 点击上传 - 点击区域打开文件选择器
- ✅ 拖拽上传 - 支持将文件拖拽到区域
- ✅ 支持格式 - JPG、PNG、WEBP
- ✅ 自动压缩 - 最大1MB，最大1920px尺寸
- ✅ 进度显示 - 实时显示上传处理进度

### 🖼️ 图片管理
- ✅ 网格布局 - 自适应多列展示所有图片
- ✅ 序号显示 - 显示图片在队列中的位置
- ✅ 快速删除 - 单击删除不需要的图片
- ✅ 拖拽排序 - 拖拽调整图片顺序
- ✅ 清空所有 - 一键清除全部图片
- ✅ 自动索引 - 删除后自动更新序号

### 👁️ 全屏图片预览
- ✅ 点击放大 - 点击缩略图打开全屏预览
- ✅ **放大缩小** - 0.5x ~ 3x 倍数缩放
  - 鼠标滚轮放大/缩小
  - 按钮控制：+、−、⟲
  - 键盘快捷键：`+` 放大，`-` 缩小，`0` 重置
  - 双击图片快速重置
- ✅ **拖拽移动** - 放大后可拖拽查看不同部分
- ✅ **左右导航** - 浏览所有上传的图片
  - 左右箭头按钮
  - 键盘方向键：`←` `→`
  - 自动禁用按钮（首/末张）
- ✅ **文件信息** - 显示图片名称、大小、位置
- ✅ **触摸支持** - 移动设备两指捏合缩放
- ✅ **快速关闭** - Esc键或点击背景关闭

### 📄 PDF转换
- ✅ 批量转换 - 一次性转换所有图片
- ✅ 格式支持 - JPG、PNG、WEBP自动转换
- ✅ 尺寸保留 - 保持原始图片尺寸
- ✅ 进度显示 - 显示PDF生成进度
- ✅ 自动下载 - 生成后自动下载文件

---

## 🔧 核心组件详解

### 1. **UploadArea.js** - 文件上传区域

**功能：**
- 点击上传 - 点击区域打开文件选择器
- 拖拽上传 - 支持将文件拖拽到区域
- 视觉反馈 - 悬停和拖拽时的样式变化
- 状态管理 - 处理过程中禁用上传

**关键方法：**
```javascript
onClick()                // 处理点击事件
setupDragAndDrop()      // 配置拖拽功能
highlight()             // 显示拖拽反馈
unhighlight()           // 移除拖拽反馈
setProcessing(state)    // 管理禁用状态
```

---

### 2. **PreviewItem.js** - 单个预览项

**功能：**
- 缩略图显示 - 渲染压缩后的图片预览
- 序号显示 - 左上角显示图片位置
- 删除按钮 - 右上角的删除按钮
- 拖拽支持 - 用于重新排序
- 大图预览 - 点击图片打开全屏预览

**关键方法：**
```javascript
render()                // 渲染预览项
readFile()             // 读取文件数据
attachEvents()         // 绑定交互事件
setProcessing(state)   // 管理禁用状态
```

---

### 3. **PreviewContainer.js** - 预览容器

**功能：**
- 网格布局 - 自适应多列网格展示
- 拖拽排序 - 支持拖拽图片改变顺序
- 批量管理 - 管理所有预览项
- 动态刷新 - 删除后自动更新索引

**关键方法：**
```javascript
addItem(file, index, callbacks)        // 添加新的预览项
refreshItems(files, callbacks)         // 刷新所有项
handleDragStart/Over/Enter/Leave/Drop  // 拖拽逻辑
setProcessing(state)                   // 禁用处理状态
```

---

### 4. **ProgressBar.js** - 进度条

**功能：**
- 进度显示 - 显示图片处理的百分比
- 计数显示 - 显示 "处理中: 3/10" 格式
- 动画效果 - 平滑的进度条动画

**关键方法：**
```javascript
update(current, total)  // 更新进度
show()                 // 显示进度条
hide()                 // 隐藏进度条
```

---

### 5. **PreviewModal.js** - 全屏预览模态框

**核心功能：**

#### 基础预览
- 全屏图片显示
- 文件信息展示（名称、大小、位置）
- Esc键/点击背景关闭

#### 图片缩放
- 鼠标滚轮放大/缩小（0.5x ~ 3x）
- 键盘快捷键：`+` 放大，`-` 缩小，`0` 重置
- 按钮控制：+、−、⟲按钮
- 双击图片快速重置

#### 图片移动
- 放大后可拖拽移动图片
- 鼠标指针变为 `grab` 提示
- 自动限制拖拽范围

#### 图片导航
- 左右箭头导航：← →
- 键盘方向键：← →
- 自动禁用（首/末张时禁用）

#### 触摸支持（移动设备）
- 两指捏合缩放
- 触摸拖拽移动

**关键方法：**
```javascript
open(src, file, index, total, allFiles)  // 打开预览
close()                                   // 关闭预览
zoomIn() / zoomOut() / resetZoom()       // 缩放控制
showPrevious() / showNext()              // 导航
updateImage()                             // 更新显示的图片
handleWheel()                             // 滚轮缩放
startDrag/handleDrag/endDrag()           // 拖拽逻辑
```

---

### 6. **ControlPanel.js** - 控制面板

**功能：**
- 生成PDF按钮 - 触发PDF转换
- 清空按钮 - 清除所有图片
- 状态管理 - 处理过程中禁用按钮

**关键方法：**
```javascript
setAllDisabled(state)  // 控制按钮禁用状态
```

---

### 7. **LoadingIndicator.js** - 加载指示器

**功能：**
- 加载动画 - 显示旋转加载动画
- 加载信息 - 显示 "正在生成PDF..." 文本

**关键方法：**
```javascript
show()  // 显示加载指示器
hide()  // 隐藏加载指示器
```

---

### 8. **app.js** - 主应用程序

**功能：**
- 组件初始化 - 创建所有组件实例
- 文件处理 - 接收、压缩图片文件
- 数据管理 - 维护图片数组
- 事件协调 - 协调各组件间的交互
- PDF生成 - 调用pdf-lib库生成PDF
- 文件下载 - 处理PDF下载

**关键方法：**
```javascript
initComponents()                    // 初始化所有组件
handleFilesDrop(files)             // 处理上传的文件
compressImage(file)                // 压缩图片（最大1MB）
previewImage(file, index)          // 打开预览模态框
removeImage(index)                 // 删除指定图片
reorderImages(fromIdx, toIdx)      // 重新排序图片
convertToPdf()                      // 转换为PDF
downloadFile(bytes, fileName)      // 下载PDF文件
setProcessing(state)               // 管理全局处理状态
updateZoomLevel()                  // 更新缩放显示
```

---

## 🔄 数据流和交互流程

```
用户操作
  ↓
┌─────────────────────────────────────────┐
│  上传图片                                 │
│  ↓                                       │
│  UploadArea 触发 onDrop 回调             │
│  ↓                                       │
│  app.handleFilesDrop()                   │
│  ├─ 过滤图片文件                          │
│  ├─ 显示进度条                            │
│  ├─ 压缩每张图片                          │
│  ├─ 添加到 imageFiles[]                  │
│  └─ PreviewContainer.addItem() 渲染      │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  用户交互                                 │
│  ├─ 点击图片 → PreviewModal.open()        │
│  ├─ 删除图片 → app.removeImage()          │
│  ├─ 拖拽排序 → app.reorderImages()        │
│  ├─ 预览缩放 → PreviewModal.zoomIn/Out()  │
│  ├─ 预览导航 → PreviewModal.showNext/Prev│
│  └─ 清空所有 → app.clearAll()            │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  生成PDF                                 │
│  ↓                                       │
│  app.convertToPdf()                      │
│  ├─ 创建PDFDocument                      │
│  ├─ 遍历 imageFiles[]                   │
│  ├─ 逐张转换并嵌入到PDF                   │
│  ├─ 保存PDF为二进制                       │
│  └─ app.downloadFile() 下载              │
└─────────────────────────────────────────┘
```

---

## ⌨️ 快捷键列表

| 快捷键 | 功能 |
|---|---|
| `Esc` | 关闭预览 |
| `←` / `→` | 上一张/下一张 |
| `+` / `=` | 放大 |
| `-` | 缩小 |
| `0` | 重置缩放 |
| `双击图片` | 快速重置缩放 |

---

## 🛠️ 外部依赖

| 库 | 版本 | 用途 |
|---|---|---|
| **pdf-lib** | 1.17.1 | PDF生成和操作 |
| **browser-image-compression** | 2.0.2 | 浏览器端图片压缩 |

---

## 🎨 自定义和扩展

### 修改按钮颜色
编辑 `css/styles.css`：
```css
#convert-btn {
    background-color: #YourColor;
}

#clear-btn {
    background-color: #YourColor;
}
```

### 修改压缩参数
编辑 `js/app.js` 中的 `compressImage()` 方法：
```javascript
async compressImage(file) {
    const options = { 
        maxSizeMB: 1,              // 改为 0.5 或 2
        maxWidthOrHeight: 1920,    // 改为其他尺寸
        useWebWorker: true 
    };
    return await imageCompression(file, options);
}
```

### 修改缩放范围
编辑 `js/components/PreviewModal.js`：
```javascript
constructor(modalId) {
    // ...
    this.minZoom = 0.5;   // 改为 0.3
    this.maxZoom = 3;     // 改为 5
    this.zoomStep = 0.2;  // 改为 0.1
    // ...
}
```

### 添加新组件
1. 创建新文件：`js/components/YourComponent.js`
2. 定义组件类
3. 在 `index.html` 中导入
4. 在 `app.js` 中初始化

---

## 📊 性能指标

- **总JS代码**: ~25KB（未压缩）
- **总CSS样式**: ~10KB（未压缩）
- **外部库**: ~100KB（pdf-lib + 图片压缩库）
- **页面加载**: < 2秒（平均网速）

---

## 🌐 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（iOS Safari、Chrome Mobile）

---

## 🐛 调试

在浏览器控制台查看详细信息：
```javascript
// 在 app.js 中启用日志
async handleFilesDrop(files) {
    console.log('Files received:', files);
    // ... 其他代码
}
```

按 `F12` 打开开发者工具查看：
- 控制台错误日志
- 网络请求
- DOM结构
- 样式应用

---

## 🔒 隐私和安全

- ✅ 完全在本地浏览器运行
- ✅ 文件不上传到服务器
- ✅ 个人数据完全保护
- ✅ 支持离线使用（库文件缓存后）

---

## 📦 生产优化

### 最小化代码
```bash
# 压缩CSS
npx cssnano css/styles.css -o css/styles.min.css

# 压缩JavaScript
npx terser js/components/*.js -o js/components.min.js
```

### 更新HTML引用
修改 `index.html` 使用压缩版本：
```html
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/components.min.js"></script>
```

---

## 💡 核心特色

1. **模块化架构** - 每个组件独立，易于维护和扩展
2. **完整的图片编辑** - 上传、预览、缩放、排序、删除
3. **丰富的交互** - 键盘、鼠标、触摸全支持
4. **智能压缩** - 自动压缩大文件，优化性能
5. **无需后端** - 纯前端实现，隐私安全
6. **用户友好** - 直观的UI和完整的反馈

---

## 📄 许可证

可自由使用和修改用于个人项目。

---

## 🤝 贡献和改进

要扩展功能：
1. 创建新组件遵循相同的模式
2. 确保每个组件有清晰的方法
3. 遵循现有的命名约定
4. 添加适当的事件处理

---

## 📝 更新日志

### v1.0
- ✨ 基础功能：上传、预览、排序、PDF转换
- ✨ 图片预览：缩放、拖拽、导航
- ✨ 键盘快捷键支持
- ✨ 触摸设备支持
- ✨ 响应式设计

---

**Happy coding!** 🎉
