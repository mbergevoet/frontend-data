// With help of Laurens Aarnoudse
export function cleanData(dataArray, key) {
    return dataArray.map((item) => {
        const geoPoints = item[key]
        .replace(' ', '')
        .replace(',', '')
        .replace('))', '')
        .replace('((', '')
        .replace(')', '')
        .replace('(', '')
        .replace('GEOMETRYCOLLECTIONLINESTRING', '')
        .replace('MULTIPOLYGON', '')
        .replace('POINT', '')
        .replace('POLYGON', '')
        .replace('(', '')
        .replace(')', '')
        .slice(0, 24);
      const geoArray = geoPoints.split(' ');
      return { areamanagerid: item.areamanagerid, longitude: Number(geoArray[0]), latitude: Number(geoArray[1]) };
  });
}