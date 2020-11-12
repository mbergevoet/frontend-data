// Start code Laurens Aarnoudse
import { select, json, geoPath, geoMercator, zoom } from 'd3';
import { feature } from 'topojson';
import { transformData } from '/transform.js'
import { cleanData } from '/clean.js';

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

function getData(url) {
  return fetch(url);
}

function drawMap(geoData) {
// Code adapted from sreen020
// ------------------------------------------------------------------------------------
  const svg = d3.select("svg")
 	let zoom = d3.zoom()
   .scaleExtent([1, 8])
   .on('zoom', () => {
       svg.attr('transform', d3.event.transform)
   });
  const g = svg.append('g');

  const projection = geoMercator().scale(5300).center([5.116667, 52.17]);
  const pathGenerator = geoPath().projection(projection);

  json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(
    (data) => {
      const townships = feature(data, data.objects.gemeente_2020);
      
  			// const text = svg.append('text')
  			// g.append('text')
  			// .attr('y', 50)
  			// .attr('x', 20)
  			// .text('Parkeerplaatsen verdeelt over Nederland')
      
      console.log(g);
      g
        .selectAll('path')
        .data(townships.features)
        .enter()
        .append('path')
        	.attr('d', pathGenerator)
        .append('title')
        .text((d) => `${d.properties.statnaam}`);
      	
// ------------------------------------------------------------------------------------
      
//sources: https://www.youtube.com/watch?v=MTR2T5VyxMc, https://www.youtube.com/watch?v=hrJ64jpYb0A
//and help from Gijs Laarman    
      g
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
      		.attr('r', '1px')
			})
  		
  		svg.call(zoom);
  
 			// svg.call(d3.zoom().scaleExtent([1 / 8, 24]).on('zoom', onzoom));
  
			// function zoomed(event) {
			// const { transform } = event;
			// g.attr('transform', transform);
			// g.attr('stroke-width', 1 / transform.k);
			// }
  
      function onzoom(){
      	g.attr('transform', d3.event.transform);
    	}
}