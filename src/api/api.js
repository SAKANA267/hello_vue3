/*
项目统一api管理
*/

import request from "./request";

export default {
    //user info
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
    //object management
    getTableData(data) {
        return request({
            url: "/table/getTableData",
            method: "get",
            data,
        });
    },
    deleteObject(data) {
        return request({
            url: "/table/deleteObject",
            method: "get",
            data,
        });
    },
};