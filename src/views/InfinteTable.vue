<template>
  <div class="infinte-table">
    <el-table
      v-infinte-scroll
      :data="tableData.slice(start, over)"
      style="width: 100%"
      max-height="200"
    >
      <el-table-column prop="date" label="date" width="180"></el-table-column>
      <el-table-column prop="name" label="name" width="180"></el-table-column>
      <el-table-column prop="address" label="address"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
// let start: number = 0
// let over: number = 20

import { ref, computed } from 'vue'
// import type { ObjectDirective } from 'vue'
import axios from 'axios'

import { vInfinteScroll, start, over, tableData } from '../directives/index'

// const vInfinteScroll: ObjectDirective = {
//   mounted: (el: Element, bind, vnode) => {
//     if (!el || !vnode) return
//     // const self = vnode.appContext
//     const target = el.querySelector('.el-scrollbar__wrap')
//     if (!target) return
//     // 检测触底
//     // target.addEventListener('scroll', () => {
//     //   if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
//     //     over.value += 15
//     //   }
//     // })

//     clientHeight.value = target.clientHeight
//     target.addEventListener('scroll', () => {
//       scrollTop.value = target.scrollTop
//       clientHeight.value = target.clientHeight
//       const _table = target.querySelector('table') as HTMLElement
//       _table.style.paddingTop = padding.value[0] + 'px'
//       _table.style.paddingBottom = padding.value[1] + 'px'
//     })
//   }
// }

const fetchData = () => {
  let arr = []
  for (let i = 0; i < 500; i++) {
    arr.push({
      key: i + 1,
      date: '2016-05-03',
      name: `Tom${i}`,
      address: 'No. 189, Grove St, Los Angeles'
    })
  }
  return arr
}

// const getData = () => {
//   axios.get('http://localhost:4000/api1?a=2&b=3')
//   axios.post('http://localhost:4000/api2', { b: 888 }).then((res) => {
//     console.log(res)
//   })
// }
// getData()
tableData.value = fetchData()
</script>

<style scoped>
.infinte-table {
  width: 100%;
  height: 400px;
}
</style>
