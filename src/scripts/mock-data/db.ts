import mysql from 'mysql2/promise'
import type { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

// 数据库配置
export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  charset?: string
  connectionLimit?: number
}

// 默认配置
const defaultConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'public_health',
  charset: 'utf8mb4',
  connectionLimit: 10
}

// 连接池单例
let pool: Pool | null = null

/**
 * 获取数据库连接池
 */
export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(defaultConfig)
    console.log('✓ 数据库连接池已创建')
    console.log(`  Host: ${defaultConfig.host}:${defaultConfig.port}`)
    console.log(`  Database: ${defaultConfig.database}`)
  }
  return pool
}

/**
 * 获取数据库连接
 */
export async function getConnection(): Promise<PoolConnection> {
  const pool = getPool()
  return await pool.getConnection()
}

/**
 * 执行查询
 */
export async function query<T = RowDataPacket[]>(
  sql: string,
  params?: any[]
): Promise<T> {
  const pool = getPool()
  const [results] = await pool.execute(sql, params)
  return results as T
}

/**
 * 执行插入操作并返回插入的 ID
 */
export async function insert(
  sql: string,
  params?: any[]
): Promise<string | number> {
  const pool = getPool()
  const [result] = await pool.execute(sql, params)
  const insertResult = result as ResultSetHeader
  return insertResult.insertId
}

/**
 * 批量插入
 */
export async function batchInsert(
  tableName: string,
  columns: string[],
  rows: any[][]
): Promise<void> {
  if (rows.length === 0) return

  const placeholders = columns.map(() => '?').join(', ')
  const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    for (const row of rows) {
      await connection.execute(sql, row)
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * 检查表是否已有数据
 */
export async function hasData(tableName: string): Promise<boolean> {
  const sql = `SELECT COUNT(*) as count FROM ${tableName}`
  const result = await query<{ count: number }[]>(sql)
  return result && result.length > 0 && result[0].count > 0
}

/**
 * 获取表的记录数
 */
export async function getCount(tableName: string): Promise<number> {
  const sql = `SELECT COUNT(*) as count FROM ${tableName}`
  const [result] = await query<{ count: number }[]>(sql)
  return result[0].count
}

/**
 * 清空表数据
 */
export async function truncateTable(tableName: string): Promise<void> {
  const sql = `DELETE FROM ${tableName}`
  await query(sql)
  console.log(`  已清空表: ${tableName}`)
}

/**
 * 关闭连接池
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log('✓ 数据库连接池已关闭')
  }
}

/**
 * 执行事务
 */
export async function transaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
