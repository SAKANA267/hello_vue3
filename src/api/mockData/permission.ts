import type { MockConfig, MockResponse, LoginRequest, LoginResponseData } from '../types'

export default {
  getMenu: (config: MockConfig): MockResponse<LoginResponseData> => {
    const { username, password } = JSON.parse(config.body || '{}') as LoginRequest

    // 先判断用户是否存在
    // 判断账号和密码是否正确
    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          menuList: ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '4-3'],
          token: 'mock-admin-token-' + Date.now()
        }
      }
    } else if (username === 'user' && password === 'user') {
      return {
        code: 200,
        data: {
          menuList: ['1-1', '1-2', '3-1', '3-2'],
          token: 'mock-user-token-' + Date.now()
        }
      }
    } else {
      return {
        code: 401,
        data: undefined,
        message: '账号或密码错误'
      }
    }
  }
}
