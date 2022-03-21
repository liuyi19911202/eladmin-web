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

export function edit(data) {
  return request({
    url: 'api/doum/users/updateRemark',
    method: 'put',
    data
  })
}

export function execution(params) {
  return request({
    url: 'api/doum/users/getUser',
    method: 'post',
    params
  })
}

export function updateRemark(params) {
  return request({
    url: 'api/doum/users/updateRemark',
    method: 'put',
    params
  })
}

export default { del, edit, execution, add }
