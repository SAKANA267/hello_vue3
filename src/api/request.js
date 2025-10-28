/* 
把所有与 HTTP 请求相关的通用逻辑（如错误处理、认证）都集中到了此处，当需要修改请求逻辑时，只需修改此处即可，无需逐个修改每个请求
*/

import axios from "axios";
import { ElMessage } from "element-plus";

const service = axios.create()
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data
    if (code === 200) {
        return data;
    } else {
        ElMessage.error(msg || 'Network Error');
        return Promise.reject(msg || 'Network Error');
    }
});

function request(options) {
    options.method = options.method || 'get';
    return service(options)
}

export default request;