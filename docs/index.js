// Start code Laurens Aarnoudse
//Imports from D3 and function imports from other files
import { select, json, geoPath, geoMercator, zoom } from 'd3'
import { feature } from 'topojson'
import { transformData } from '/transform.js'
import { cleanData } from '/clean.js'

//Global constants
const endpointGeoPoints = 'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=6179';
const endpointCities = 'https://gist.githubusercontent.com/mbergevoet/4481f67f9f218b91f7fe0a34c6407b4f/raw/9f8ddefb2a93335ea0e52a9a137ab3ecd5639535/cities.json';
const colomnName = 'areageometryastext';
const projection = geoMercator().scale(5100).center([7.516667, 51.80])
const pathGenerator = geoPath().projection(projection)
const svg = d3.select('svg')
const g = svg.append('g')
const resetButton = d3.select('.reset')
const changeButtonOne = d3.select('.changeOne')
const changeButtonTwo = d3.select('.changeTwo')
const changeButtonThree = d3.select('.changeThree')
const changeButtonFour = d3.select('.changeFour')
  
//"Master" function that makes all the magic happen
makeViz()

function makeViz(){

  drawMap()

 //Executes the getData function to fetch the data from the endpoint
  getData(endpointCities)
    .then((cityResponse) => {
      return cityResponse.json()
    })
    .then((cityData) => {
      const cityPointsArray = cityData
      drawCities(cityPointsArray)
      console.log(cityPointsArray)
    })
  
  //Executes the getData function to fetch the data from the endpoint
  getData(endpointGeoPoints)
    .then((parkingDataResponse) => {
      return parkingDataResponse.json()
    })
    .then((parkingData) => {
      const transformedArray = transformData(parkingData)
      const geoPointsArray = cleanData(transformedArray, colomnName)
      console.log(geoPointsArray)
      drawCarParks(geoPointsArray)
    
// Update functions, one for each button because for some reason paramaters cannot be passed in to a function that is called with .on
// Idealy I would have wanted it to work like this .on('click', update(searchTerm)) so I could reuse the 
// update function instead of writing four times

    function updateOne(){
        const carparks = d3.selectAll('.carpark').remove()
        const searchTerm = "363"
        const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm)
        drawCarParks(selectedPoints)
        console.log(selectedPoints)
    }

    function updateTwo(){
        const carparks = d3.selectAll('.carpark').remove()
        const searchTerm = "518"
        const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm)
        drawCarParks(selectedPoints)
        console.log(selectedPoints)
    }

    function updateThree(){
        const carparks = d3.selectAll('.carpark').remove()
        const searchTerm = "599"
        const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm)
        drawCarParks(selectedPoints)
        console.log(selectedPoints)
    }

    function updateFour(){
        const carparks = d3.selectAll('.carpark').remove()
        const searchTerm = "344"
        const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm)
        drawCarParks(selectedPoints)
        console.log(selectedPoints)
    }

  //on click handlers which executes the update functions
  //I chose the four most common areamanagerid are 363, 518, 599, 344 which corresponed with Amsterdam, Den Haag, Rotterdam, Utrecht 
      changeButtonOne
        .text('Amsterdam (ID: 363)')
        .on('click', updateOne)

      changeButtonTwo
        .text('Den Haag (ID: 518)')
        .on('click', updateTwo)

      changeButtonThree
        .text('Rotterdam (ID: 599)')
        .on('click', updateThree)

      changeButtonFour
        .text('Utreacht (ID: 344)')
        .on('click', updateFour)
    })
}

//Fetches the data from given url
function getData(url) {
  return fetch(url)
}

//Draws map using a township outline dataset
function drawMap() {

  const zoom = d3.zoom()
   .scaleExtent([1, 8])
   .on('zoom',  (e) => {
       g.attr('transform', e.transform)
   });
  
//Code adapted from sreen020
// ------------------------------------------------------------------------------------
//Gets topojson from url and draws the paths of the townships with it
  json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(
    (data) => {
      const townships = feature(data, data.objects.gemeente_2020)
      
      g
        .selectAll('path')
        .data(townships.features)
        .enter().append('path')
        	.attr('d', pathGenerator)
        .append('title')
        .text((d) => `${d.properties.statnaam}`)
// ------------------------------------------------------------------------------------
      
//Handels the reset button 
// source: https://stackoverflow.com/questions/53056320/html-d3-js-how-to-zoom-from-the-mouse-cursor-rather-than-top-left-corner
  		resetButton
      	.attr('cursor', 'pointer')
      	.text('Reset Kaart')
      	.on('click', function(){
        	g.transition()
      			.duration(750)
      		.call(zoom.transform, d3.zoomIdentity)
      	})
      
      svg.call(zoom)
	}
)}

//Plots carparks all over the netherlands 
function drawCarParks (geoData) {     
//Sources: https://www.youtube.com/watch?v=MTR2T5VyxMc, https://www.youtube.com/watch?v=hrJ64jpYb0Aand and help from Gijs Laarman    
//Plots the dots on the map using the long and lat from the cleaned dataset
      g
      	.selectAll('g')
      	.data(geoData)
      	.enter().append('circle')
          .attr('cx', function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[0]  
          })
          .attr('cy', function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[1]
          })
  				.attr('class', 'carpark')
      		.attr('r', '0.4px')
}

//Plots the 25 largest dutch cities on the map  
function drawCities(cityData) {
   			g
      	.selectAll('g')
      	.data(cityData)
      	.enter().append('circle')
          .attr('cx', function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[0]  
          })
          .attr('cy', function(d){
            const long = d.longitude
            const lat = d.latitude
            return projection([+long, +lat])[1]
          })
  				.attr('class', 'city')
      		.attr('r', '1.5px')
}