# 公共卫生平台 - 模拟数据生成脚本

## 📖 概述

这是一个用于生成公共卫生平台管理系统测试数据的脚本工具。该脚本会生成完整的模拟数据，包括病种信息、用户、审核组、报卡等，数据之间保持正确的关联关系。

## 🗄️ 生成的数据表

### 基础数据表
| 表名 | 说明 | 数据量 |
|------|------|--------|
| `disease_category` | 病种分类（甲类、乙类、丙类等） | 4 条 |
| `disease_type` | 疾病类型（鼠疫、霍乱、新冠肺炎等） | 14 条 |
| `sys_user` | 系统用户 | 17 条 |
| `audit_group` | 审核组 | 3 个 |
| `audit_group_member` | 审核组成员关系 | 12 条 |

### 业务数据表
| 表名 | 说明 | 数据量 |
|------|------|--------|
| `user_profile` | 用户扩展信息 | 17 条 |
| `login_history` | 登录历史记录 | 51 条 |
| `audit_group_work_stats` | 审核组工作统计 | 3 条 |
| `report_card` | 传染病报告卡 | 80 条 |
| `report_card_assignment` | 报卡分配记录 | 70 条 |
| `assignment_operation_log` | 分配操作日志 | 152 条 |

## 🚀 使用方法

### 1. 配置数据库连接

数据库连接信息已配置在 `.env.local` 文件中：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=public_health
```

如果需要修改数据库配置，请编辑项目根目录下的 `.env.local` 文件。

### 2. 运行脚本

```bash
# 生成模拟数据（跳过已有数据的表）
npm run mock:data

# 清空并重新生成所有数据
npm run mock:data -- --clean

# 显示帮助信息
npm run mock:data -- --help
```

## 📊 数据说明

### 用户角色分布

| 角色 | 数量 | 说明 |
|------|------|------|
| admin | 1 人 | 系统管理员 |
| auditor (leader) | 2 人 | 审核组组长 |
| auditor | 8 人 | 审核员 |
| user (reporter) | 6 人 | 报告医生 |

### 测试账号

所有账号的默认密码均为：**`123456`**

#### 管理员账号
```
用户名: admin
姓名: 系统管理员
角色: admin
```

#### 审核组长账号
```
用户名: leader1
姓名: 胡涛涛
角色: auditor (组长)

用户名: leader2
姓名: 王伟静
角色: auditor (组长)
```

#### 审核员账号
```
用户名: auditor1 ~ auditor8
角色: auditor
```

#### 报告医生账号
```
用户名: doctor1 ~ doctor6
角色: user
```

### 审核组配置

| 组名 | 组编码 | 说明 |
|------|--------|------|
| 传染病一组 | INFECT_GROUP_01 | 负责甲类和部分乙类传染病审核 |
| 传染病二组 | INFECT_GROUP_02 | 负责乙类和丙类传染病审核 |
| 结核病专项组 | TB_SPECIAL_GROUP | 负责结核病专项审核 |

每组约 4 名成员（含组长）。

### 报卡状态分布

报卡数据模拟了完整的业务流程状态：

| 分配状态 | 审核状态 | 数量 | 说明 |
|----------|----------|------|------|
| UNASSIGNED | PENDING | ~6 条 | 待分配 |
| ASSIGNED | PENDING | ~18 条 | 已分配，待接单 |
| IN_PROGRESS | PENDING | ~22 条 | 审核中 |
| COMPLETED | APPROVED | ~21 条 | 已通过 |
| COMPLETED | PENDING | ~6 条 | 已完成，待审核 |
| COMPLETED | REJECTED | ~3 条 | 已驳回 |
| VOID | REJECTED | ~4 条 | 已作废 |

### 疾种数据

#### 病种分类
1. **甲类传染病** - 鼠疫、霍乱（2小时上报）
2. **乙类传染病** - 新冠肺炎、艾滋病、病毒性肝炎、肺结核等（24小时上报）
3. **丙类传染病** - 流行性感冒、流行性腮腺炎等（24-48小时上报）
4. **其他传染病** - 手足口病、水痘等

#### 疾病类型（共14种）
- 甲类：鼠疫、霍乱
- 乙类：新型冠状病毒肺炎、艾滋病、病毒性肝炎、肺结核、伤寒、细菌性痢疾
- 丙类：流行性感冒、流行性腮腺炎、风疹、急性出血性结膜炎
- 其他：手足口病、水痘

## ⚙️ 配置选项

可以在 `config.ts` 中修改以下配置：

```typescript
// 数据量配置
counts: {
  diseaseCategories: 4,           // 病种分类数量
  diseaseTypesPerCategory: 4,      // 每个分类的疾病数量
  users: {
    admin: 1,                      // 管理员数量
    leader: 2,                     // 审核组长数量
    auditor: 8,                    // 审核员数量
    reporter: 6                    // 报告医生数量
  },
  auditGroups: 3,                  // 审核组数量
  membersPerGroup: 4,              // 每组平均成员数
  reportCards: 80,                 // 报卡数量
  loginHistoryPerUser: 3           // 每用户登录历史数量
}

