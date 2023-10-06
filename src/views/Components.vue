<template>
  <div class="component-exercise">
    <selfModal title="提示" content="你今天吃了吗" v-model:show="show"> </selfModal>
    <button @click="showModal">打开</button>

    <button @click="submit">请求</button>

    <input id="input-text" />

    <tableView
      :table-data="tableData"
      :filter-config="tableConfig"
      @change="fetchTableData"
    ></tableView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, type Ref, shallowRef } from 'vue'
import selfModal from '../components/self-modal.vue'
import tableView from '../components/tableView/index.vue'
import { getList, getListNoStorage, getUserList } from '../api/index'
import type { TableColumn } from '@/components/tableView/types'
import type { TableConfig } from '@/components/tableView/types'

const show = ref(false)

const showModal = () => {
  show.value = true
}
const submit = () => {
  getList({ a: 1 }).then((res: any) => {
    console.log('getList', res)
  })
  getListNoStorage({ a: 1 }).then((res: any) => {
    console.log('getListNoStorage', res)
  })
}

const inputRef = shallowRef()
const observer = new MutationObserver((mutationsList) => {
  console.log('MutationObserver callback', mutationsList)
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.')
    } else if (mutation.type === 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.')
    }
  }
})
const config = { attributes: true, childList: true, subtree: true }
onMounted(() => {
  console.log(document.getElementById('input-text'))
  // observer.observe(inputRef.value as any, config);
  observer.observe(document.getElementById('input-text') as HTMLElement, config)
})

const tableData: Ref<Array<any>> = ref([])

const fetchTableData = (filterObj: any) => {
  let params: any = {}
  for (let key in filterObj) {
    let value = filterObj[key]
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value
    }
  }
  getUserList(params).then((res: any) => {
    if (res.code == '200') {
      tableData.value = res.data
    }
  })
}
// fetchTableData({})

const genderMap = new Map([
  [1, '男'],
  [2, '女']
])

const tableConfig: Ref<Array<TableConfig>> = ref([
  {
    key: 'name',
    label: '姓名',
    valueType: 'string',
    compType: 'input',
    needFilter: true
  },
  {
    key: 'nativePlace',
    label: '籍贯',
    valueType: 'string',
    compType: 'input',
    needFilter: true
  },
  {
    key: 'gender',
    label: '性别',
    valueType: 'number',
    compType: 'select',
    needFilter: true,
    options: [
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 2
      }
    ],
    renderFunc: (scoped: any) => {
      return genderMap.get(scoped.gender) || ''
    }
  },
  {
    key: 'age',
    label: '年龄',
    valueType: 'number',
    compType: 'number',
    needFilter: true
  },
  {
    key: 'nickName',
    label: '昵称',
    valueType: 'string',
    compType: 'input',
    needFilter: false
  }
])
</script>

<style lang="less" scoped></style>
