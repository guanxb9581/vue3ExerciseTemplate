import { request } from '../utils/request'
export const getList = (params: any) => {
  return request({
    url: '/getList',
    method: 'get',
    params: {
      ...params
    },
    need_storage: true
  })
}
export const getListNoStorage = (params: any) => {
  return request({
    url: '/getList2',
    method: 'get',
    params: {
      ...params
    },
  })
}

/**
 * 获取用户列表
 * @param params 
 * @returns 
 */
export const getUserList = (params: any) => {
  return request({
    url: '/api/user/list',
    method: 'post',
    data: params
  })
}
