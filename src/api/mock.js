import Mock from 'mockjs';
import userInfoApi from './mockData/userInfo';
import objectApi from './mockData/objectManagement';

Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo);
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo);
Mock.mock(RegExp('/api/table/getTableData(\\?.*)?$'), 'get', objectApi.getObjectList);
Mock.mock(RegExp('/api/table/deleteObject(\\?.*)?$'), 'get', objectApi.deleteObject);
Mock.mock('/api/table/createObject', 'post', objectApi.createObject);