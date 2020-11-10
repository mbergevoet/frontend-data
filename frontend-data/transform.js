// Code adapted from Laurens Aarnoudse
export function transformData(data){
  const selectedData = data.map(item => {
		return {
    	// areamanagerid: item.areamanagerid,
    	areageometryastext: getPropIfExists(item, "areageometryastext")
    }
  })
  return selectedData
}

function getPropIfExists(dataObject, prop){
  if (!dataObject[prop]) return "1"
  return dataObject[prop]
}