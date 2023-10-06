<template>
  <div class="modal" v-if="show">
    <div class="mask"></div>
    <div class="fixed modal-content">
      <slot name="title">
        <div class="padding-lr ver-center space-between">
          <div>{{ title }}</div>
          <div @click="close">X</div>
        </div>
      </slot>
      <slot name="content">
        <div class="padding content">
          {{ content }}
        </div>
      </slot>
      <slot name="button">
        <div class="padding flex button">
          <button @click="confirm">确认</button>
          <button @click="cancel">取消</button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const emit = defineEmits(['update:show', 'confirm', 'cancel', 'close'])
defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  }
})

const hidden = () => {
  emit('update:show', false)
}

const close = () => {
  hidden()
  emit('close')
}
const confirm = () => {
  hidden()
  emit('confirm')
}
const cancel = () => {
  hidden()
  emit('cancel')
}
</script>

<style lang="less" scoped>
.modal{
  position: fixed;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
.button {
  border-top: 1px solid #000;
  &:first-child {
    margin-right: 20px;
  }
}
.modal-content{
  width: 50%;
  margin: 50px auto 50px;
  background: white;
}
</style>
