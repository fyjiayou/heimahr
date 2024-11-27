<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button
          type="primary"
          size="mini"
          @click="showDialog = true"
        >添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column
          prop="name"
          align="center"
          width="200px"
          label="角色"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <!-- v-slot必须作用在template标签上 -->
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" size="mini" />
            <span v-else>{{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" type="textarea" size="mini" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <template v-if="!row.isEdit">
              <el-button size="mini" type="text">分配权限</el-button>
              <el-button size="mini" type="text" @click="onEditBtn(row)">编辑</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="primary" @click="editRowData(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" style="height: 60px" align="middle">
        <el-pagination
          layout="prev, pager, next"
          :total="pageParams.total"
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          @current-change="changePage"
        />
      </el-row>
    </div>

    <el-dialog title="新增角色" :visible.sync="showDialog" width="30%" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleObj"
        :rules="roleRules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleObj.name" style="width: 300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
            v-model="roleObj.state"
            :active-value="1"
            :inactive-value="0"
            size="mini"
          />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input
            v-model="roleObj.description"
            type="textarea"
            :row="3"
            style="width: 300px"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="onAddRole">确认</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
          <el-form-item /> </el-form-item></el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addRole, getRoleList, updateRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      pageParams: {
        page: 1,
        pagesize: 6,
        total: 0
      },
      showDialog: false,
      roleObj: {
        name: '',
        description: '',
        state: 0 // ，默认未启用
      },
      roleRules: {
        name: [{ required: true, message: '角色类型不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色类型不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      console.log('总条数：', total)
      this.pageParams.total = total
      this.list = rows
      this.list.forEach(item => {
        // item.isEdit = false // 添加一个属性，初始值false
        // 数据响应式的问题 数据变化 视图更新
        // 添加的动态属性，不具备响应式特点
        // this.$set(目标对象,属性名称,默认值) 可以针对目标对象，添加属性，具备响应式
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    onAddRole() {
      this.$refs.roleForm.validate(async isOk => {
        await addRole(this.roleObj)
        this.$message.success('添加角色成功')
        this.getRoleList()
        this.btnCancel()
      })
    },
    btnCancel() {
      this.roleObj = {
        name: '',
        description: '',
        state: 0 // ，默认未启用
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    onEditBtn(row) {
      row.isEdit = true
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async editRowData(row) {
      console.log(row.editRow)
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        // 更新显示的数据
        // row.name = row.editRow.name
        Object.assign(row, {
          // name: row.editRow.name,
          // state: row.editRow.state,
          // description: row.editRow.description
          ...row.editRow,
          isEdit: false
        }) // 规避eslint的误判
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
