<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-07
 * CommonTable.vue
-->
<template>
    <!-- 桌面端表格布局 -->
    <div id="table" v-show="!isMobile">
        <el-table :data="tableData" border style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
            <el-table-column v-for="item in tableLabel" :label="item.label" :key="item.prop"
                :width="item.width ? item.width : ''" :prop="item.prop">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small"
                        style="color: #f56c6c">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 移动端卡片布局 -->
    <div class="mobile-cards" v-show="isMobile">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
                <template #default="props">
                    <div v-for="item in tableLabel" :key="item.prop" class="mobile-card-content">
                        <p v-if="item.prop !== 'name'">
                            {{ item.label }}: {{ props.row[item.prop] }}
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name" />
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small"
                        style="color: #f56c6c">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!--分页-->
    <div class="pagination">
        <el-pagination :background=!isMobile layout="prev, pager, next" :total="config.totle"
            :size="isMobile ? 'small' : 'large'" @current-change="handleChange" />
    </div>
</template>

<script setup>
/**
 * @component CommonTable
 * @description 通用表格组件，支持响应式布局，包含表格展示、分页、增删改查功能
 * @props {Array} tableLabel - 表格列配置数组，每个元素包含 prop(字段名)、label(显示名)、width(宽度)属性
 * @props {String} queryParams - 查询参数，用于表格数据筛选
 * @props {Function} getApi - 获取表格数据的API方法
 * @props {Function} deleteApi - 删除表格数据的API方法
 * @example
 * <CommonTable 
 *   :tableLabel="[
 *     { prop: 'date', label: '日期', width: '110' },
 *     { prop: 'name', label: '姓名', width: '80' }
 *   ]"
 *   :queryParams="searchKeyword"
 *   :getApi="getTableData"
 *   :deleteApi="deleteData"
 * />
 */

import { ref, onMounted, reactive, computed } from 'vue'

//组件属性定义
const props = defineProps({
    tableLabel: {
        type: Array,
        required: true,
        default: () => []
    },
    queryParams: {
        type: String,
        required: false,
        default: ''
    },
    getApi: {
        type: Function,
        required: false,
        default: () => ({})
    },
    deleteApi: {
        type: Function,
        required: false,
        default: () => ({})
    }
})

//表格数据
const tableData = ref([])

const config = reactive({
    name: '',
    totle: 0,
    page: 1,
})
const getTableData = async () => {
    const table = await props.getApi(config);
    tableData.value = table.list;
    console.log('tableData', table.list);
    config.totle = table.count;
    console.log('totle', config.totle);
}
//暴露搜索方法
const search = () => {
    config.name = props.queryParams || ''
    getTableData()
}

//分页
const handleChange = (page) => {
    config.page = page;
    getTableData()
}
//删除对象
const handleDelete = (val) => {
    ElMessageBox.confirm("是否确认删除该对象?", '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            try {
                console.log('要删除的对象id:', val.id);
                const res = await props.deleteApi({ id: val.id });
                console.log('res:', res);

                // 修改响应检查逻辑
                if (res && res.success) {
                    ElMessage({
                        showClose: true,
                        message: '删除成功',
                        type: 'success',
                    });
                    await getTableData();
                    console.log('删除了', val);
                } else {
                    throw new Error(res?.msg || '删除失败');
                }
            } catch (error) {
                console.error('删除操作失败:', error);
                ElMessage({
                    showClose: true,
                    message: error.message || '删除操作失败，请重试',
                    type: 'error',
                });
            }
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            });
        })
}

const emit = defineEmits(['edit'])
const handleEdit = (row) => {
    console.log('handleEdit()编辑对象:', row);
    emit('edit', row);
}


onMounted(() => {
    getTableData()
})

//响应式布局检测
const isMobile = ref(window.innerWidth <= 768)
const labelWidth = computed(() => isMobile.value ? '60px' : '100px')
window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768
})

// 使用defineExpose暴露方法
defineExpose({
    search
})
</script>

<style scoped>
.mobile-cards {
    display: none;
}

.mobile-card-content {
    margin-left: 20px;
}

#table {
    background: #fff;
    padding: 20px;
    border-radius: 2px;
    width: 90%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 768px) {

    /* 隐藏桌面端表格 */
    .table {
        display: none;
    }

    /* 显示移动端卡片布局 */
    .mobile-cards {
        display: block;
        width: 100%;
    }

    /* 调整分页宽度 */
    .pagination {
        width: 100%;
        padding: 10px;
    }
}

.pagination {
    display: flex;
    margin-top: 20px;
    justify-content: center;
}
</style>
