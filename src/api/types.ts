/*
统一 API 类型定义
*/

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { MockjsRequestOptions } from "mockjs";

// ============== 基础类型 ==============

/** 统一 API 响应结构 */
export interface ApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
}

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
    mock?: boolean;
}

/** 分页请求参数 */
export interface PageParams {
    keyWord?: string;
    page?: number;
    limit?: number;
}

/** 分页响应数据 */
export interface TableDataResponse<T = any> {
    success: boolean;
    list: T[];
    count: number;
}

// ============== 用户/认证相关 ==============

/** 用户信息 */
export interface UserInfo {
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    createTime: string;
    lastLogin: string;
}

/** 登录请求参数 */
export interface LoginRequest {
    username: string;
    password: string;
}

/** 登录响应数据 */
export interface LoginResponseData {
    menuList: string[];
    token: string;
}

/** 菜单响应 */
export type MenuResponse = ApiResponse<LoginResponseData>;

// ============== 对象管理相关 ==============

/** 对象管理数据项 */
export interface ObjectItem {
    id: string;
    hospitalArea: string;
    department: string;
    diagnosisName: string;
    inpatientNo: string;
    outpatientNo: string;
    name: string;
    gender: string;
    age: number;
    phone: string;
    reportDoctor: string;
    fillDate: string;
    auditDate: string;
    auditor: string;
    status: string;
}

/** 创建/更新对象参数 */
export interface ObjectFormData {
    id?: string;
    hospitalArea: string;
    department: string;
    diagnosisName: string;
    inpatientNo: string;
    outpatientNo: string;
    name: string;
    gender: string;
    age: number;
    phone: string;
    reportDoctor: string;
    fillDate: string;
    auditDate?: string;
    auditor?: string;
    status: string;
}

// ============== 用户管理相关 ==============

/** 用户管理数据项 */
export interface UserItem {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    createTime: string;
    lastLogin: string;
}

/** 创建/更新用户参数 */
export interface UserFormData {
    id?: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role?: string;
    status?: string;
}

// ============== Mock 相关 ==============

/** Mock 配置类型 */
export interface MockConfig extends MockjsRequestOptions {
    url: string;
    body: string;
}

/** Mock 响应结构 */
export interface MockResponse<T = any> {
    code: number;
    data?: T;
    msg?: string;
    message?: string;
}

/** 参数解析结果 */
export interface ParsedParams extends PageParams {
    [key: string]: any;
}

// ============== 审核相关 ==============

/** 审核通过参数 */
export interface AuditPassParams {
    id: string;
    auditor: string;
    auditDate: string;
    status: '已审核';
}

/** 审核不通过参数 */
export interface AuditRejectParams {
    id: string;
    auditor: string;
    auditDate: string;
    status: '审核不通过';
    remark?: string;
}

/** 审核响应 */
export interface AuditResponse {
    success: boolean;
    msg?: string;
}
