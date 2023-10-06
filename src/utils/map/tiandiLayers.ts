
import TileLayer from 'ol/layer/Tile';
import { Projection, get as projGet } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { getWidth, getTopLeft } from 'ol/extent'
import TileGrid from 'ol/tilegrid/TileGrid'



// 请使用自己的tk，笔者这里设置白名单，只有白名单域名才可以访问，否则报403
const TK = 'ccb725aa56fb606231e080fc9c0b4cb3';

// 获取天地图地址
const getUrl = function (type: string) {
  let url = 'http://t{randomNumber}.tianditu.gov.cn/DataServer?T={type}&x={x}&y={y}&l={z}';
  // 这里用随机数获取地址
  url = url.replace('{randomNumber}', Math.round(Math.random() * 7).toString());
  url = url.replace('{type}', type);
  url = url + "&tk=" + TK;
  return url;
}

// 获取分辨率数组
const getResolutionsExpert = function (size: number) {

  const resolutions = new Array(18);
  const matrixIds = new Array(18);
  for (let z = 0; z < 19; ++z) {
    //分辨率
    resolutions[z] = size / Math.pow(2, z);
    //等级
    matrixIds[z] = z;
  }
  return resolutions;
}

const getOptional = function (url: string) {

  // 投影坐标系
  const projection = projGet('EPSG:4326');
  if (!projection) return undefined
  const projectionExtent = projection.getExtent();
  const size = getWidth(projectionExtent) / 256;

  return new XYZ({
    crossOrigin: 'anonymous',
    wrapX: true,
    //切片xyz获取方法
    tileUrlFunction: function (tileCoord: Array<number>) {
      const z = tileCoord[0];
      const x = tileCoord[1];
      const y = tileCoord[2];
      const completeUrl = url.replace('{z}', z.toString())
        .replace('{y}', y.toString())
        .replace('{x}', x.toString());
      return completeUrl;
    },
    //坐标系
    projection: projection,
    tileGrid: new TileGrid({
      origin: getTopLeft(projectionExtent),
      tileSize: [256, 256],
      //分辨率数组
      resolutions: getResolutionsExpert(size)
    }),
  })
}

// const type = 'w'; // 墨卡托
const TYPE = 'c';  // WGS84
//影像图参数
const IMG_C = 'img_c' + TYPE;
const CIA_C = 'cia_c' + TYPE;
const IBO_C = 'ibo_c' + TYPE;

//矢量图
const VEC_C = 'vec_' + TYPE;
const CVA_C = 'cva_' + TYPE;
//地形图
const TER_C = 'ter_' + TYPE;

// 影像图
export function getIMG_CLayer() {
  const layer = new TileLayer({
    name: "天地图影像图层",
    source: getOptional(getUrl(IMG_C))
  });
  return layer;
}
// 注记
export function getCIA_CLayer() {
  const layer = new TileLayer({
    name: "天地图影像注记图层",
    source: getOptional(getUrl(CIA_C)),
    zIndex: 1,
  });
  return layer;
}
// 境界
export function getIBO_CLayer() {
  const layer = new TileLayer({
    name: "天地图影像境界图层",
    source: getOptional(getUrl(IBO_C)),
    zIndex: 1,
  });
  return layer;
}
