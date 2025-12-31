
const env = import.meta.env.MODE || 'production';
const EnvConfig = {
    development: {
        baseApi:'/api',
        mockApi:'/api',
    },
    production: {
        baseApi:'/api',
        mockApi:'/api',
    }
}
export default {
    // 导出所有环境的配置，以便在需要时使用
    ...EnvConfig,
    // 导出当前环境的配置
    ...EnvConfig[env],
    mock: false,
    env: env
}