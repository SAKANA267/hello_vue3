import Mock from 'mockjs'
import { ROLE_PERMISSIONS } from '@/constants/permissions'

// 用户角色映射
const USER_ROLES: Record<string, keyof typeof ROLE_PERMISSIONS> = {
  admin: 'ADMIN',
  user: 'USER',
  auditor: 'AUDITOR'
}

Mock.mock('/api/permission/getMenu', 'post', (options: { body: string }) => {
  const { username, password } = JSON.parse(options.body)

  // 验证账号
  if (username === 'admin' && password === 'admin') {
    const role = USER_ROLES[username]
    return {
      code: 200,
      data: {
        token: `mock-${role}-token-${Date.now()}`,
        menuList: ['1-1', '1-2', '1-3', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '4-3'],
        user: {
          id: '1',
          username: 'admin',
          role: role,
          permissions: ROLE_PERMISSIONS[role],
          dataScope: 'all'
        }
      }
    }
  }

  if (username === 'user' && password === 'user') {
    const role = USER_ROLES[username]
    return {
      code: 200,
      data: {
        token: `mock-${role}-token-${Date.now()}`,
        menuList: ['1-3', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'],
        user: {
          id: '2',
          username: 'user',
          role: role,
          permissions: ROLE_PERMISSIONS[role],
          dataScope: 'self'
        }
      }
    }
  }

  if (username === 'auditor' && password === 'auditor') {
    const role = USER_ROLES[username]
    return {
      code: 200,
      data: {
        token: `mock-${role}-token-${Date.now()}`,
        menuList: ['1-3', '3-1', '3-2', '4-1', '4-2'],
        user: {
          id: '3',
          username: 'auditor',
          role: role,
          permissions: ROLE_PERMISSIONS[role],
          dataScope: 'department'
        }
      }
    }
  }

  return { code: 401, msg: '用户名或密码错误' }
})

// 模拟用户存储
const registeredUsers: Record<string, { password: string; email: string }> = {}

Mock.mock('/api/permission/register', 'post', (options: { body: string }) => {
  const { username, password, email } = JSON.parse(options.body)

  // 检查用户名是否已存在
  if (
    registeredUsers[username] ||
    username === 'admin' ||
    username === 'user' ||
    username === 'auditor'
  ) {
    return { code: 400, msg: '用户名已存在' }
  }

  // 模拟注册成功
  registeredUsers[username] = { password, email }

  return {
    code: 200,
    data: {
      message: '注册成功'
    }
  }
})
