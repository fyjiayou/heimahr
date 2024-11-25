<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示属性结构 -->
      <el-tree default-expand-all :data="depts" :props="defaultProps">
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
              <el-dropdown>
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item></el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>

      </el-tree>
    </div>
  </div>
</template>
<script>
import { getDeptList } from '@/api/department'
import { transList2TreeData } from '@/utils'
export default {
  name: 'Department',
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name' // 要显示的字段名称
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async  getDepartment() {
      const res = await getDeptList()
      this.depts = transList2TreeData(res, 0)
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
