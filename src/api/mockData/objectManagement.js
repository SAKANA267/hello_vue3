import Mock from "mockjs";

function param2Obj(url){
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

let List = [];
const count = 200; // 模拟数据条数
for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            id : Mock.Random.guid(),
            name : Mock.Random.cname(),
            address: Mock.Random.county(true),
            date: Mock.Random.date(),
        })
    );
}

export default {
    getTableData:(config) => {
        const{ name, page = 1, limit = 15 } = param2Obj(config.url);

        const mockList = List.filter((item) => {
            if (name && item.name.indexOf(name) === -1) return false;
            return true;
        });

        const pageList = mockList.filter(
            (item,index) => index < limit * page && index >= limit * (page - 1)
        );
        return {
            code: 200,
            data: {
                list: pageList,
                count: mockList.length,
            },
        }
    },
};
