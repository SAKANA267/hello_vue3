<!--
 * AuditDialog.vue
 * @description 审核对话框组件
 * @author: SAKANA267
 * @since: 2025-01-22
-->
<template>
    <el-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="审核详情" width="600px">
        <el-descriptions border :column="1" v-if="rowData">
            <el-descriptions-item v-for="field in auditDetailFields" :key="field" :label="getFieldLabel(field)">
                {{ rowData[field] }}
            </el-descriptions-item>
        </el-descriptions>
        <el-form label-position="top" style="margin-top: 20px;">
            <el-form-item label="审核备注">
                <el-input v-model="remark" type="textarea" :rows="3" placeholder="请输入审核备注（选填）" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="success" @click="handleAudit('pass')">通过</el-button>
            <el-button type="danger" @click="handleAudit('reject')">不通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
/**
 * @component AuditDialog
 * @description 审核对话框组件
 * @props {Boolean} modelValue - 对话框显示状态（v-model）
 * @props {Object} rowData - 待审核的数据行
 * @props {Array} tableLabel - 表格列配置，用于获取字段标签
 * @props {Array} auditDetailFields - 审核对话框展示的字段列表
 * @emits update:modelValue - 更新对话框显示状态
 * @emits audit - 触发审核操作 { action: 'pass' | 'reject', rowData: Object, remark: String }
 */

import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    rowData: {
        type: Object,
        default: null
    },
    tableLabel: {
        type: Array,
        default: () => []
    },
    auditDetailFields: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue', 'audit'])

const remark = ref('')

// 监听对话框打开，清空备注
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        remark.value = ''
    }
})

// 获取字段标签
const getFieldLabel = (prop) => {
    const field = props.tableLabel.find(item => item.prop === prop)
    return field ? field.label : prop
}

// 处理取消
const handleCancel = () => {
    emit('update:modelValue', false)
}

// 处理审核操作
const handleAudit = (action) => {
    emit('audit', {
        action,
        rowData: props.rowData,
        remark: remark.value
    })
}
</script>

<style scoped>
/* 对话框样式继承自 Element Plus */
</style>
