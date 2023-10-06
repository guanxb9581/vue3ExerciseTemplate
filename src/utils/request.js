/* eslint-disable  */
import request from './http'
const myRequest = (() => {
  const hasRequest = new Set();
  const memory = new Map();
  
  return function (config) {
      // 缓存
      const cache = (result = { go: true }) => {
          if (!result.go) {
              return Promise.resolve(result);
          }
          if (memory.has(config.url)) {
              return Promise.resolve({ go: false, type: 'then', res: memory.get(config.url) });
          } else {
              const setMemory = (res) => {
                  memory.set(config.url, res);
              };
              let callback = result.callback instanceof Array ? result.callback : [];
              callback.push(setMemory);
              return Promise.resolve({ go: true, type: 'then', callback: callback });
          }
      };

      // 重复请求
      const noRepeat = (result = { go: true }) => {
          if (!result.go) {
              return Promise.resolve(result);
          }
          if (hasRequest.has(config.url)) {
              return Promise.resolve({ go: false, type: 'catch', res: '请求已提交' });
          } else {
              hasRequest.add(config.url);
          }
          const setRequestingUrl = () => {
              hasRequest.delete(config.url);
          };
          let callback = result.callback instanceof Array ? result.callback : [];
          callback.push(setRequestingUrl);
          return Promise.resolve({ go: true, type: 'then', callback: callback });
      };
      // 最终请求
      const finalRequest = async (result) => {
          if (!result.go) {
              return Promise.resolve(result);
          }
          try {
              let res = await request(config);
              return Promise.resolve({ go: true, type: 'then', res: res, callback: result.callback });
          } catch (error) {
              return Promise.resolve({ go: true, type: 'catch', res: res, callback: result.callback });
          }
      };

      // 请求后的处理
      const finalHandle = (result) => {
          // if (!result.go) {
          //     return Promise.resolve(result);
          // }
          const res = result.res;
          if (result.callback instanceof Array && result.callback.length) {
              while (result.callback.length) {
                  let func = result.callback.shift();
                  typeof func == 'function' && func(res);
              }
          }
          if (result.type == 'then') {
              return Promise.resolve(res);
          } else if (result.type == 'catch') {
              return Promise.reject(res);
          }
      };

      let _handleArr = [noRepeat, finalRequest, finalHandle];
      if (config.need_storage) {
          _handleArr.unshift(cache)
      }
      let promise = Promise.resolve();

      while (_handleArr.length > 0) {
          promise = promise.then(_handleArr.shift());
      }
      return promise;
  };
})();

export { myRequest as request, request as initRequest }
