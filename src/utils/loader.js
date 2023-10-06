const loaderUtils = require('loader-utils')

//十六进制颜色值的正则表达式
let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function (opacity = 0.3) {
  let sColor = this.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //处理六位的颜色值
    let sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')'
  } else {
    return sColor
  }
}
let currentIndex = 0
let colors = ['#1abc9c', '#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6']
let length = colors.length
module.exports = function loader(source) {
  currentIndex++
  currentIndex = currentIndex % length
  const options = loaderUtils.getOptions(this)
  let color = colors[currentIndex]
  let insertContent = `<div v-show="isCodeSourcePathVisible" style="padding:0 5px 0 5px;color:#fff;text-align:left;position:absolute;z-index:3000;height: 20px;line-height: 20px;white-space: nowrap;background: ${color};" onmouseover="this.style.zIndex='3001';" onmouseout="this.style.zIndex='3000';">{{$options.__file}}</div>`
  source = source.replace(/(<div[\s\S]*?>)/, '$1 ' + insertContent)
  source = source.replace(/(<div[\s\S]*?>)/, (params) => {
    let index = source.indexOf(params)
    if (index < 20) {
      let isWithStyleletiable = params.match(/:style="/)
      if (!isWithStyleletiable) {
        let isWithStyle = params.match(/style="/)
        if (isWithStyle) {
        } else {
          params = params.replace(
            /(<div)/,
            `$1 :style="isCodeSourcePathVisible?{border:'2px dashed ${color}'}:{}"`
          )
        }
      }
    }
    return params
  })
  return source
}
