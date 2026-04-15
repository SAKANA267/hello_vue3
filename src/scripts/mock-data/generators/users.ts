import { query, batchInsert, hasData, truncateTable } from '../db'
import {
  generateId,
  hashPassword,
  randomName,
  randomUsername,
  randomEmail,
  randomPhone,
  randomDate,
  formatDateTime,
  printSuccess,
  printInfo
} from '../utils'
import { mockConfig } from '../config'

/**
 * SysUser 接口
 */
interface SysUser {
  id: string
  username: string
  password: string
  name: string
  email?: string
  phone?: string
  role: string
  status: string
  data_scope?: string
  create_time: Date
  update_time?: Date
  last_login?: Date
  deleted: boolean
}

/**
 * UserProfile 接口
 */
interface UserProfile {
  id: string
  avatar?: string
  hobbies?: string
  bio?: string
  register_date?: Date
  last_login_location?: string
  create_time: Date
  update_time?: Date
}

/**
 * LoginHistory 接口
 */
interface LoginHistory {
  id: string
  user_id: string
  username: string
  login_time: Date
  user_agent?: string
  ip_address?: string
  create_time: Date
}

/**
 * 存储生成的用户数据
 */
export interface GeneratedUsers {
  admins: SysUser[]
  leaders: SysUser[]
  auditors: SysUser[]
  reporters: SysUser[]
  all: SysUser[]
  byId: Map<string, SysUser>
}

const generatedData: GeneratedUsers = {
  admins: [],
  leaders: [],
  auditors: [],
  reporters: [],
  all: [],
  byId: new Map()
}

/**
 * 生成系统用户数据
 */
async function generateSysUsers(): Promise<void> {
  printInfo('正在生成系统用户数据...')

  const hashedPassword = await hashPassword()
  const now = new Date()

  // 生成管理员
  for (let i = 0; i < mockConfig.counts.users.admin; i++) {
    const username = i === 0 ? 'admin' : `admin${i + 1}`
    const user: SysUser = {
      id: generateId(),
      username,
      password: hashedPassword,
      name: i === 0 ? '系统管理员' : randomName(),
      email: randomEmail(username),
      phone: randomPhone(),
      role: 'admin',
      status: 'active',
      data_scope: 'all',
      create_time: now,
      update_time: now,
      deleted: false
    }
    generatedData.admins.push(user)
    generatedData.all.push(user)
    generatedData.byId.set(user.id, user)
  }

  // 生成审核组长
  for (let i = 0; i < mockConfig.counts.users.leader; i++) {
    const username = `leader${i + 1}`
    const user: SysUser = {
      id: generateId(),
      username,
      password: hashedPassword,
      name: randomName(),
      email: randomEmail(username),
      phone: randomPhone(),
      role: 'auditor',
      status: 'active',
      data_scope: 'department',
      create_time: now,
      update_time: now,
      deleted: false
    }
    generatedData.leaders.push(user)
    generatedData.all.push(user)
    generatedData.byId.set(user.id, user)
  }

  // 生成审核员
  for (let i = 0; i < mockConfig.counts.users.auditor; i++) {
    const username = `auditor${i + 1}`
    const user: SysUser = {
      id: generateId(),
      username,
      password: hashedPassword,
      name: randomName(),
      email: randomEmail(username),
      phone: randomPhone(),
      role: 'auditor',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      data_scope: 'department',
      create_time: now,
      update_time: now,
      deleted: false
    }
    generatedData.auditors.push(user)
    generatedData.all.push(user)
    generatedData.byId.set(user.id, user)
  }

  // 生成报告医生
  for (let i = 0; i < mockConfig.counts.users.reporter; i++) {
    const username = `doctor${i + 1}`
    const user: SysUser = {
      id: generateId(),
      username,
      password: hashedPassword,
      name: randomName(),
      email: randomEmail(username),
      phone: randomPhone(),
      role: 'user',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      data_scope: 'self',
      create_time: now,
      update_time: now,
      deleted: false
    }
    generatedData.reporters.push(user)
    generatedData.all.push(user)
    generatedData.byId.set(user.id, user)
  }

  // 批量插入
  const columns = ['id', 'username', 'password', 'name', 'email', 'phone',
                   'role', 'status', 'data_scope', 'create_time', 'update_time', 'deleted']

  await batchInsert('sys_user', columns, generatedData.all.map(u => [
    u.id, u.username, u.password, u.name, u.email, u.phone,
    u.role, u.status, u.data_scope, u.create_time, u.update_time, u.deleted
  ]))

  printSuccess(`插入系统用户 ${generatedData.all.length} 条`)
  printInfo(`  - 管理员: ${generatedData.admins.length} 人`)
  printInfo(`  - 审核组长: ${generatedData.leaders.length} 人`)
  printInfo(`  - 审核员: ${generatedData.auditors.length} 人`)
  printInfo(`  - 报告医生: ${generatedData.reporters.length} 人`)
}

/**
 * 生成用户扩展信息数据
 */
