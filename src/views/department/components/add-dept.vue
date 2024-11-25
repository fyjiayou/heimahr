<template>
  <el-dialog
    title="新增部门"
    :visible="showDialog"
    width="30%"
    @close="closeDialog"
  >
    <el-form
      ref="addDept"
      :model="deptObj"
      :rules="deptRules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="deptObj.name"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="deptObj.code"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select
          v-model="deptObj.managerId"
          placeholder="请选择负责人"
          style="width: 80%"
          size="mini"
        >
          <el-option v-for="item in mangerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="deptObj.introduce"
          type="textarea"
          placeholder="1-100个字符"
          :rows="4"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="onAddDept">确定</el-button>
            <el-button size="mini" @click="closeDialog">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDeptList, getDeptMangerList, saveDept } from '@/api/department'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      deptObj: {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      },
      mangerList: [],
      deptRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: async(rule, val, callback) => {
              const res = await getDeptList()
              if (res.some(item => item.name === val)) {
                callback(new Error('部门名称已存在'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: async(rule, val, callback) => {
              const res = await getDeptList()
              if (res.some(item => item.code === val)) {
                callback(new Error('部门编码已存在'))
              } else {
                callback()
              }
            }
          }

        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }

        ],
        introduce: [
          { required: true, message: '部门描述不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '部门描述的长度为1-100个字符', trigger: 'blur' }

        ]
      }
    }
  },
  created() {
    this.getMangerList()
  },
  methods: {
    closeDialog() {
      this.$refs.addDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false) // 关闭弹层
    },
    async getMangerList() {
      const res = await getDeptMangerList()
      console.log(res)
      this.mangerList = res
    },
    onAddDept() {
      this.$refs.addDept.validate(async isOk => {
        if (isOk) {
          await saveDept({ ...this.deptObj, pid: this.currentNodeId })
          this.$emit('updateDepartment')
          this.$message.success('新增部门成功')
          this.closeDialog()
        }
      })
    }
  }
}
</script>

<style>
</style>