// 状态分布配置
distributions: {
  reportCardStatus: {
    UNASSIGNED: 0.10,              // 10% 待分配
    ASSIGNED: 0.15,                // 15% 已分配
    IN_PROGRESS: 0.25,             // 25% 审核中
    COMPLETED: 0.45,               // 45% 已完成
    VOID: 0.05                     // 5% 已作废
  },
  auditStatus: {
    PENDING: 0.30,                 // 30% 待审核
    APPROVED: 0.60,                // 60% 已通过
    REJECTED: 0.10                 // 10% 已驳回
  },
  priority: {
    LOW: 0.10,                     // 10% 低优先级
    NORMAL: 0.70,                  // 70% 普通优先级
    HIGH: 0.15,                    // 15% 高优先级
    URGENT: 0.05                   // 5% 紧急优先级
  }
}

// 测试配置
defaultPassword: '123456'          // 默认测试密码
dateRange: {
  past: 30                         // 数据时间范围（过去30天）
}
```

## 📂 文件结构

```
src/scripts/mock-data/
├── README.md              # 本文档
├── index.ts               # 主入口脚本
├── db.ts                  # 数据库连接模块
├── config.ts              # 配置文件
├── utils.ts               # 工具函数
├── generators/            # 数据生成器
│   ├── diseases.ts       # 病种数据生成器
│   ├── users.ts          # 用户数据生成器
│   ├── auditGroups.ts    # 审核组数据生成器
│   └── reportCards.ts    # 报卡数据生成器
└── data/                  # 预设数据
    ├── diseaseCategories.ts
    └── hospitals.ts
```

## 🔄 数据生成顺序

脚本按照以下顺序生成数据，确保外键关联正确：

```
1. disease_category (病种分类)
   ↓
2. disease_type (疾病类型)
   ↓
3. sys_user (系统用户)
   ↓
4. user_profile (用户扩展)
5. login_history (登录历史)
   ↓
6. audit_group (审核组)
   ↓
7. audit_group_member (审核组成员)
8. audit_group_work_stats (审核组统计)
   ↓
9. report_card (报卡)
   ↓
10. report_card_assignment (报卡分配)
    ↓
11. assignment_operation_log (操作日志)
```

## ⚠️ 注意事项

### 1. 幂等性
- 默认情况下，如果表中已有数据，脚本会跳过该表的生成
- 使用 `--clean` 选项会清空相关表的数据并重新生成

### 2. 数据清理
清理模式下，脚本会按照以下顺序清空表：
1. 先清空子表（有外键的表）
2. 再清空父表
3. 遵循外键约束避免错误

### 3. 密码安全
- 所有测试账号使用相同的默认密码 `123456`
- 仅用于开发和测试环境
- 生产环境请勿使用此脚本

### 4. 数据时间范围
- 所有数据的时间戳在过去 30 天内随机生成
- 模拟真实的时间序列（创建时间 < 分配时间 < 完成时间）

## 🔧 故障排查

### 数据库连接失败
```
Error: Access denied for user 'root'@'localhost'
```
**解决方案**：检查 `.env.local` 文件中的数据库密码是否正确

### 外键约束错误
```
Error: Cannot delete or update a parent row: a foreign key constraint fails
```
**解决方案**：使用 `--clean` 选项，脚本会按正确顺序清空表

### 表已存在数据
```
⚠ 数据库中已存在病种数据，跳过生成
```
**解决方案**：使用 `--clean` 选项清空并重新生成

## 📝 验证数据

生成完成后，可以使用以下 SQL 验证数据完整性：

```sql
-- 检查各表记录数
SELECT 
    'disease_category' as table_name, COUNT(*) as count FROM disease_category
UNION ALL SELECT 'disease_type', COUNT(*) FROM disease_type
UNION ALL SELECT 'sys_user', COUNT(*) FROM sys_user
UNION ALL SELECT 'audit_group', COUNT(*) FROM audit_group
UNION ALL SELECT 'report_card', COUNT(*) FROM report_card;

-- 检查外键关联完整性
SELECT COUNT(*) as orphaned_cards 
FROM report_card rc 
LEFT JOIN sys_user u ON rc.auditor_id = u.id 
WHERE rc.auditor_id IS NOT NULL AND u.id IS NULL;

-- 检查状态分布
SELECT assign_status, audit_status, COUNT(*) as count 
FROM report_card 
GROUP BY assign_status, audit_status;

-- 检查审核组成员
SELECT ag.group_name, COUNT(agm.user_id) as member_count
FROM audit_group ag
LEFT JOIN audit_group_member agm ON ag.id = agm.group_id
GROUP BY ag.id, ag.group_name;
```

## 🎯 典型使用场景

### 场景1：开发环境初始化
```bash
npm run mock:data -- --clean
```

### 场景2：添加新的测试数据
修改 `config.ts` 中的数据量配置，然后运行：
```bash
npm run mock:data -- --clean
```

### 场景3：重置特定功能模块
```bash
# 只清空并重新生成报卡相关数据
# 手动在数据库中执行：
DELETE FROM assignment_operation_log;
DELETE FROM report_card_assignment;
DELETE FROM report_card;
# 然后运行脚本
npm run mock:data
```

## 📞 技术支持

如有问题或建议，请联系开发团队。

---

**最后更新**: 2026-04-15
**版本**: 1.0.0
