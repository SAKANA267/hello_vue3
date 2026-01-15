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
        menuList: [],
        token: '',
    }
}
export const useAllDataStore = defineStore('allData', () => {
    const state = ref(initState());

    // CommonAside.vue tags 标签栏操作
    function selectMenu(val) {//传入值为对象 eg：index: '1-1', title: '对象管理', route: '/objectManagement'
        if (val.route !== '/home') { 
            // 检查标签是否已存在
            const index = state.value.tags.findIndex(item => item.path === val.route)
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
    
    // login.vue 根据用户更新菜单列表
    function updateMenuList(newMenuList) {
        state.value.menuList = newMenuList;
    }
    return {
        state,
        selectMenu,
        updateMenuList,
    }
});