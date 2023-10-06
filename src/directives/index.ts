import type { ObjectDirective, VNode, Ref } from 'vue'
import { ref, computed, reactive } from 'vue'

const singleItemHeight = 40
const buffer = 5

const clientHeight = ref(0)
const scrollTop = ref(0)

const tableData:Ref<any[]> = ref([])

const start = computed(() => {
  return Math.max(scrollTop.value / singleItemHeight - buffer, 0)
})

const over = computed(() => {
  return Math.min((scrollTop.value + clientHeight.value) / singleItemHeight + buffer, tableData.value.length)
})

const padding = computed(() => {
  const paddingTop = start.value * singleItemHeight
  const paddingBottom = (tableData.value.length - over.value) * singleItemHeight
  return [paddingTop, paddingBottom]
})

const vInfinteScroll: ObjectDirective = {
  mounted: (el: Element, bind, vnode) => {
    if (!el || !vnode) return
    // const self = vnode.appContext
    const target = el.querySelector('.el-scrollbar__wrap')
    if (!target) return
    // 检测触底
    // target.addEventListener('scroll', () => {
    //   if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
    //     over.value += 15
    //   }
    // })

    clientHeight.value = target.clientHeight
    target.addEventListener('scroll', () => {
      scrollTop.value = target.scrollTop
      clientHeight.value = target.clientHeight
      const _table = target.querySelector('table') as HTMLElement
      _table.style.paddingTop = padding.value[0] + 'px'
      _table.style.paddingBottom = padding.value[1] + 'px'
    })
  }
}

export { vInfinteScroll, start, over, tableData }