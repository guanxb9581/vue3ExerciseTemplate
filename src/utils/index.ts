// import {reactive} from 'vue'

/**
 * 异步并发控制
 * arr {Array} 异步任务队列
 * max {Number} 允许同时执行的最大任务数
 * callback {Function} 所有任务完成之后的回调函数
 */
export function sendRequest(arr: any[], max: number = 5, reqApi:Function, callback: Function) {
  const i = 0;
  const fetchArr: Array<Promise<any>> = []

  const toFetch = (): Promise<any> => {
    if (i === arr.length) {
      // 如果异步任务都已开始执行，剩最后一组，则结束并发控制
      return Promise.resolve()
    }
    // 执行异步任务
    // const it = arr[i++]
    const chunkItem = arr.shift()
    const it = reqApi(chunkItem)
    it.then(() => {
      // 如果执行异步任务之后，去除it
      fetchArr.splice(fetchArr.indexOf(it), 1)
    })
    // 添加新任务
    fetchArr.push(it)
    let p = Promise.resolve()
    // 如果并发数达到最大数，则等其中一个异步任务完成再添加
    if (fetchArr.length >= max) {
      p = Promise.race(fetchArr)
    }
    // 执行递归
    return p.then(() => toFetch())
  }

  toFetch().then(() => {
    // 最后一组全部执行完再执行回调函数
    Promise.all(fetchArr).then(() => {
      callback()
    })
  })
}

// export function cutBlob(fileHash, file: File, chunkSize: number, fileInfo: reactive<{}>) {
//   const chunkArr: Array<{ index: number, chunk: Blob }> = []
//   const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
//   const chunkNums = Math.ceil(file.size / chunkSize)
//   return new Promise((resolve, reject) => {
//     let startIndex = 0
//     let endIndex = 0
//     let contentItem = null
//     for (let i = 0; i < chunkNums; i++) {
//       startIndex = i * chunkSize
//       endIndex = Math.min((i + 1) * chunkSize, file.size)
//       contentItem = blobSlice.call(file, startIndex, endIndex)
//       chunkArr.push({
//         index: i, // 当前文件片段顺序索引，一并传给后端确定顺序
//         chunk: contentItem // 当前文件片段内容
//       })
//     }
//     fileInfo = {
//       hash: fileHash,
//       total: chunkNums,
//       name: file.name,
//       size: file.size
//     }
//     resolve(chunkArr)
//   })
// }