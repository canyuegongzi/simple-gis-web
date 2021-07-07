export const data = {
    list: [
        {
            entity: {
                id: 6,
                parentMenuId: 0,
                name: "baseManage",
                icon: "el-icon-news",
                alias: "基本要素",
                state: "ENABLE",
                sort: 1,
                value: null,
                type: "NONE",
                discription: "用于用户管理的菜单",
                createUserId: 1,
            },
            childs: [
                {
                    entity: {
                        id: 7,
                        parentMenuId: 6,
                        name: "/baseManage/marker",
                        icon: "el-icon-user\r\n",
                        alias: "点要素",
                        state: "ENABLE",
                        sort: 0,
                        value: "/baseManage/marker",
                        type: "NONE",
                        discription: "基本图层点信息",
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 7,
                        parentMenuId: 6,
                        name: "/baseManage/line",
                        icon: "el-icon-user\r\n",
                        alias: "线要素",
                        state: "ENABLE",
                        sort: 0,
                        value: "/baseManage/line",
                        type: "NONE",
                        discription: "基本图层点信息",
                        createUserId: 1,
                    },
                },
            ],
        }
    ],
};
