import Mock from 'mockjs';
export default {
    getMenu: config => {
        const { username, password } = JSON.parse(config.body);
        // 先判断用户是否存在
        // 判断账号和密码是否正确
        if (username === 'admin' && password === 'admin'){
            return {
                code: 200,
                data: {
                    menuList: [
                        '1-1',
                        '1-2',
                        '2-1',
                        '2-2',
                        '3-1',
                        '3-2',
                        '4-1',
                        '4-2',
                        '4-3'
                    ]
                }
            }
        }else if (username === 'user' && password === 'user'){
            return {
                code: 200,
                data: {
                    menuList: [
                        '1-1',
                        '1-2',
                        '3-1',
                        '3-2'
                    ]
                }
            }
        }else {
            return {
                code: 401,
                message: '账号或密码错误'
            }
        }
    }
}