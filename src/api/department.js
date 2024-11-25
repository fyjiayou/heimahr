import request from '@/utils/request'

export function getDeptList() {
  return request.get('/company/department')
}
