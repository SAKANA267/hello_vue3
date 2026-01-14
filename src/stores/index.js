import { defineStore } from "pinia";
import { ref } from "vue";

function initState() {
    return {
        isCollapse: true,
        tags: [
            {
                name: 'home',
                path: '/home',
                label: '首页',
                icon: ''
            },
        ],
        currentMenu: null,
    }
}
export const useAllDataStore = defineStore('allData', () => {
    const state = ref(initState());

    // stores/index.js
    function selectMenu(val) {
        if (val.route !== '/home') {  // 使用 route 而不是 name
            // 检查标签是否已存在
            const index = state.value.tags.findIndex(item => item.route === val.route)
            if (index === -1) {
                // 不存在则添加新标签，转换数据格式
                state.value.tags.push({
                    name: val.index,        // 使用 index 作为 name
                    path: val.route,        // 使用 route 作为 path
                    label: val.title,       // 使用 title 作为 label
                    icon: val.icon || ''    // 如果有 icon 就使用，没有就为空
                })
            }
            // 更新当前菜单
            state.value.currentMenu = {
                name: val.index,
                path: val.route,
                label: val.title,
                icon: val.icon || ''
            }
        }
    }

    return {
        state,
        selectMenu,
    }
});