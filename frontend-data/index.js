// Started code Laurens Aarnoudse
import { select, json, geoPath, geoMercator, zoom } from 'd3'
import { feature } from 'topojson'

// const endpointRate = 'https://opendata.rdw.nl/resource/534e-5vdg.json'
const endpointGeoPoints = 'https://opendata.rdw.nl/resource/nsk3-v9n7.json'
const colomnName = 'areageometryastext'

getData(endpointGeoPoints)
	.then(parkingDataResponse => {
  	return parkingDataResponse.json()
})
.then(parkingData => {
 		// console.log(parkingData)
		const geoPointsArray = filterData(parkingData, colomnName)
		// console.log(geoPointsArray)
    
    const svg = select('svg')

const projection = geoMercator().scale(5000).center([5.116667,52.17000])
const pathGenerator = geoPath().projection(projection)

json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(data => {
	const gemeentes = feature(data, data.objects.gemeente_2020)
  
  svg.selectAll('path').data(gemeentes.features)
  	.enter().append('path')
  		.attr('d', pathGenerator)
		.append('title')
  		.text(d => `${d.properties.statnaam}, ID:${d.id}`)
  
  //source https://www.youtube.com/watch?v=hrJ64jpYb0A
  const carParks = svg.selectAll('g')
  	.data(geoPointsArray)
  	// .join('g')
  	.enter().append('g')
  
  const carParking = carParks.append('g')
  	.attr('transform', ({ longitude, latitude }) => `translate(${projection([longitude, latitude]).join(",")})`)
  
  carParking.append('circle')
  		.attr('r', '2');
})
})

function getData(url){
  return fetch(url)
}

// With help of Laurens Aarnoudse
function filterData(dataArray, key){
  return dataArray.map(item => {
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
		.slice(0, 24)
    const geoArray = geoPoints.split(' ')
		return { longitude: geoArray[1], latitude: geoArray[0] }
  	}
  )
}

// function calcParkingRate(AmountFarePart, stepSizeFarePart) {
// 	return AmountFarePart / stepSizeFarePart
// }