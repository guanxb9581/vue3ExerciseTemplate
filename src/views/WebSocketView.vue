<template>
  <div class="websocket">
    <el-input :rows="15" type="textarea" v-model="textContent" readonly></el-input>

    <div class="input-box">
      <el-input type="text" v-model="text"></el-input>
      <el-button @click="sendMessage">Send</el-button>
      <el-button @click="connectServer">Connect</el-button>
      <el-button @click="disConnect">DisConnect</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

type wsMessage = {
  code: number
  message: string | number
  fromClient?: string
}

let socket: WebSocket | null = null
let clientName = ''

const disConnect = () => {
  socket!.close(501, 'client close')
}

const isSocketOpen = () => {
  return socket && socket.readyState === WebSocket.OPEN
}
/**
 * 连接服务器
 */
const connectServer = () => {
  if (isSocketOpen()) return
  socket = new WebSocket('ws://localhost:3000/websocket')
  console.log(socket)
  // Connection opened
  socket.addEventListener('open', function (event) {
    clientName = 'client' + new Date().getTime().toString()
    const msg: wsMessage = {
      code: socket!.OPEN,
      message: 'Hello Server',
      fromClient: clientName
    }
    socket!.send(stringfyMessage(msg))
  })

  // Listen for messages
  socket.addEventListener('message', function (event) {
    textContent.value = combineMessage(textContent.value, event.data)
  })
  socket.addEventListener('error', (ev) => {
    console.log('websocket error', ev)
  })
}

/**
 * 显示服务端返回数据
 */
const combineMessage = (prevStr: string, input: string) => {
  let wsMsg: wsMessage = parseMessage(input)
  if (!prevStr) return wsMsg.message.toString()

  return prevStr + '\n' + wsMsg.message.toString()
}

const textContent = ref('')
const text = ref('')
const sendMessage = () => {
  if (!isSocketOpen()) return
  try {
    const messageItem: wsMessage = {
      code: 100,
      message: text.value,
      fromClient: clientName
    }
    socket!.send(stringfyMessage(messageItem))
  } catch (error) {
    console.log(error)
  } finally {
    text.value = ''
  }
}

const stringfyMessage = (input: Object) => {
  return JSON.stringify(input)
}
const parseMessage = (str: string) => {
  return JSON.parse(str)
}

onMounted(() => {})
</script>

<style lang="less">
.flex {
  display: flex;
}
.input-box {
  display: flex;
  align-items: center;
}
</style>
