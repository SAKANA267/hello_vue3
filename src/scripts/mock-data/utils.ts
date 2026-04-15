import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { mockConfig } from './config'

/**
 * 生成 UUID
 */
export function generateId(): string {
  return uuidv4()
}

/**
 * 生成短 ID (用于非 UUID 的 ID 字段)
 */
export function generateShortId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

/**
 * 加密密码
 */
export async function hashPassword(password: string = mockConfig.defaultPassword): Promise<string> {
  return await bcrypt.hash(password, 10)
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * 生成随机整数 [min, max]
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机浮点数 [min, max)
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 从数组中随机选择一个元素
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 从数组中随机选择多个元素（不重复）
 */
export function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * 生成随机日期（在指定天数范围内）
 */
export function randomDate(pastDays: number = mockConfig.dateRange.past): Date {
  const now = dayjs()
  const past = now.subtract(pastDays, 'day')
  const randomDays = Math.random() * pastDays
  return past.add(randomDays, 'day').toDate()
}

/**
 * 生成指定日期之后的随机日期
 */
export function randomDateAfter(startDate: Date, maxHours: number = 48): Date {
  return dayjs(startDate).add(Math.random() * maxHours, 'hour').toDate()
}

/**
 * 生成日期范围内的日期
 */
export function randomDateInRange(start: Date, end: Date): Date {
  const startTime = start.getTime()
  const endTime = end.getTime()
  return new Date(startTime + Math.random() * (endTime - startTime))
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 生成随机手机号
 */
export function randomPhone(): string {
  const prefixes = ['130', '131', '132', '133', '135', '136', '137', '138', '139',
                    '150', '151', '152', '153', '155', '156', '157', '158', '159',
                    '180', '181', '182', '183', '185', '186', '187', '188', '189']
  const prefix = randomChoice(prefixes)
  const suffix = Math.random().toString().substring(2, 10)
  return prefix + suffix
}

/**
 * 生成随机邮箱
 */
export function randomEmail(username: string): string {
  const domains = ['qq.com', '163.com', 'gmail.com', 'outlook.com', 'hospital.com']
  const domain = randomChoice(domains)
  return `${username}@${domain}`
}

/**
 * 生成随机姓名
 */
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
                  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
               '勇', '艳', '杰', '涛', '明', '超', '秀英', '娟', '英', '华']

export function randomName(): string {
  const surname = randomChoice(surnames)
  const hasMiddle = Math.random() > 0.5
  if (hasMiddle) {
    return surname + randomChoice(names) + randomChoice(names)
  }
  return surname + randomChoice(names)
}

/**
 * 生成随机用户名
 */
export function randomUsername(baseName?: string): string {
  if (baseName) {
    return baseName + randomInt(1, 999)
  }
  return 'user_' + generateShortId().substring(0, 8)
}

/**
 * 生成随机年龄
 */
export function randomAge(min: number = 18, max: number = 80): number {
  return randomInt(min, max)
}

/**
 * 生成随机性别
 */
export function randomGender(): '男' | '女' {
  return randomChoice(['男', '女'])
}

/**
 * 生成随机 IP 地址
 */
export function randomIP(): string {
  return `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`
}

/**
 * 生成随机地点
 */
const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '武汉市', '西安市']

export function randomLocation(): string {
  return randomChoice(locations)
}

/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 进度条显示
 */
export function showProgress(current: number, total: number, label: string = ''): void {
  const percentage = Math.round((current / total) * 100)
  const barLength = 30
  const filled = Math.round((barLength * current) / total)
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)

  process.stdout.write(`\r${label} [${bar}] ${percentage}% (${current}/${total})`)

  if (current === total) {
    process.stdout.write('\n')
  }
}

/**
 * 清空行
 */
export function clearLine(): void {
  process.stdout.write('\r' + ' '.repeat(80) + '\r')
}

/**
 * 打印带前缀的消息
 */
export function printSuccess(message: string): void {
  console.log(`✓ ${message}`)
}

export function printError(message: string): void {
  console.error(`✗ ${message}`)
}

export function printInfo(message: string): void {
  console.log(`  ${message}`)
}

export function printWarn(message: string): void {
  console.warn(`⚠ ${message}`)
}

/**
 * 分块处理数组
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 计算两个日期之间的小时数
 */
export function hoursBetween(start: Date, end: Date): number {
  return dayjs(end).diff(dayjs(start), 'hour', true)
}
