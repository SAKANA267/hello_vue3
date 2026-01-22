/*
项目统一api管理
*/

import request from "./request";
import type {
    LoginRequest,
    LoginResponseData,
    ObjectFormData,
    PageParams,
    TableDataResponse,
    UserFormData,
    UserInfo,
    ObjectItem,
    UserItem,
    AuditPassParams,
    AuditRejectParams
} from "./types";

/** API 接口对象 */
interface ApiInterface {
    // user info
    getUserInfo(): Promise<UserInfo>;
    getLoginInfo(): Promise<any>;
    // object management
    getTableData(data: PageParams): Promise<TableDataResponse<ObjectItem>>;
    deleteObject(data: { id: string }): Promise<{ success: boolean }>;
    createObject(data: ObjectFormData): Promise<{ success: boolean }>;
    updateObject(data: ObjectFormData): Promise<{ success: boolean }>;
    // user management
    getUserList(data: PageParams): Promise<TableDataResponse<UserItem>>;
    deleteUser(data: { id: string }): Promise<{ success: boolean }>;
    createUser(data: UserFormData): Promise<{ success: boolean }>;
    updateUser(data: UserFormData): Promise<{ success: boolean }>;
    // login
    getMenu(params: LoginRequest): Promise<LoginResponseData>;
    // audit
    auditPass(data: AuditPassParams): Promise<{ success: boolean; msg?: string }>;
    auditReject(data: AuditRejectParams): Promise<{ success: boolean; msg?: string }>;
}

const api: ApiInterface = {
    // ========== user info ==========
    getUserInfo() {
        return request({
            url: "/user/getUserInfo",
            method: "get"
        });
    },

    getLoginInfo() {
        return request({
            url: "/user/getLoginInfo",
            method: "get"
        });
    },

    // ========== object management ==========
    getTableData(data: PageParams) {
        return request({
            url: "/table/getTableData",
            method: "get",
            data,
        });
    },

    deleteObject(data: { id: string }) {
        return request({
            url: "/table/deleteObject",
            method: "get",
            data,
        });
    },

    createObject(data: ObjectFormData) {
        return request({
            url: "/table/createObject",
            method: "post",
            data,
        });
    },

    updateObject(data: ObjectFormData) {
        return request({
            url: "/table/updateObject",
            method: "post",
            data,
        });
    },

    // ========== user management ==========
    getUserList(data: PageParams) {
        return request({
            url: "/user/getUserList",
            method: "get",
            data,
        });
    },

    deleteUser(data: { id: string }) {
        return request({
            url: "/user/deleteUser",
            method: "get",
            data,
        });
    },

    createUser(data: UserFormData) {
        return request({
            url: "/user/createUser",
            method: "post",
            data,
        });
    },

    updateUser(data: UserFormData) {
        return request({
            url: "/user/updateUser",
            method: "post",
            data,
        });
    },

    // ========== login ==========
    getMenu(params: LoginRequest) {
        return request({
            url: "/permission/getMenu",
            method: "post",
            data: params,
        });
    },

    // ========== audit ==========
    auditPass(data: AuditPassParams) {
        return request({
            url: "/table/auditPass",
            method: "post",
            data,
        });
    },

    auditReject(data: AuditRejectParams) {
        return request({
            url: "/table/auditReject",
            method: "post",
            data,
        });
    }
};

export default api;
