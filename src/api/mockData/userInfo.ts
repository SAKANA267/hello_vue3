import type { UserInfo, LoginInfo } from "@/assets/types/user.ts";

export default {
    getUserInfo: ():{ code: number, data: UserInfo } => {
        return {
            code: 200,
            data:{
                username: "JohnDoe",
                role: "admin",
                hobbies: "Reading, Coding, Hiking"
            }
        }
    },

    getLoginInfo: ():{ code: number, data: LoginInfo } => {
        return {
            code: 200,
            data:{
                registerDate: "2023-01-15",
                lastLoginDate: "2024-01-10 14:30:25",
                loginLocation: "北京市朝阳区"
            }
        }
    }
}