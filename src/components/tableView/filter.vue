<template>
  <el-form :inline="true">
    <el-form-item v-for="item in filterConfig" :key="item.key" :label="item.label" :prop="item.key">
      <!-- 修改前 -->
      <!-- <el-input v-if="item.compType === 'input'" v-model="formModel[item.key]"></el-input>
      
      
      <el-radio-group v-else-if="item.compType === 'radio'" v-model="formModel[item.key]">
        <el-radio v-for="opt in item.options" :key="opt.value" :label="opt.value">{{
          opt.label
        }}</el-radio>
      </el-radio-group>
     
      
      <el-select v-else-if="item.compType === 'select'" v-model="formModel[item.key]">
        <el-option
          v-for="opt in item.options"
          :key="opt.label"
          :label="opt.label"
          :value="opt.value"
        ></el-option>
      </el-select> -->

      <template v-if="supportComType.includes(item.compType)">
        <component :is="`el-${item.compType}`" v-model="formModel[item.key]">
          <template v-if="item.compType == 'select'">
            <el-option
              v-for="opt in item.options"
              :key="opt.label"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </template>
        </component>
      </template>

      <template v-else>
        <slot :name="item.key" :Form="formModel">
          <div class="default-slot">{{ formModel }}</div>
        </slot>
      </template>
    </el-form-item>
    <el-form-item>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs, watch } from 'vue'
import type { TableConfig } from './types'

const supportComType = ['input', 'select']

const props = defineProps({
  filterConfig: {
    type: Array<TableConfig>,
    default: () => []
  }
})

const emit = defineEmits(['change', 'search', 'reset'])
let formModel: any = {}
watch(
  props.filterConfig,
  (newVal) => {
    for (let config of newVal) {
      formModel[config.key] = undefined
    }
    formModel = reactive(formModel)
  },
  { immediate: true }
)

const submitModel = () => {
  emit('change', formModel)
  emit('search', formModel)
}

const reset = () => {
  for (let key in formModel) {
    formModel[key] = undefined
  }
  // submitModel()
  emit('change', formModel)
  emit('reset', formModel)
}

const submit = () => {
  submitModel()
}
</script>

<style lang="less" scoped></style>
