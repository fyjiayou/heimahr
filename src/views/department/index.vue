<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示属性结构 -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <!-- 节点结构 -->
        <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据。 -->
        <!-- v-slot="{node ,data}" 只能作用在template标签 -->
        <template v-slot="{data}">
          <el-row
            style="width: 100%; height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col> {{ data.name }}</el-col>
            <el-col :span="8">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参。表示类型 -->
              <el-dropdown @command="operateDept($event,data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>

      </el-tree>
    </div>

    <!-- 放置弹层组件 -->
    <!-- .sync表示会接收子组件的事件 update:showDialog, 值 ==> 属性 -->
    <add-dept
      :current-node-id="currentNodeId"
      :show-dialog.sync="showDialog"
      @updateDepartment="getDepartment"
    />
  </div>
</template>
<script>
import { getDeptList } from '@/api/department'
import { transList2TreeData } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    addDept
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name' // 要显示的字段名称
      },
      showDialog: false,
      currentNodeId: null

    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async  getDepartment() {
      const res = await getDeptList()
      this.depts = transList2TreeData(res, 0)
    },
    operateDept(type, id) {
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id
      }
    }

  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 20px;
}
</style>
