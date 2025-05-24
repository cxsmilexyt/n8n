# URL Content Length Node for n8n

## 项目功能概述

这个项目为n8n工作流自动化平台添加了一个新的自定义节点：**URL Content Length**。该节点可以获取指定URL的内容并返回详细的内容长度统计信息。

## 功能特性

### 核心功能
- **URL内容获取**: 支持HTTP/HTTPS协议的URL内容获取
- **内容长度分析**: 提供多维度的内容长度统计
- **HTTP方法支持**: 支持GET和HEAD请求方法
- **超时控制**: 可配置请求超时时间
- **响应详情**: 可选择返回HTTP响应的详细信息

### 统计指标
节点返回以下内容统计信息：
1. **字符数** (characters): 内容的总字符数
2. **字节数** (bytes): 内容的字节大小
3. **单词数** (words): 内容中的单词数量
4. **行数** (lines): 内容的行数
5. **内容类型** (contentType): HTTP响应的Content-Type
6. **响应状态** (statusCode): HTTP响应状态码
7. **响应详情** (可选): 包含headers、状态等详细信息

## 节点配置参数

### 必需参数
- **URL**: 要获取内容的目标URL

### 可选参数
- **HTTP方法**: GET（默认）或HEAD
- **超时时间**: 请求超时时间（毫秒，默认10000ms）
- **包含响应详情**: 是否在输出中包含完整的HTTP响应信息

## 使用示例

### 基本用法
```json
{
  "url": "https://api.github.com/users/octocat",
  "method": "GET",
  "timeout": 10000,
  "includeResponseDetails": false
}
```

### 输出示例
```json
{
  "url": "https://api.github.com/users/octocat",
  "characters": 1234,
  "bytes": 1234,
  "words": 89,
  "lines": 45,
  "contentType": "application/json; charset=utf-8",
  "statusCode": 200
}
```

## 技术实现

### 文件结构
```
packages/nodes-base/nodes/UrlContentLength/
├── UrlContentLength.node.ts          # 节点主要逻辑
├── UrlContentLength.node.json        # 节点配置文件
└── urlcontentlength.svg              # 节点图标
```

### 核心技术
- **TypeScript**: 使用TypeScript开发，提供类型安全
- **n8n-workflow**: 基于n8n工作流框架
- **HTTP客户端**: 使用内置HTTP请求功能
- **内容分析**: 自定义内容统计算法

### 错误处理
- 网络请求失败处理
- 超时处理
- 无效URL处理
- HTTP错误状态码处理

## 安装和构建

### 前置条件
- Node.js 18+
- pnpm包管理器
- n8n开发环境

### 构建步骤
1. 克隆n8n仓库
2. 安装依赖：`pnpm install`
3. 构建节点：`pnpm build`
4. 启动n8n：`pnpm start`

### 验证安装
节点成功安装后，在n8n界面的节点面板中可以找到"URL Content Length"节点，位于"Transform"分类下。

## 测试验证

### 功能测试
我们创建了独立的测试脚本来验证核心功能：

```javascript
// 测试JSON API
const jsonResult = await testUrlContentLength('https://jsonplaceholder.typicode.com/posts/1');
console.log('JSON API测试:', jsonResult);

// 测试HTML页面
const htmlResult = await testUrlContentLength('https://httpbin.org/html');
console.log('HTML页面测试:', htmlResult);
```

### 测试结果
- ✅ JSON API内容获取和分析
- ✅ HTML页面内容获取和分析
- ✅ 字符数、字节数、单词数、行数统计
- ✅ Content-Type检测
- ✅ HTTP状态码获取

## 应用场景

### 内容监控
- 监控网页内容变化
- API响应大小监控
- 内容质量评估

### 数据分析
- 网站内容统计
- API性能分析
- 内容长度趋势分析

### 工作流集成
- 与其他n8n节点组合使用
- 条件判断（基于内容长度）
- 数据预处理

## 扩展可能性

### 未来功能
- 支持更多HTTP方法（POST、PUT等）
- 添加请求头自定义
- 支持认证（Basic Auth、Bearer Token）
- 内容类型特定分析（JSON、XML、HTML）
- 缓存机制
- 批量URL处理

### 性能优化
- 流式处理大文件
- 并发请求支持
- 内存使用优化

## 技术细节

### 依赖关系
- `n8n-workflow`: n8n核心工作流包
- 内置HTTP客户端
- TypeScript类型定义

### 兼容性
- n8n版本: 1.94.0+
- Node.js版本: 18+
- 支持的操作系统: Linux, macOS, Windows

## 贡献指南

### 开发环境设置
1. Fork n8n仓库
2. 创建功能分支
3. 实现新功能或修复
4. 添加测试
5. 提交Pull Request

### 代码规范
- 遵循TypeScript最佳实践
- 使用ESLint和Prettier
- 添加适当的注释
- 编写单元测试

## 许可证

本项目遵循n8n的开源许可证。

## 联系信息

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- n8n社区论坛
- 官方文档

---

**注意**: 这是一个自定义节点实现，需要在n8n开发环境中构建和测试。在生产环境使用前，请确保充分测试所有功能。