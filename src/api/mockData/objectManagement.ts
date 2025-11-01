import type {TableItem} from "@/assets/types/objectTable";

export default {
    getTableData: (): { code: number; data: TableItem[] } => {
        return {
            code: 200,
            data: mockTableData
        }
    }
}

const mockTableData: TableItem[] = [
    {
        date: '2023-12-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    },
    {
        date: '2023-12-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
    },
    {
        date: '2023-12-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
    },
    {
        date: '2023-12-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
    }
]