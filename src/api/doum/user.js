import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/doum/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/doum/users',
    method: 'delete',
    data: ids
  })
}

export function execution(params) {
  return request({
    url: 'api/doum/users/getUser',
    method: 'get',
    params
  })
}

export default { del, execution, add }
