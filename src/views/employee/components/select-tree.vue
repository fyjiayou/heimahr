<template>
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="handleChange"
  />
</template>

<script>
import { getDeptList } from '@/api/department'
import { transList2TreeData } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      props: {
        label: 'name', // 要展示的字段
        value: 'id' // 要存储的字段
      },
      deptId: ''
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      const res = await getDeptList()
      this.treeData = transList2TreeData(res, 0)
    },
    handleChange(data) {
      if (data.length > 0) {
        this.$emit('input', data[data.length - 1])
      } else {
        this.$emit('input', null)
      }
    }

  }
}
</script>

<style>

</style>
