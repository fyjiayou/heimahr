import request from '@/utils/request'

export function getDeptList() {
  return request.get('/company/department')
}

export function getDeptMangerList() {
  return request.get('/sys/user/simple')
}

export function saveDept(data) {
  return request.post('/company/department', data)
}

export function getDeptDetail(id) {
  return request.get(`/company/department/${id}`)
}

export function updateDept(deptObj) {
  return request({
    method: 'put',
    url: `/company/department/${deptObj.id}`,
    data: deptObj
  })
}

export function delDept(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
