/*
把所有与 HTTP 请求相关的通用逻辑（如错误处理、认证）都集中到了此处，当需要修改请求逻辑时，只需修改此处即可，无需逐个修改每个请求
*/

import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import config from "@/config";
import type { RequestConfig } from "./types";

// 扩展 Axios 配置以支持 metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    metadata?: {
        startTime: number;
    };
}

const service = axios.create({
    baseURL: config.baseApi,
});

// 添加请求拦截器
service.interceptors.request.use(
    function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 记录请求开始时间
        (config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() };

        console.log('[Request Start]', {
            url: config.url,
            fullUrl: `${config.baseURL || ''}${config.url}`,
            method: config.method?.toUpperCase(),
            params: config.params,
            data: config.data,
            headers: config.headers,
            timeout: config.timeout,
            timestamp: new Date().toISOString()
        });
        return config;
    },
    function (error: any) {
        // 对请求错误做些什么
        console.error('[Request Config Error]', error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (res) => {
        const { code, data, msg } = res.data;

        if (code === 200) {
            return data;
        } else if (code === 401) {
            // 鉴权失败处理
            console.warn('[Authentication Error]', {
                url: res.config.url,
                method: res.config.method,
                requestData: res.config.data,
                requestParams: res.config.params,
                responseStatus: res.status,
                responseData: res.data
            });
            // 清除 token 并跳转到登录页
            localStorage.removeItem('auth_token');
            window.location.href = '#/login';
            return Promise.reject(new Error(msg || '登录已过期'));
        } else {
            // 业务错误处理
            console.error('[Business Error]', {
                url: res.config.url,
                method: res.config.method,
                requestData: res.config.data,
                requestParams: res.config.params,
                responseStatus: res.status,
                responseData: res.data,
                businessCode: code,
                businessMessage: msg
            });

            const errorMsg = msg || `Business Error: Code ${code}`;
            return Promise.reject(new Error(errorMsg));
        }
    }
);

function request(options: RequestConfig): Promise<any> {
    options.method = options.method || 'get';
    // 修复GET请求参数处理
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }

    let isMock = config.mock;
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock;
    }

    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi;
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }

    return service(options);
}

export default request;
