// Start code Laurens Aarnoudse
import { select, json, geoPath, geoMercator, zoom } from 'd3'
import { feature } from 'topojson'
import { transformData } from '/transform.js'
import { cleanData } from '/clean.js'

const endpointGeoPoints = 'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=6100';
const colomnName = 'areageometryastext';
  
getData(endpointGeoPoints)
  .then((parkingDataResponse) => {
    return parkingDataResponse.json()
  })
  .then((parkingData) => {
    const transformedArray = transformData(parkingData)
  	const geoPointsArray = cleanData(transformedArray, colomnName)
  	console.log(geoPointsArray)
  
    drawMap(geoPointsArray);
  })

function getData(url) {
  return fetch(url)
}

function drawMap(geoData) {
// Code adapted from sreen020
// ------------------------------------------------------------------------------------
  const svg = d3.select("svg")
  const resetButton = d3.select(".reset")
  const changeButtonOne = d3.select(".changeOne")
  const changeButtonTwo = d3.select(".changeTwo")
  const changeButtonThree = d3.select(".changeThree")
 	const zoom = d3.zoom()
   .scaleExtent([1, 8])
   .on('zoom',  (e) => {
       g.attr('transform', e.transform)
   });
  const g = svg.append('g')

  const projection = geoMercator().scale(5100).center([5.116667, 52.17])
  const pathGenerator = geoPath().projection(projection)
  
  json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(
    (data) => {
      const townships = feature(data, data.objects.gemeente_2020)
      
      g
        .selectAll('path')
        .data(townships.features)
        .enter()
        .append('path')
        	.attr('d', pathGenerator)
        .append('title')
        .text((d) => `${d.properties.statnaam}`)
      	
// ------------------------------------------------------------------------------------
      
//sources: https://www.youtube.com/watch?v=MTR2T5VyxMc, https://www.youtube.com/watch?v=hrJ64jpYb0A
//and help from Gijs Laarman    
      g
      	.selectAll("g")
      	.data(geoData)
      	.enter()
      	.append('circle')
          .attr("cx", function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[0]  
          })
          .attr("cy", function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[1]
          })
      		.attr('r', '0.7px')
  })
  		
  		svg.call(zoom)
  
  // source: https://stackoverflow.com/questions/53056320/html-d3-js-how-to-zoom-from-the-mouse-cursor-rather-than-top-left-corner
  		resetButton
      	.attr('cursor', 'pointer')
      	.text("Reset Zoom")
      	.on('click', function(){
        	g.transition()
      			.duration(750)
      		.call(zoom.transform, d3.zoomIdentity)
      	})
  
  		changeButtonOne
      	.text("Area Manager X")
  
  		changeButtonTwo
      	.text("Area Manager Y")
  
  		changeButtonThree
      	.text("Area Manager Z")
}