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

