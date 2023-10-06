<template>
  <div id="map-container"></div>

  <div class="button-group">
    <el-button @click="moveUp">上移动</el-button>
    <el-button @click="moveLeft">左移动</el-button>
    <el-button @click="moveToCity">移动到成都市</el-button>
    <el-button @click="zoomIn">放大</el-button>
    <el-button @click="zoomOut">缩小</el-button>
    <el-button @click="fitToChengdu">fitToChengdu</el-button>
  </div>
</template>

<script setup lang="ts">
import { Map, Tile, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { transform, get, type ProjectionLike } from 'ol/proj'
import { getCIA_CLayer, getIBO_CLayer, getIMG_CLayer } from '../utils/map/tiandiLayers'
import { onMounted } from 'vue'
import type { Coordinate } from 'ol/coordinate'
import baiduLayer from '../utils/map/baidu/source.js'

import TileGrid from 'ol/tilegrid/TileGrid'
import TileImage from 'ol/source/TileImage'


// OSM数据源
const OSMLayer = new TileLayer({
  source: new XYZ({
    url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  })
})

// 高德数据源
var gaodeMapLayer = new TileLayer({
  source: new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
  })
})


let mapInstance: any = undefined
onMounted(() => {
  mapInstance = new Map({
    target: 'map-container',
    view: new View({
      // 设置地图中心范围
      // extent: [102, 29, 104.2, 31],
      // center: transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'),
      // center: [104.06, 30.67],
      // projection: 'EPSG:4326',
      center: transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10
      // minZoom: 10,
      // maxZoom: 14,
      // constrainResolution: true,
      // smoothResolutionConstraint: false
    }),
    // layers: [getCIA_CLayer(), getIBO_CLayer(), getIMG_CLayer()]
    layers: [baiduLayer]
  })
})

const moveUp = () => {
  let view = mapInstance.getView() as View
  let center = view.getCenter() as Coordinate
  center[1] -= 5000
  view.setCenter(center)
  mapInstance.render()
}
const moveLeft = () => {
  let view = mapInstance.getView() as View
  let center = view.getCenter() as Coordinate
  center[0] += 5000
  view.setCenter(center)
  mapInstance.render()
}
const moveToCity = () => {
  let view = mapInstance.getView() as View
  view.setCenter(transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'))
  mapInstance.render()
}
const zoomIn = () => {
  let view = mapInstance.getView() as View
  view.setZoom((view.getZoom() as number) + 1)
}
const zoomOut = () => {
  let view = mapInstance.getView() as View
  view.setZoom((view.getZoom() as number) - 1)
}
const fitToChengdu = () => {
  let view = mapInstance.getView() as View
  // 让地图最大化完全地显示区域[104, 30.6, 104.12, 30.74]
  view.fit([104, 30.6, 104.12, 30.74], {
    size: mapInstance.getSize()
  })
}
</script>

<style lang="less" scoped>
#map-container {
  margin: 0;
  height: 500px;
  width: 800px;
}
</style>
