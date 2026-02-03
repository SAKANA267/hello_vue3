import Mock from 'mockjs'
import userInfoApi from './mockData/userInfo'
import objectApi from './mockData/objectManagement'
import userApi from './mockData/userManagement'
import './mockData/permission' // Mock 已在文件内部注册

// 登录接口始终使用 Mock（混合模式支持）
// Profile.vue
Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo)
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo)

// 只在 VITE_MOCK=true 时注册其他 Mock
if (import.meta.env.VITE_MOCK !== 'false') {
  // Object Management.vue
  Mock.mock(RegExp('/api/table/getTableData(\\?.*)?$'), 'get', objectApi.getObjectList)
  Mock.mock(RegExp('/api/table/deleteObject(\\?.*)?$'), 'get', objectApi.deleteObject)
  Mock.mock('/api/table/createObject', 'post', objectApi.createObject)
  Mock.mock('/api/table/updateObject', 'post', objectApi.updateObject)
  Mock.mock('/api/table/auditPass', 'post', objectApi.auditPass)
  Mock.mock('/api/table/auditReject', 'post', objectApi.auditReject)
  Mock.mock('/api/table/auditRevoke', 'post', objectApi.auditRevoke)

  // User Management.vue
  // ========== RESTful API 端点 ==========
  Mock.mock(RegExp('/api/users(\\?.*)?$'), 'get', userApi.getUsers)
  Mock.mock(RegExp('/api/users/[\\w-]+'), 'get', userApi.getUserById)
  Mock.mock('/api/users', 'post', userApi.createUser)
  Mock.mock(RegExp('/api/users/[\\w-]+'), 'put', userApi.updateUser)
  Mock.mock(RegExp('/api/users/[\\w-]+'), 'delete', userApi.deleteUser)
  Mock.mock('/api/users/batch', 'delete', userApi.batchDeleteUsers)
  Mock.mock(RegExp('/api/users/search(\\?.*)?$'), 'get', userApi.searchUsers)
  Mock.mock(RegExp('/api/users/[\\w-]+/activate'), 'put', userApi.activateUser)
  Mock.mock(RegExp('/api/users/[\\w-]+/deactivate'), 'put', userApi.deactivateUser)
  Mock.mock(RegExp('/api/users/[\\w-]+/password'), 'put', userApi.changePassword)
  Mock.mock(RegExp('/api/users/check/username(\\?.*)?$'), 'get', userApi.checkUsername)
}
