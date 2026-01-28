import Mock from 'mockjs'
import userInfoApi from './mockData/userInfo'
import objectApi from './mockData/objectManagement'
import userApi from './mockData/userManagement'
import './mockData/permission' // Mock 已在文件内部注册

// Profile.vue
Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo)
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo)

// Object Management.vue
Mock.mock(RegExp('/api/table/getTableData(\\?.*)?$'), 'get', objectApi.getObjectList)
Mock.mock(RegExp('/api/table/deleteObject(\\?.*)?$'), 'get', objectApi.deleteObject)
Mock.mock('/api/table/createObject', 'post', objectApi.createObject)
Mock.mock('/api/table/updateObject', 'post', objectApi.updateObject)
Mock.mock('/api/table/auditPass', 'post', objectApi.auditPass)
Mock.mock('/api/table/auditReject', 'post', objectApi.auditReject)
Mock.mock('/api/table/auditRevoke', 'post', objectApi.auditRevoke)

// User Management.vue
Mock.mock(RegExp('/api/user/getUserList(\\?.*)?$'), 'get', userApi.getUserList)
Mock.mock(RegExp('/api/user/deleteUser(\\?.*)?$'), 'get', userApi.deleteUser)
Mock.mock('/api/user/createUser', 'post', userApi.createUser)
Mock.mock('/api/user/updateUser', 'post', userApi.updateUser)
