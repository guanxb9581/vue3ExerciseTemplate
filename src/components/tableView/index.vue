<template>
  <div class="table-view">
    <div class="filter-block">
      <!-- 尽量把组件分开 -->
      <filterComp :filter-config="filterConfig" @change="changeHandle">
        <template v-slot:age="{ Form }">
          <el-input-number v-model="Form.age"></el-input-number></template
      ></filterComp>
    </div>
    <el-table :data="tableData">
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      >
        <template v-if="item.renderFunc" #default="scope">
          <span>{{ item.renderFunc(scope.row) }}</span></template
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { TableConfig, TableColumn } from './types'
import filterComp from './filter.vue'
import { computed, type Ref } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  filterConfig: {
    type: Array<TableConfig>,
    default: () => []
  }
})

const columns: Ref<Array<TableColumn>> = computed((): Array<TableColumn> => {
  return props.filterConfig.map((item) => {
    const { key, label, renderFunc } = item
    return {
      key,
      label,
      width: 120,
      renderFunc
    }
  })
})

const emit = defineEmits(['change'])
const changeHandle = (obj) => {
  emit('change', obj)
}
</script>

<style lang="less" scoped></style>
