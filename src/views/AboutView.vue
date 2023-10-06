<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input multiple type="file" @change="fileChange" />
  </div>
</template>

<script setup lang="ts">
import { sendRequest } from '@/utils/index'
import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { reactive } from 'vue'

let fileInfo: any = {}
const chunkSize = 100 * 1024

const createFileMd5 = (file: File): Promise<{ hash: string; content: ArrayBuffer }> => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      const content = reader.result as ArrayBuffer
      spark.append(content)
      const hash = spark.end()
      resolve({ hash, content })
    }
  })
}
// 文件分块
function cutBlob(fileHash: string, file: File, uploaded: any[]): Promise<any> {
  const chunkArr: Array<{ index: number; chunk: Blob }> = []
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const chunkNums: Number = Math.ceil(file.size / chunkSize)
  return new Promise((resolve, reject) => {
    let startIndex = 0
    let endIndex = 0
    let contentItem = null
    for (let i = 0; i < chunkNums; i++) {
      if (uploaded.includes(i)) continue
      startIndex = i * chunkSize
      endIndex = Math.min((i + 1) * chunkSize, file.size)
      contentItem = blobSlice.call(file, startIndex, endIndex)
      chunkArr.push({
        index: i, // 当前文件片段顺序索引，一并传给后端确定顺序
        chunk: contentItem // 当前文件片段内容
      })
    }
    fileInfo = {
      hash: fileHash,
      total: chunkNums,
      name: file.name,
      size: file.size
    }
    resolve(chunkArr)
  })
}
const sendFile = (file: File) => {
  const formData = new FormData()
  formData.append('fileUpload', file)
  axios.post('http://localhost:3000/api/upload/smallFileUpload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return
}
// 小文件上传
const sendChunk = (item) => {
  if (!item) return
  let formdata = new FormData()
  formdata.append('fileUpload', item.chunk)
  formdata.append('index', item.index)
  formdata.append('hash', fileInfo.hash)
  // formdata.append("name", this.fileInfo.name)

  return axios.post('http://localhost:3000/api/upload/snippet', formdata, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const fileChange = (e: any) => {
  // const files = e.target.files
  const file = e.target.files[0]
  const formData = new FormData()
  if (file.size / chunkSize < 5) {
    sendFile(file)
    return
  }
  createFileMd5(file).then(async (fileMd5) => {
    const { hash, content } = fileMd5
    // fileMd5 为文件唯一的id，只要文件内容没变，那这id就不会变
    // console.log(fileMd5)
    // 检查该文件是否有上传chunk
    const { data } = await getUplaodChunksApi(hash)
    let uploaded = Array.isArray(data.data) ? data.data.map((v) => v.split('-')[1] - 0) : []
    // 切割文件
    const chunkArr = await cutBlob(hash, file, uploaded)

    sendRequest(chunkArr, 5, sendChunk, chunkMergeApi)
  })
}

const getUplaodChunksApi = (hash: string) => {
  return axios.post('http://localhost:3000/api/upload/checkSnippet', { hash })
}

const chunkMergeApi = () => {
  return axios.post('http://localhost:3000/api/upload/merge', { ...fileInfo }).then((res) => {
    console.log(res.data)
  })
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
