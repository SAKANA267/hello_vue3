import Mock from 'mockjs';
import userInfoApi from './mockData/userInfo';
import objectApi from './mockData/objectManagement';
import userApi from './mockData/userManagement';
import permissionApi from './mockData/permission';

// Profile.vue
Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo);
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo);

// Object Management.vue
Mock.mock(RegExp('/api/table/getTableData(\\?.*)?$'), 'get', objectApi.getObjectList);
Mock.mock(RegExp('/api/table/deleteObject(\\?.*)?$'), 'get', objectApi.deleteObject);
Mock.mock('/api/table/createObject', 'post', objectApi.createObject);
Mock.mock('/api/table/updateObject', 'post', objectApi.updateObject);

// User Management.vue
Mock.mock(RegExp('/api/user/getUserList(\\?.*)?$'), 'get', userApi.getUserList);
Mock.mock(RegExp('/api/user/deleteUser(\\?.*)?$'), 'get', userApi.deleteUser);
Mock.mock('/api/user/createUser', 'post', userApi.createUser);
Mock.mock('/api/user/updateUser', 'post', userApi.updateUser);

// Login.vue
Mock.mock('/api/permission/getMenu', 'post', permissionApi.getMenu);
