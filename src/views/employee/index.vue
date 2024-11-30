<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeVal"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          :data="depts"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          highlight-current
          node-key="id"
          @current-change="selectedNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{row}">
              <el-button size="mini" type="text">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>

<script>
import { getDeptList } from '@/api/department'
import { transList2TreeData } from '@/utils'
import { delEmployee, exportEmployee, getEmployeeList } from '@/api/employee'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        keyword: '',
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      showExcelDialog: false
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      const res = await getDeptList()
      this.depts = transList2TreeData(res, 0)
      this.queryParams.departmentId = this.depts[0].id
      // 树组件的渲染是异步的，等到更新完毕
      this.$nextTick(() => {
        console.log(this.queryParams.departmentId)
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候参数记录了id
      this.getEmployeeList()
    },
    // 记录树的节点
    selectedNode(node) {
      console.log(node)
      this.queryParams.departmentId = node.id
      this.getEmployeeList()
      this.queryParams.page = 1
    },
    async getEmployeeList() {
      const res = await getEmployeeList(this.queryParams)
      this.list = res.rows
      this.total = res.total
    },
    changePage(newPage) {
      // 切换页码
      console.log(newPage)
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    changeVal() {
      console.log(this.queryParams.keyword)
      // 防抖，单位时间内只执行最后一次
      clearTimeout(this.timer) // 清除上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    },
    async exportEmployee() {
      const res = await exportEmployee()
      FileSaver.saveAs(res, '员工信息表.xlsx')
    },
    async confirmDel(id) {
      console.log(id)
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      this.getEmployeeList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
