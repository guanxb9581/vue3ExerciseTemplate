<template>
  <div id="map-container">
  </div>
  <img src="../assets/logo.svg" id="anchor" ref="anchor">
</template>

<script setup lang="ts">

import { Feature, Map, Overlay, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import TileDebug from 'ol/source/TileDebug'
import geoJSON from 'ol/format/GeoJSON'
import { onMounted, ref, type Ref } from 'vue'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'


const count: Ref<number | undefined> = ref(0)
const anchorRef: Ref<HTMLElement | null> = ref(null)

const initMap = () => {
  const map = new Map({
    target: 'map-container',
    layers: [
      new TileLayer({
        source: new OSM()
      }),

    ],
    view: new View({
      center: [-72.980624870461128, 48.161307640513321],
      zoom: 0,
      projection: 'EPSG:4326'
    })
  })

  const vecLayer = new VectorLayer({
    source: new VectorSource({
      url: '',
      format: new geoJSON()
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'red',
        width: 1
      })
    })
  })

  const listenKey = vecLayer.getSource()?.on('change', () => {
    if (vecLayer.getSource()?.getState() === 'ready') {
      // document.getElementById('count').innerHTML = vecLayer.getSource()?.getFeatures().length;
      count.value = vecLayer.getSource()?.getFeatures().length;
      vecLayer.getSource()?.removeEventListener('change', () => { }); // 注销监听器
    }
  })

  // 加载矢量地图
  //   function addGeoJSON(src) {
  //     var layer = new ol.layer.Vector({
  //         source: new ol.source.Vector({
  //             features: (new ol.format.GeoJSON()).readFeatures(src, {     // 用readFeatures方法可以自定义坐标系
  //                 dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
  //                 featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
  //             })
  //         })
  //     });
  //     map.addLayer(layer);
  // }
  // 在OpenLayers 3提供了一个用于调试瓦片的source: ol.source.TileDebug。可以清晰的看到每一个瓦片的坐标,第一个数字是层级z，第二个是经度x，第三个是维度y
  const tileDebug = new TileLayer({
    source: new TileDebug({
      projection: 'EPSG:3857',
      tileGrid: (new OSM()).getTileGrid()!
    })
  })
  // 添加图层
  // var anchor = new Overlay({
  //   element: anchorRef.value!
  // });
  // anchor.setPosition([104, 30]);
  // map.addOverlay(anchor);

  map.on('pointermove', (event) => {
    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      map.dispatchEvent('mousemove');
    })
  })

  map.addLayer(vecLayer)
}
onMounted(() => {
  initMap()
})



</script>

<style lang="less" scoped></style>