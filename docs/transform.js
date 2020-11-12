//Code adapted from Laurens Aarnoudse
//Checks if property exists and if not generates it and puts 1 in it
export function transformData(data){
  const selectedData = data.map(item => {
		return {
    	areamanagerid: item.areamanagerid,
    	areageometryastext: getPropIfExists(item, 'areageometryastext')
    }
  })
  return selectedData
  console.log(selectedData)
}

function getPropIfExists(dataObject, prop){
  if (!dataObject[prop]) return "1"
  return dataObject[prop]
}