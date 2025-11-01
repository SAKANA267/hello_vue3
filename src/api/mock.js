import Mock from 'mockjs';
import userInfoApi from './mockData/userInfo';
import tableApi from './mockData/objectManagement';

Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo);
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo);
Mock.mock('/api/table/getTableData', 'get', tableApi.getTableData);