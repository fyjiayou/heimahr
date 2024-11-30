import request from '@/utils/request'

/**
 * 获取员工列表
 * @param  params
 * @returns
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    //  改变1接收数据的类型
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}

export function importEmployee(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // form-data类型 因为要上传文件类型
  })
}

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
