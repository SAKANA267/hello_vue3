/**
 * Vite 环境变量类型定义
 * 扩展 ImportMetaEnv 接口以支持自定义环境变量
 */

interface ImportMetaEnv {
    /** 应用标题 */
    readonly VITE_APP_TITLE: string;

    /** API 基础路径 */
    readonly VITE_BASE_API: string;

    /** Mock API 基础路径 */
    readonly VITE_MOCK_API: string;

    /** Mock 数据开关 */
    readonly VITE_MOCK: string;

    /** 请求超时时间（毫秒） */
    readonly VITE_REQUEST_TIMEOUT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
