import { get as ProjGet, addProjection, addCoordinateTransforms } from 'ol/proj'
import Projection from 'ol/proj/Projection'

//BD:09
const getBD09ProjByCode = function (projCode) {
  let projection = ProjGet(projCode)
  if (projection) {
    return projection
  }
  // proj4.defs("BD:09", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs")
  /**
   *  定义百度投影，这是实现无偏移加载百度地图离线瓦片核心所在。
   *  网上很多相关资料在用OpenLayers加载百度地图离线瓦片时都认为投影就是EPSG:3857(也就是Web墨卡托投影)。
   *  事实上这是错误的，因此无法做到无偏移加载。
   *  百度地图有自己独特的投影体系，必须在OpenLayers中自定义百度投影，才能实现无偏移加载。
   *  百度投影实现的核心文件为bd09.js，在迈高图官网可以找到查看这个文件。
   */
  let projBD09 = new Projection({
    code: 'BD:09', // mapConf.curBaiDuProj值为'BD:09'
    // extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],//原始的百度范围
    // extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
    units: 'm',
    axisOrientation: 'neu',
    global: false
  })
  addProjection(projBD09)
  // addCoordinateTransforms('EPSG:4326', projBD09, projzh.ll2bmerc, projzh.bmerc2ll);//这里使用的转换算法跟我调用的开源代码一样，只能处理北半球东半球的坐标数据
  // addCoordinateTransforms('EPSG:3857', projBD09, projzh.smerc2bmerc, projzh.bmerc2smerc);
  return projection
}

export default getBD09ProjByCode
