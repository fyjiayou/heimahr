import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/sys/role',
    params: {
      page: 1,
      pagesize: 5
    }
  })
}
