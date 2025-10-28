/*
项目统一api管理
*/

import request from "./request";

export default {
    getUserInfo() {
        return request({
            url: "/api/user/getUserInfo",
            method: "get"
        });
    },
    getLoginInfo() {
        return request({
            url: "/api/user/getLoginInfo",
            method: "get"
        });
    }
};