async function generateUserProfiles(): Promise<void> {
  printInfo('正在生成用户扩展信息数据...')

  const now = new Date()
  const records: UserProfile[] = []

  const avatarUrls = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly'
  ]

  const hobbiesList = ['阅读', '运动', '音乐', '旅游', '摄影', '烹饪', '游戏', '电影']

  for (const user of generatedData.all) {
    const hasProfile = Math.random() > 0.2 // 80% 的用户有完整资料

    records.push({
      id: user.id,
      avatar: hasProfile ? avatarUrls[Math.floor(Math.random() * avatarUrls.length)] : null,
      hobbies: hasProfile ? [hobbiesList[Math.floor(Math.random() * hobbiesList.length)],
                            hobbiesList[Math.floor(Math.random() * hobbiesList.length)]].join(',') : null,
      bio: hasProfile ? `${user.name}，${user.role === 'admin' ? '系统管理员' : user.role === 'auditor' ? '审核专员' : '临床医生'}` : null,
      register_date: randomDate(90), // 注册日期在90天内
      last_login_location: hasProfile ? ['北京市', '上海市', '广州市', '深圳市'][Math.floor(Math.random() * 4)] : null,
      create_time: now,
      update_time: now
    })
  }

  // 批量插入
  const columns = ['id', 'avatar', 'hobbies', 'bio', 'register_date', 'last_login_location', 'create_time', 'update_time']

  await batchInsert('user_profile', columns, records.map(r => [
    r.id, r.avatar, r.hobbies, r.bio, r.register_date, r.last_login_location, r.create_time, r.update_time
  ]))

  printSuccess(`插入用户扩展信息 ${records.length} 条`)
}

/**
 * 生成登录历史数据
 */
async function generateLoginHistory(): Promise<void> {
  printInfo('正在生成登录历史数据...')

  const records: LoginHistory[] = []

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
  ]

  for (const user of generatedData.all) {
    // 为每个用户生成 3-5 条登录记录
    const historyCount = mockConfig.counts.loginHistoryPerUser

    for (let i = 0; i < historyCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30) // 最近30天
      const loginTime = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      records.push({
        id: generateId(),
        user_id: user.id,
        username: user.username,
        login_time: loginTime,
        user_agent: userAgents[Math.floor(Math.random() * userAgents.length)],
        ip_address: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`,
        create_time: loginTime
      })
    }

    // 更新最后登录时间
    user.last_login = records[records.length - 1]?.login_time
  }

  // 按登录时间排序
  records.sort((a, b) => a.login_time.getTime() - b.login_time.getTime())

  // 批量插入
  const columns = ['id', 'user_id', 'username', 'login_time', 'user_agent', 'ip_address', 'create_time']

  await batchInsert('login_history', columns, records.map(r => [
    r.id, r.user_id, r.username, r.login_time, r.user_agent, r.ip_address, r.create_time
  ]))

  // 更新 sys_user 的最后登录时间
  for (const user of generatedData.all) {
    if (user.last_login) {
      await query(
        'UPDATE sys_user SET last_login = ? WHERE id = ?',
        [user.last_login, user.id]
      )
    }
  }

  printSuccess(`插入登录历史 ${records.length} 条`)
}

/**
 * 生成用户数据（主函数）
 */
export async function generateUsers(clean: boolean = false): Promise<GeneratedUsers> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('第 2 步: 生成用户数据')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 检查是否已有数据
  const hasUsers = await hasData('sys_user')

  if (hasUsers) {
    if (clean) {
      printInfo('清理模式：清空现有数据...')
      // 需要先清空依赖 sys_user 的表
      await truncateTable('assignment_operation_log')
      await truncateTable('report_card_assignment')
      await truncateTable('login_history')
      await truncateTable('user_profile')
      await truncateTable('sys_user')
      // 清空后重置数据
      generatedData.admins = []
      generatedData.leaders = []
      generatedData.auditors = []
      generatedData.reporters = []
      generatedData.all = []
      generatedData.byId.clear()
    } else {
      console.log('⚠ 数据库中已存在用户数据，跳过生成（使用 --clean 选项可清空并重新生成）')
      await loadExistingUsers()
      return generatedData
    }
  }

  await generateSysUsers()
  await generateUserProfiles()
  await generateLoginHistory()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return generatedData
}

/**
 * 加载现有用户数据
 */
/**
 * 加载现有用户数据
 */
async function loadExistingUsers(): Promise<void> {
  const users = await query(
    'SELECT * FROM sys_user WHERE deleted = 0'
  ) as SysUser[]

  for (const user of users) {
    generatedData.all.push(user)
    generatedData.byId.set(user.id, user)

    if (user.role === 'admin') {
      generatedData.admins.push(user)
    } else if (user.role === 'auditor' && user.data_scope === 'department') {
      // 简单判断：如果是审核员且数据范围是部门，可能是组长
      // 实际应该通过审核组表判断
      if (generatedData.leaders.length < mockConfig.counts.users.leader) {
        generatedData.leaders.push(user)
      } else {
        generatedData.auditors.push(user)
      }
    } else if (user.role === 'auditor') {
      generatedData.auditors.push(user)
    } else {
      generatedData.reporters.push(user)
    }
  }

  printInfo(`已加载现有用户: ${users.length} 人`)
}

/**
 * 获取随机用户
 */
export function getRandomUser(role?: 'admin' | 'auditor' | 'user'): SysUser {
  let users = generatedData.all
  if (role === 'admin') users = generatedData.admins
  else if (role === 'auditor') users = [...generatedData.leaders, ...generatedData.auditors]
  else if (role === 'user') users = generatedData.reporters

  return users[Math.floor(Math.random() * users.length)]
}

/**
 * 根据ID获取用户
 */
export function getUserById(id: string): SysUser | undefined {
  return generatedData.byId.get(id)
}
