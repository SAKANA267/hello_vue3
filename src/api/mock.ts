import Mock from 'mockjs'
import userInfoApi from './mockData/userInfo'
import userApi from './mockData/userManagement'
import reportCardApi from './mockData/reportCard'
import './mockData/permission' // Mock 已在文件内部注册

// 登录接口始终使用 Mock（混合模式支持）
// Profile.vue
Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo)
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo)

// 只在 VITE_MOCK=true 时注册其他 Mock
if (import.meta.env.VITE_MOCK !== 'false') {
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

  // ReportCard Management.vue
  // ========== RESTful API 端点 ==========
  Mock.mock(RegExp('/api/report-cards(\\?.*)?$'), 'get', reportCardApi.getReportCards)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+[^/]$'), 'get', reportCardApi.getReportCardById)
  Mock.mock('/api/report-cards', 'post', reportCardApi.createReportCard)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+[^/]$'), 'put', reportCardApi.updateReportCard)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+[^/]$'), 'delete', reportCardApi.deleteReportCard)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+/approve'), 'put', reportCardApi.approveReportCard)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+/reject'), 'put', reportCardApi.rejectReportCard)
  Mock.mock(RegExp('/api/report-cards/[\\w-]+/withdraw'), 'put', reportCardApi.withdrawReportCard)
  Mock.mock('/api/report-cards/pending', 'get', reportCardApi.getPendingReportCards)
  Mock.mock('/api/report-cards/statistics', 'get', reportCardApi.getReportCardStatistics)
}
