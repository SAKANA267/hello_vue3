import { defineStore } from "pinia";
import { ref } from "vue";

function initState() { 
    return{
        isCollapse: true,
    }
}
export const useAllDataStore = defineStore('allData', () => {
    const state = ref(initState());

    return {
        state,
    }
});