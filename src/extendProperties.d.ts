import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: proxy // 这里填类型
  }
}
// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
