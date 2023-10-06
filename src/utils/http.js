//配置全局得基础配置
import axios from "axios";
//配置中心
import webConfig from "@/global.config.js"
//base64
import { Base64 } from "js-base64"
import router from "@/router";
//baseURL,timeout,header,responseType,withCredentials
//后面的请求用request来发
let request = axios.create({
    //1,基础配置
    baseURL: "http://localhost:3000/",
    timeout: 30 * 1000,
    responseType: "json",
    headers: {
        "a": "123"
    }
})
request.interceptors.request.use((config) => {
    //token，密钥得设置
    let whiteList = webConfig.whiteListApi
    let url = config.url
    let token = localStorage.getItem("token");
    if (whiteList.indexOf(url) === -1 && token) {
        config.headers.token = token;
    }
    //密钥-secretId+特殊算法
    let _secret = Base64.encode(webConfig.secretId + new Date().toString());
    config.headers.secret = _secret;
    return config;
}, error => {
    return Promise.reject(new Error(error))
})
request.interceptors.response.use((res) => {
    //响应得统一处理
    const status = res.data.code || 200
    const message = res.data.msg || "未知错误";
    if (status === 401) {
        alert("你没有权限");
        router.push("/about")
        return Promise.reject(new Error(message));
    }
    if (status !== 200) {
        alert("错误码" + status + "   " + message);
        return Promise.reject(new Error(message));
    }
    return res.data;
}, error => {
    //真实项目中，往往使用组件库得消息提示 $waring
    alert(error)
    return Promise.reject(new Error(error));
})
export default request;
