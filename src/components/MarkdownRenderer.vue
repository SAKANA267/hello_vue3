<template>
  <div v-html="renderedContent" class="markdown-body"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked renderer
const renderer = new marked.Renderer()

// Custom code block rendering with syntax highlighting
renderer.code = function (code: { text: string; lang?: string; escaped?: boolean }) {
  const { text, lang } = code
  const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language: validLang }).value
  return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

const props = defineProps<{
  content: string
}>()

const renderedContent = computed(() => marked(props.content || ''))
</script>

<style lang="less">
.markdown-body {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 16px 0 8px;
    font-weight: 600;
    line-height: 1.4;
    color: #303133;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 1.8em;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 8px;
  }

  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;
    margin-top: 24px;
  }

  h3 {
    font-size: 1.25em;
    margin-top: 20px;
  }

  h4 {
    font-size: 1.1em;
  }

  p {
    margin: 8px 0;
    line-height: 1.7;
  }

  code {
    background: #f5f7fa;
    color: #e74c3c;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: #282c34;
    color: #abb2bf;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
    }
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 24px;
    line-height: 1.7;

    li {
      margin: 4px 0;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  blockquote {
    margin: 12px 0;
    padding: 8px 16px;
    border-left: 4px solid #409eff;
    background: #f0f9ff;
    color: #606266;

    p {
      margin: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 13px;

    th,
    td {
      border: 1px solid #e5e5e5;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: #f5f7fa;
      font-weight: 600;
      color: #303133;
    }

    tr:nth-child(even) {
      background: #fafafa;
    }

    tr:hover {
      background: #f0f9ff;
    }
  }

  a {
    color: #409eff;
    text-decoration: none;
    border-bottom: 1px dashed #409eff;

    &:hover {
      color: #66b1ff;
      border-bottom-style: solid;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 8px 0;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 16px 0;
  }

  strong {
    font-weight: 600;
    color: #303133;
  }

  em {
    font-style: italic;
    color: #606266;
  }
}

// Code highlighting theme (One Dark)
pre code.hljs {
  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }

  .hljs-literal,
  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta-string {
    color: #98c379;
  }

  .hljs-built_in,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #d19a66;
  }

  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-symbol,
  .hljs-title {
    color: #61aeee;
  }

  .hljs-number,
  .hljs-emphasis {
    color: #d19a66;
  }

  .hljs-strong,
  .hljs-param {
    color: #d19a66;
  }

  .hljs-params {
    color: #c678dd;
  }

  .hljs-property {
    color: #61aeee;
  }
}
</style>
