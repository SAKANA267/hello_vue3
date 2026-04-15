#!/usr/bin/env tsx

/**
 * 公共卫生平台 - 模拟数据生成脚本
 *
 * 用法:
 *   npm run mock:data              # 生成模拟数据
 *   npm run mock:data -- --clean   # 清空并重新生成
 *   npm run mock:data -- --skip-existing  # 跳过已有数据的表
 */

import { closePool } from './db'
import { generateDiseases } from './generators/diseases'
import { generateUsers } from './generators/users'
import { generateAuditGroups } from './generators/auditGroups'
import { generateReportCards } from './generators/reportCards'
import { printSuccess, printError, printInfo, printWarn } from './utils'

interface Options {
  clean: boolean
  skipExisting: boolean
}

/**
 * 解析命令行参数
 */
function parseArgs(): Options {
  const args = process.argv.slice(2)
  const options: Options = {
    clean: false,
    skipExisting: false
  }

  for (const arg of args) {
    if (arg === '--clean' || arg === '-c') {
      options.clean = true
    } else if (arg === '--skip-existing' || arg === '-s') {
      options.skipExisting = true
    } else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

/**
 * 打印帮助信息
 */
function printHelp(): void {
  console.log(`
公共卫生平台 - 模拟数据生成脚本

用法:
  npm run mock:data [选项]

选项:
  --clean, -c           清空现有数据并重新生成
  --skip-existing, -s   跳过已有数据的表（默认行为）
  --help, -h            显示帮助信息

示例:
  npm run mock-data                    # 生成模拟数据（跳过已有数据）
  npm run mock:data -- --clean         # 清空并重新生成所有数据
  npm run mock:data -- --clean --skip  # 组合使用

注意:
  - 默认情况下，如果表中已有数据，将跳过该表的生成
  - 使用 --clean 选项会清空相关表的数据并重新生成
  - 数据生成顺序: 病种 -> 用户 -> 审核组 -> 报卡
  - 所有表的插入遵循外键依赖关系
`)
}

/**
 * 显示统计信息
 */
async function showStatistics(): Promise<void> {
  const { query } = await import('./db')

  console.log('\n' + '═'.repeat(50))
  console.log('数据生成完成！统计信息:')
  console.log('═'.repeat(50))

  const tables = [
    { name: '病种分类', table: 'disease_category' },
    { name: '疾病类型', table: 'disease_type' },
    { name: '系统用户', table: 'sys_user' },
    { name: '用户扩展', table: 'user_profile' },
    { name: '登录历史', table: 'login_history' },
    { name: '审核组', table: 'audit_group' },
    { name: '审核组成员', table: 'audit_group_member' },
    { name: '审核组统计', table: 'audit_group_work_stats' },
    { name: '报卡', table: 'report_card' },
    { name: '报卡分配', table: 'report_card_assignment' },
    { name: '分配操作日志', table: 'assignment_operation_log' }
  ]

  for (const { name, table } of tables) {
    try {
      const result = await query<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}`)
      console.log(`  ${name.padEnd(12)} : ${result[0].count.toString().padStart(4)} 条`)
    } catch (error) {
      console.log(`  ${name.padEnd(12)} : 查询失败`)
    }
  }

  console.log('═'.repeat(50) + '\n')
}

/**
 * 显示报卡状态分布
 */
async function showReportCardDistribution(): Promise<void> {
  const { query } = await import('./db')

  console.log('报卡状态分布:')

  try {
    const result = await query(`
      SELECT assign_status, audit_status, COUNT(*) as count
      FROM report_card
      WHERE deleted = 0
      GROUP BY assign_status, audit_status
      ORDER BY assign_status, audit_status
    `)

    for (const row of result as any[]) {
      console.log(`  ${row.assign_status.padEnd(12)} / ${row.audit_status.padEnd(10)} : ${row.count} 条`)
    }
  } catch (error) {
    printError('查询报卡状态分布失败')
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const startTime = Date.now()

  console.log('\n' + '█'.repeat(50))
  console.log('█' + ' '.repeat(48) + '█')
  console.log('█' + '  公共卫生平台 - 模拟数据生成脚本'.padEnd(48) + '█')
  console.log('█' + ' '.repeat(48) + '█')
  console.log('█'.repeat(50))

  const options = parseArgs()

  if (options.clean) {
    printWarn('⚠ 清理模式已启用，将清空现有数据！')
  }

  try {
    // 步骤 1: 生成病种数据
    const diseases = await generateDiseases(options.clean)

    // 步骤 2: 生成用户数据
    const users = await generateUsers(options.clean)

    // 步骤 3: 生成审核组数据
    const auditGroups = await generateAuditGroups(users, options.clean)

    // 步骤 4: 生成报卡数据
    const reportCards = await generateReportCards(diseases, users, auditGroups, options.clean)

    // 显示统计信息
    await showStatistics()
    await showReportCardDistribution()

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
    printSuccess(`\n✓ 数据生成完成！耗时 ${elapsed} 秒`)

    // 显示测试账号信息
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('测试账号信息:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    for (const user of users.admins) {
      console.log(`\n管理员账号:`)
      console.log(`  用户名: ${user.username}`)
      console.log(`  密码: 123456`)
      console.log(`  姓名: ${user.name}`)
    }

    for (const user of users.leaders) {
      console.log(`\n审核组长账号:`)
      console.log(`  用户名: ${user.username}`)
      console.log(`  密码: 123456`)
      console.log(`  姓名: ${user.name}`)
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    printError(`✗ 数据生成失败: ${error}`)
    process.exit(1)
  } finally {
    await closePool()
  }
}

// 运行主函数
main().catch(error => {
  console.error('未捕获的错误:', error)
  process.exit(1)
})
