// Start code Laurens Aarnoudse
import { select, json, geoPath, geoMercator, zoom } from 'd3';
import { feature } from 'topojson';
import { transformData } from '/transform.js'
import { cleanData } from '/clean.js';

// const endpointRate = 'https://opendata.rdw.nl/resource/534e-5vdg.json'
const endpointGeoPoints = 'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=6100';
const colomnName = 'areageometryastext';
  
getData(endpointGeoPoints)
  .then((parkingDataResponse) => {
    return parkingDataResponse.json();
  })
  .then((parkingData) => {
    const transformedArray = transformData(parkingData);
  	const geoPointsArray = cleanData(transformedArray, colomnName);
  	// console.log(transformedArray)
  	console.log(geoPointsArray)
  
    drawMap(geoPointsArray);
  })

// console.log(geoPointsArray)

function getData(url) {
  return fetch(url);
}

function drawMap(geoData) {
// Code by unknown developer
// ------------------------------------------------------------------------------------
  const svg = select('svg')

  const projection = geoMercator().scale(6000).center([5.116667, 52.17]);
  const pathGenerator = geoPath().projection(projection);

  json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(
    (data) => {
      const gemeentes = feature(data, data.objects.gemeente_2020);
      const map = svg.append('g');
      map
        .selectAll('path')
        .data(gemeentes.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .append('title')
        .text((d) => `${d.properties.statnaam}`)
      	.call(d3.zoom().on("zoom", function () {
       				svg.attr("transform", d3.event.transform)
    			}))
      	.append("g")
      	// .call(d3.drag().on('drag', ondrag));
// ------------------------------------------------------------------------------------
      
//sources: https://www.youtube.com/watch?v=MTR2T5VyxMc, https://www.youtube.com/watch?v=hrJ64jpYb0A
//and help from Gijs Laarman    
      // const dotPoints = svg.append("g")
      map
      	.selectAll("g")
      	.data(geoData)
      	.join("g")
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
      		.attr('r', '0.3px')
    			// .call(d3.zoom().on("zoom", function () {
    			// svg.attr("transform", d3.event.transform)
    			// }))
			})
  
 			// console.log(svg) 
 			// svg.call(d3.zoom().scaleExtent([1 / 8, 24]).on('zoom', onzoom));
}

// function onzoom(){
//   svg.attr('transform', d3.event.transfrom);
// }

// function ondrag(d){
// 	d.x = d3.event.x;
//   d.y = d3.event.y;
//   d3.select(this).attr('cx', x(d)).attr('cy', x(d));
// }
