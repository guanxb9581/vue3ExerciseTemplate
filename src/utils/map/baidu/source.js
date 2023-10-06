import TileGrid from 'ol/tilegrid/TileGrid'
import TileImage from 'ol/source/TileImage'
import TileLayer from 'ol/layer/Tile'

import getBD09ProjByCode from './projection'

getBD09ProjByCode('BD:09')
// 自定义分辨率和瓦片坐标系
let rlProject = []

// 计算百度使用的分辨率
for (let i = 0; i <= 19; i++) {
  rlProject[i] = Math.pow(2, 18 - i)
}
let _tilegrid = new TileGrid({
  origin: [0, 0], // 设置原点坐标
  resolutions: rlProject // 设置分辨率
})
/**
 * 加载百度地图离线瓦片不能用ol.source.XYZ，ol.source.XYZ针对谷歌地图（注意：是谷歌地图）而设计，
 * 而百度地图与谷歌地图使用了不同的投影、分辨率和瓦片网格。
 * 因此这里使用ol.source.TileImage来自行指定投影、分辨率、瓦片网格。
 */
let baiduSource = new TileImage({
  projection: 'BD:09', //值为'BD:09'
  tileGrid: _tilegrid,
  tilePixelRatio: 2,
  wrapX: true, //允许左右无限移动
  tileUrlFunction: (tileCoord, pixelRatio, proj) => {
    if (!tileCoord) {
      return ''
    }
    let z = tileCoord[0]
    // let x: number | string = tileCoord[1];
    let x = tileCoord[1]
    // 注意，在openlayer3中由于载地图的方式是右上递增
    // let y: number | string = tileCoord[2];
    // 而openlayer6中是右下递增，所以y的值需要注意
    // 6版本需要取负值,同时注意要减一，否则缩放有问题
    // let y: number | string = -tileCoord[2] - 1;
    let y = -tileCoord[2] - 1

    // 百度瓦片服务url将负数使用M前缀来标识
    if (x < 0) {
      x = 'M' + -x
    }
    if (y < 0) {
      y = 'M' + -y
    }
    // online3的3是用来分流的，还可以是其他路径
    // udt应该表示的是地图发布日期。p表示地图上的信息，scaler表示缩放
    // 0表示不显示地名等标注信息，只单纯的地图地图，1表示显示地名信息
    // return `http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20220426&scaler=2&p=1`;//20190426
    return (
      'https://maponline3.bdimg.com/tile/?qt=vtile&x=' +
      x +
      '&y=' +
      y +
      '&z=' +
      z +
      '&styles=pl&udt=20151021&scaler=1&p=1'
    )
  }
})
let mapLayer = new TileLayer({
  source: baiduSource
})

export default mapLayer
