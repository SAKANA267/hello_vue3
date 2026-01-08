import Mock from 'mockjs';

function param2Obj(url) {
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
            id: Mock.Random.guid(),
            username: Mock.Random.word(5, 10),
            name: Mock.Random.cname(),
            email: Mock.Random.email(),
            phone: Mock.mock(/^1[3-9]\d{9}$/),
            role: Mock.Random.pick(['admin', 'user', 'editor']),
            status: Mock.Random.pick(['active', 'inactive']),
            createTime: Mock.Random.datetime(),
            lastLogin: Mock.Random.datetime(),
        })
    );
}

export default {
    getUserList: (config) => {
        const { username, name, role, status, page = 1, limit = 15 } = param2Obj(config.url);

        const mockList = List.filter((item) => {
            if (username && item.username.indexOf(username) === -1) return false;
            if (name && item.name.indexOf(name) === -1) return false;
            if (role && item.role !== role) return false;
            if (status && item.status !== status) return false;
            return true;
        });

        const pageList = mockList.filter(
            (item, index) => index < limit * page && index >= limit * (page - 1)
        );
        return {
            code: 200,
            data: {
                list: pageList,
                count: mockList.length,
            },
            msg: "获取成功",
        }
    },

    //删除用户
    deleteUser: (config) => {
        const { id } = param2Obj(config.url);

        if (!id) {
            return {
                code: 500,
                data: null,
                msg: "参数错误",
            };
        } else {
            List = List.filter((item) => item.id !== id);
            return {
                code: 200,
                data: { success: true }, 
                msg: "删除成功",
            };
        }
    },

    //添加用户
    createUser: (config) => {
        const { username, name, email, phone, role } = JSON.parse(config.body);
        List.unshift({
            id: Mock.Random.guid(),
            username: username,
            name: name,
            email: email,
            phone: phone,
            role: role,
            status: 'active',
            createTime: Mock.Random.datetime(),
            lastLogin: Mock.Random.datetime(),
        });
        return {
            code: 200,
            data: {success:true},
            msg: "添加成功",
        };
    },

    //更新用户
    updateUser: (config) => {
        const { id, username, name, email, phone, role, status } = JSON.parse(config.body);
        const index = List.findIndex(item => item.id === id);

        if (index === -1) {
            return {
                code: 500,
                data: null,
                msg: "用户不存在",
            };
        }

        List[index] = {
            ...List[index],
            username: username || List[index].username,
            name: name || List[index].name,
            email: email || List[index].email,
            phone: phone || List[index].phone,
            role: role || List[index].role,
            status: status || List[index].status,
            lastLogin: Mock.Random.datetime(),
        };

        return {
            code: 200,
            data: {success:true},
            msg: "更新成功",
        };
    }
};
