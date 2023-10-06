//计算四至范围
function Rectangle(latitude1, longitude1, latitude2, longitude2) {
  let reJ = {
      West: null,
      North: null,
      East: null,
      South: null,
  }
  reJ.West = Math.min(longitude1, longitude2);
  reJ.North = Math.max(latitude1, latitude2);
  reJ.East = Math.max(longitude1, longitude2);
  reJ.South = Math.min(latitude1, latitude2);
  return reJ
},

/**
* 精确判断是否在中国
* @param longitude
* @param latitude
* @returns {boolean}
* @constructor
*/
export function IsInsideChina(longitude, latitude) {
  //大陆
  let region = [
      this.Rectangle(49.220400, 79.446200, 42.889900, 96.330000),
      this.Rectangle(54.141500, 109.687200, 39.374200, 135.000200),
      this.Rectangle(42.889900, 73.124600, 29.529700, 124.143255),
      this.Rectangle(29.529700, 82.968400, 26.718600, 97.035200),
      this.Rectangle(29.529700, 97.025300, 20.414096, 124.367395),
      this.Rectangle(20.414096, 107.975793, 17.871542, 111.744104),
  ]
  //台湾省
  let exclude = [
      this.Rectangle(25.398623, 119.921265, 21.785006, 122.497559),
      this.Rectangle(22.284000, 101.865200, 20.098800, 106.665000),
      this.Rectangle(21.542200, 106.452500, 20.487800, 108.051000),
      this.Rectangle(55.817500, 109.032300, 50.325700, 119.127000),
      this.Rectangle(55.817500, 127.456800, 49.557400, 137.022700),
      this.Rectangle(44.892200, 131.266200, 42.569200, 137.022700),
  ]
  for (let i = 0; i < region.length; i++) {
      if (this.InRectangle(region[i], longitude, latitude)) {
          for (let j = 0; j < exclude.length; j++) {
              if (this.InRectangle(exclude[j], longitude, latitude)) {
                  return false;
              }
          }
          return true;
      }
  }
  return false;
},
/**
* 判断是否在范围内
* @param rect
* @param longitude
* @param latitude
* @returns {boolean}
* @constructor
*/
function InRectangle(rect, longitude, latitude) {
  return rect.West <= longitude && rect.East >= longitude && rect.North >= latitude && rect.South <= latitude;
}
