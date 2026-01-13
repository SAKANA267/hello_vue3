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
    getObjectList:(config) => {
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
                success: true,
                list: pageList,
                count: mockList.length,
            },
            msg: "获取成功",
        }
    },

    //删除对象
    deleteObject:(config) => {
        const{id} = param2Obj(config.url);

        if(!id){
            return {
                code: 500,
                data: {success: false},
                msg: "参数错误",
            };
        } else{
            List = List.filter((item) => item.id !== id);
            return {
                code: 200,
                data: {success: true},
                msg: "删除成功",
            };
        }
    },

    //添加对象
    createObject:(config) => {
        const { name, address, date } = JSON.parse(config.body);
        List.unshift({
            id: Mock.Random.guid(),
            name: name,
            address: address,
            date: date,
        });
        return {
            code: 200,
            data: {success: true},
            msg: "添加成功",
        };
    },
    //更新用户
    updateObject: (config) => {
    const { id, name, address, date } = JSON.parse(config.body);
    const index = List.findIndex(item => item.id === id);

    if (index === -1) {
        return {
            code: 500,
            data: {success: false},
            msg: "对象不存在",
        };
    }

    List[index] = {
        ...List[index],
        name: name || List[index].name,
        address: address || List[index].address,
        date: date || List[index].date,
    };

    return {
        code: 200,
        data: {success: true},
        msg: "更新成功",
    };
}

};
