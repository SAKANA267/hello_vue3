<!--
 * 审核组成员管理对话框
 * @since: 2026-03-31
 * AuditGroupMemberDialog.vue
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`成员管理 - ${groupName}`"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="member-dialog-content">
      <!-- 成员列表 -->
      <div class="member-list-section">
        <div class="section-header">
          <h4>当前成员 ({{ members.length }})</h4>
          <el-button type="primary" size="small" @click="showAddMemberDialog = true">
            添加成员
          </el-button>
        </div>
        <el-table :data="members" style="width: 100%" max-height="300">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="role" label="角色" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.role === 'ADMIN'" type="warning">管理员</el-tag>
              <el-tag v-else type="success">审核员</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'ACTIVE'" type="success">启用</el-tag>
              <el-tag v-else type="info">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="joinTime" label="加入时间" min-width="160" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.userId !== leaderId"
                link
                type="primary"
                size="small"
                :disabled="!hasPermission('audit:group:manage')"
                @click="handleSetLeader(row)"
              >
                设为组长
              </el-button>
              <el-tag v-else type="danger" size="small">组长</el-tag>
              <el-button
                v-if="row.userId !== leaderId && hasPermission('audit:group:manage')"
                link
                type="danger"
                size="small"
                @click="handleRemoveMember(row)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 组长信息 -->
      <div v-if="leaderId" class="leader-info">
        <el-alert :title="`当前组长: ${leaderName}`" type="info" :closable="false" show-icon />
      </div>
    </div>

    <!-- 添加成员对话框 -->
    <el-dialog v-model="showAddMemberDialog" title="添加成员" width="600px" append-to-body>
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="用户">
          <el-select
            v-model="addForm.selectedUsers"
            multiple
            filterable
            placeholder="请选择要添加的用户"
            style="width: 100%"
          >
            <el-option
              v-for="user in availableUsers"
              :key="user.id"
              :label="`${user.name} (${user.username})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddMemberDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddMembers">确定</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { AuditGroupMemberDTO, UserDTO } from '@/api/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePermissions } from '@/composables/usePermissions'

interface Props {
  visible: boolean
  groupId: string
  groupName: string
  leaderId?: string
  leaderName?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  refresh: []
}>()

const { hasPermission } = usePermissions()
const instance = getCurrentInstance()
const proxy = instance?.proxy

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const members = ref<AuditGroupMemberDTO[]>([])
const showAddMemberDialog = ref(false)
const addForm = ref({
  selectedUsers: [] as string[]
})
const availableUsers = ref<UserDTO[]>([])
const loading = ref(false)

// 获取可用用户列表
const fetchAvailableUsers = async () => {
  try {
    const response = await proxy?.$api.getUsers()
    // 过滤掉已经是成员的用户
    const memberIds = members.value.map(m => m.userId)
    availableUsers.value = response.records.filter((u: UserDTO) => !memberIds.includes(u.id))
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 获取成员列表
const fetchMembers = async () => {
  loading.value = true
  try {
    const data = await proxy?.$api.getAuditGroupMembers(props.groupId)
    members.value = data
    // 获取可用用户列表
    await fetchAvailableUsers()
  } catch (error) {
    console.error('获取成员列表失败:', error)
    ElMessage.error('获取成员列表失败')
  } finally {
    loading.value = false
  }
}

// 添加成员
const handleAddMembers = async () => {
  if (addForm.value.selectedUsers.length === 0) {
    ElMessage.warning('请选择要添加的用户')
    return
  }

  try {
    await proxy?.$api.addGroupMembers({
      groupId: props.groupId,
      userIds: addForm.value.selectedUsers
    })

    ElMessage.success('成员添加成功')
    addForm.value.selectedUsers = []
    showAddMemberDialog.value = false
    await fetchMembers()
    emit('refresh')
  } catch (error: any) {
    ElMessage.error(error.message || '添加成员失败')
  }
}

// 移除成员
const handleRemoveMember = async (member: AuditGroupMemberDTO) => {
  try {
    await ElMessageBox.confirm(`确认移除成员"${member.name}"吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await proxy?.$api.removeGroupMembers({
      groupId: props.groupId,
      userIds: [member.userId]
    })

    ElMessage.success('成员移除成功')
    await fetchMembers()
    emit('refresh')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '移除成员失败')
    }
  }
}

// 设置组长
const handleSetLeader = async (member: AuditGroupMemberDTO) => {
  try {
    await ElMessageBox.confirm(`确认将"${member.name}"设置为组长吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await proxy?.$api.setAuditGroupLeader(props.groupId, member.userId)

    ElMessage.success('组长设置成功')
    await fetchMembers()
    emit('refresh')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '设置组长失败')
    }
  }
}

const handleClose = () => {
  dialogVisible.value = false
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchMembers()
    }
  }
)
</script>

<style scoped lang="less">
.member-dialog-content {
  .member-list-section {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }

  .leader-info {
    margin-top: 16px;
  }
}
</style>
