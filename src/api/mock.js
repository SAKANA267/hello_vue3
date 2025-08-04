import Mock from 'mockjs';
import userInfoApi from './mockData/userInfo';

Mock.mock('/api/user/getUserInfo', 'get', userInfoApi.getUserInfo);
Mock.mock('/api/user/getLoginInfo', 'get', userInfoApi.getLoginInfo);