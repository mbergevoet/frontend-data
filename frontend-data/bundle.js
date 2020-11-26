(function (d3$1, topojson) {
  'use strict';

  //Code adapted from Laurens Aarnoudse
  //Checks if property exists and if not generates it and puts 1 in it
  function transformData(data){
    const selectedData = data.map(item => {
  		return {
      	areamanagerid: item.areamanagerid,
      	areageometryastext: getPropIfExists(item, 'areageometryastext')
      }
    });
    return selectedData
  }

  function getPropIfExists(dataObject, prop){
    if (!dataObject[prop]) return "1"
    return dataObject[prop]
  }

  // With help of Laurens Aarnoudse
  //Cleans the different formats into just one and separates the long and lat
  function cleanData(dataArray, key) {
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

  // Start code Laurens Aarnoudse

  //Global constants
  const endpointGeoPoints = 'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=6179';
  const endpointCities = 'https://gist.githubusercontent.com/mbergevoet/4481f67f9f218b91f7fe0a34c6407b4f/raw/9f8ddefb2a93335ea0e52a9a137ab3ecd5639535/cities.json';
  const colomnName = 'areageometryastext';
  const projection = d3$1.geoMercator().scale(5100).center([7.516667, 51.80]);
  const pathGenerator = d3$1.geoPath().projection(projection);
  const svg = d3.select('svg');
  const g = svg.append('g');
  const resetButton = d3.select('.reset');
  const changeButtonOne = d3.select('.changeOne');
  const changeButtonTwo = d3.select('.changeTwo');
  const changeButtonThree = d3.select('.changeThree');
  const changeButtonFour = d3.select('.changeFour');
    
  //"Master" function that makes all the magic happen
  makeViz();

  function makeViz(){

    drawMap();

   //Executes the getData function to fetch the data from the endpoint
    getData(endpointCities)
      .then((cityResponse) => {
        return cityResponse.json()
      })
      .then((cityData) => {
        const cityPointsArray = cityData;
        drawCities(cityPointsArray);
        console.log(cityPointsArray);
      });
    
    //Executes the getData function to fetch the data from the endpoint
    getData(endpointGeoPoints)
      .then((parkingDataResponse) => {
        return parkingDataResponse.json()
      })
      .then((parkingData) => {
        const transformedArray = transformData(parkingData);
        const geoPointsArray = cleanData(transformedArray, colomnName);
        console.log(geoPointsArray);
        drawCarParks(geoPointsArray);
      
  // Update functions, one for each button because for some reason paramaters cannot be passed in to a function that is called with .on
  // Idealy I would have wanted it to work like this .on('click', update(searchTerm)) so I could reuse the 
  // update function instead of writing four times

      function updateOne(){
          const carparks = d3.selectAll('.carpark').remove();
          const searchTerm = "363";
          const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm);
          drawCarParks(selectedPoints);
          console.log(selectedPoints);
      }

      function updateTwo(){
          const carparks = d3.selectAll('.carpark').remove();
          const searchTerm = "518";
          const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm);
          drawCarParks(selectedPoints);
          console.log(selectedPoints);
      }

      function updateThree(){
          const carparks = d3.selectAll('.carpark').remove();
          const searchTerm = "599";
          const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm);
          drawCarParks(selectedPoints);
          console.log(selectedPoints);
      }

      function updateFour(){
          const carparks = d3.selectAll('.carpark').remove();
          const searchTerm = "344";
          const selectedPoints = geoPointsArray.filter(item => item.areamanagerid == searchTerm);
          drawCarParks(selectedPoints);
          console.log(selectedPoints);
      }

    //on click handlers which executes the update functions
    //I chose the four most common areamanagerid are 363, 518, 599, 344 which corresponed with Amsterdam, Den Haag, Rotterdam, Utrecht 
        changeButtonOne
          .text('Amsterdam (ID: 363)')
          .on('click', updateOne);

        changeButtonTwo
          .text('Den Haag (ID: 518)')
          .on('click', updateTwo);

        changeButtonThree
          .text('Rotterdam (ID: 599)')
          .on('click', updateThree);

        changeButtonFour
          .text('Utreacht (ID: 344)')
          .on('click', updateFour);
      });
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
         g.attr('transform', e.transform);
     });
    
  //Code adapted from sreen020
  // ------------------------------------------------------------------------------------
  //Gets topojson from url and draws the paths of the townships with it
    d3$1.json('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson').then(
      (data) => {
        const townships = topojson.feature(data, data.objects.gemeente_2020);
        
        g
          .selectAll('path')
          .data(townships.features)
          .enter().append('path')
          	.attr('d', pathGenerator)
          .append('title')
          .text((d) => `${d.properties.statnaam}`);
  // ------------------------------------------------------------------------------------
        
  //Handels the reset button 
  // source: https://stackoverflow.com/questions/53056320/html-d3-js-how-to-zoom-from-the-mouse-cursor-rather-than-top-left-corner
    		resetButton
        	.attr('cursor', 'pointer')
        	.text('Reset Kaart')
        	.on('click', function(){
          	g.transition()
        			.duration(750)
        		.call(zoom.transform, d3.zoomIdentity);
        	});
        
        svg.call(zoom);
  	}
  );}

  //Plots carparks all over the netherlands 
  function drawCarParks (geoData) {     
  //Sources: https://www.youtube.com/watch?v=MTR2T5VyxMc, https://www.youtube.com/watch?v=hrJ64jpYb0Aand and help from Gijs Laarman    
  //Plots the dots on the map using the long and lat from the cleaned dataset
        g
        	.selectAll('g')
        	.data(geoData)
        	.enter().append('circle')
            .attr('cx', function(d){
              const long = d.longitude;
              const lat = d.latitude;
              return projection([+long, +lat])[0]  
            })
            .attr('cy', function(d){
              const long = d.longitude;
              const lat = d.latitude;
              return projection([+long, +lat])[1]
            })
    				.attr('class', 'carpark')
        		.attr('r', '0.4px');
  }

  //Plots the 25 largest dutch cities on the map  
  function drawCities(cityData) {
     			g
        	.selectAll('g')
        	.data(cityData)
        	.enter().append('circle')
            .attr('cx', function(d){
              const long = d.longitude;
              const lat = d.latitude;
              return projection([+long, +lat])[0]  
            })
            .attr('cy', function(d){
              const long = d.longitude;
              const lat = d.latitude;
              return projection([+long, +lat])[1]
            })
    				.attr('class', 'city')
        		.attr('r', '1.5px');
  }

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInRyYW5zZm9ybS5qcyIsImNsZWFuLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9Db2RlIGFkYXB0ZWQgZnJvbSBMYXVyZW5zIEFhcm5vdWRzZVxuLy9DaGVja3MgaWYgcHJvcGVydHkgZXhpc3RzIGFuZCBpZiBub3QgZ2VuZXJhdGVzIGl0IGFuZCBwdXRzIDEgaW4gaXRcbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEpe1xuICBjb25zdCBzZWxlY3RlZERhdGEgPSBkYXRhLm1hcChpdGVtID0+IHtcblx0XHRyZXR1cm4ge1xuICAgIFx0YXJlYW1hbmFnZXJpZDogaXRlbS5hcmVhbWFuYWdlcmlkLFxuICAgIFx0YXJlYWdlb21ldHJ5YXN0ZXh0OiBnZXRQcm9wSWZFeGlzdHMoaXRlbSwgJ2FyZWFnZW9tZXRyeWFzdGV4dCcpXG4gICAgfVxuICB9KVxuICByZXR1cm4gc2VsZWN0ZWREYXRhXG4gIGNvbnNvbGUubG9nKHNlbGVjdGVkRGF0YSlcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcElmRXhpc3RzKGRhdGFPYmplY3QsIHByb3Ape1xuICBpZiAoIWRhdGFPYmplY3RbcHJvcF0pIHJldHVybiBcIjFcIlxuICByZXR1cm4gZGF0YU9iamVjdFtwcm9wXVxufSIsIi8vIFdpdGggaGVscCBvZiBMYXVyZW5zIEFhcm5vdWRzZVxuLy9DbGVhbnMgdGhlIGRpZmZlcmVudCBmb3JtYXRzIGludG8ganVzdCBvbmUgYW5kIHNlcGFyYXRlcyB0aGUgbG9uZyBhbmQgbGF0XG5leHBvcnQgZnVuY3Rpb24gY2xlYW5EYXRhKGRhdGFBcnJheSwga2V5KSB7XG4gICAgcmV0dXJuIGRhdGFBcnJheS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZ2VvUG9pbnRzID0gaXRlbVtrZXldXG4gICAgICAgIC5yZXBsYWNlKCcgJywgJycpXG4gICAgICAgIC5yZXBsYWNlKCcsJywgJycpXG4gICAgICAgIC5yZXBsYWNlKCcpKScsICcnKVxuICAgICAgICAucmVwbGFjZSgnKCgnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJyknLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ0dFT01FVFJZQ09MTEVDVElPTkxJTkVTVFJJTkcnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ01VTFRJUE9MWUdPTicsICcnKVxuICAgICAgICAucmVwbGFjZSgnUE9JTlQnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ1BPTFlHT04nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJyknLCAnJylcbiAgICAgICAgLnNsaWNlKDAsIDI0KTtcbiAgICAgIGNvbnN0IGdlb0FycmF5ID0gZ2VvUG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICByZXR1cm4geyBhcmVhbWFuYWdlcmlkOiBpdGVtLmFyZWFtYW5hZ2VyaWQsIGxvbmdpdHVkZTogTnVtYmVyKGdlb0FycmF5WzBdKSwgbGF0aXR1ZGU6IE51bWJlcihnZW9BcnJheVsxXSkgfTtcbiAgfSk7XG59IiwiLy8gU3RhcnQgY29kZSBMYXVyZW5zIEFhcm5vdWRzZVxuLy9JbXBvcnRzIGZyb20gRDMgYW5kIGZ1bmN0aW9uIGltcG9ydHMgZnJvbSBvdGhlciBmaWxlc1xuaW1wb3J0IHsgc2VsZWN0LCBqc29uLCBnZW9QYXRoLCBnZW9NZXJjYXRvciwgem9vbSB9IGZyb20gJ2QzJ1xuaW1wb3J0IHsgZmVhdHVyZSB9IGZyb20gJ3RvcG9qc29uJ1xuaW1wb3J0IHsgdHJhbnNmb3JtRGF0YSB9IGZyb20gJy90cmFuc2Zvcm0uanMnXG5pbXBvcnQgeyBjbGVhbkRhdGEgfSBmcm9tICcvY2xlYW4uanMnXG5cbi8vR2xvYmFsIGNvbnN0YW50c1xuY29uc3QgZW5kcG9pbnRHZW9Qb2ludHMgPSAnaHR0cHM6Ly9vcGVuZGF0YS5yZHcubmwvcmVzb3VyY2UvbnNrMy12OW43Lmpzb24/JGxpbWl0PTYxNzknO1xuY29uc3QgZW5kcG9pbnRDaXRpZXMgPSAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tYmVyZ2V2b2V0LzQ0ODFmNjdmOWYyMThiOTFmN2ZlMGEzNGM2NDA3YjRmL3Jhdy85ZjhkZGVmYjJhOTMzMzVlYTBlNTJhOWExMzdhYjNlY2Q1NjM5NTM1L2NpdGllcy5qc29uJztcbmNvbnN0IGNvbG9tbk5hbWUgPSAnYXJlYWdlb21ldHJ5YXN0ZXh0JztcbmNvbnN0IHByb2plY3Rpb24gPSBnZW9NZXJjYXRvcigpLnNjYWxlKDUxMDApLmNlbnRlcihbNy41MTY2NjcsIDUxLjgwXSlcbmNvbnN0IHBhdGhHZW5lcmF0b3IgPSBnZW9QYXRoKCkucHJvamVjdGlvbihwcm9qZWN0aW9uKVxuY29uc3Qgc3ZnID0gZDMuc2VsZWN0KCdzdmcnKVxuY29uc3QgZyA9IHN2Zy5hcHBlbmQoJ2cnKVxuY29uc3QgcmVzZXRCdXR0b24gPSBkMy5zZWxlY3QoJy5yZXNldCcpXG5jb25zdCBjaGFuZ2VCdXR0b25PbmUgPSBkMy5zZWxlY3QoJy5jaGFuZ2VPbmUnKVxuY29uc3QgY2hhbmdlQnV0dG9uVHdvID0gZDMuc2VsZWN0KCcuY2hhbmdlVHdvJylcbmNvbnN0IGNoYW5nZUJ1dHRvblRocmVlID0gZDMuc2VsZWN0KCcuY2hhbmdlVGhyZWUnKVxuY29uc3QgY2hhbmdlQnV0dG9uRm91ciA9IGQzLnNlbGVjdCgnLmNoYW5nZUZvdXInKVxuICBcbi8vXCJNYXN0ZXJcIiBmdW5jdGlvbiB0aGF0IG1ha2VzIGFsbCB0aGUgbWFnaWMgaGFwcGVuXG5tYWtlVml6KClcblxuZnVuY3Rpb24gbWFrZVZpeigpe1xuXG4gIGRyYXdNYXAoKVxuXG4gLy9FeGVjdXRlcyB0aGUgZ2V0RGF0YSBmdW5jdGlvbiB0byBmZXRjaCB0aGUgZGF0YSBmcm9tIHRoZSBlbmRwb2ludFxuICBnZXREYXRhKGVuZHBvaW50Q2l0aWVzKVxuICAgIC50aGVuKChjaXR5UmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiBjaXR5UmVzcG9uc2UuanNvbigpXG4gICAgfSlcbiAgICAudGhlbigoY2l0eURhdGEpID0+IHtcbiAgICAgIGNvbnN0IGNpdHlQb2ludHNBcnJheSA9IGNpdHlEYXRhXG4gICAgICBkcmF3Q2l0aWVzKGNpdHlQb2ludHNBcnJheSlcbiAgICAgIGNvbnNvbGUubG9nKGNpdHlQb2ludHNBcnJheSlcbiAgICB9KVxuICBcbiAgLy9FeGVjdXRlcyB0aGUgZ2V0RGF0YSBmdW5jdGlvbiB0byBmZXRjaCB0aGUgZGF0YSBmcm9tIHRoZSBlbmRwb2ludFxuICBnZXREYXRhKGVuZHBvaW50R2VvUG9pbnRzKVxuICAgIC50aGVuKChwYXJraW5nRGF0YVJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcGFya2luZ0RhdGFSZXNwb25zZS5qc29uKClcbiAgICB9KVxuICAgIC50aGVuKChwYXJraW5nRGF0YSkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtZWRBcnJheSA9IHRyYW5zZm9ybURhdGEocGFya2luZ0RhdGEpXG4gICAgICBjb25zdCBnZW9Qb2ludHNBcnJheSA9IGNsZWFuRGF0YSh0cmFuc2Zvcm1lZEFycmF5LCBjb2xvbW5OYW1lKVxuICAgICAgY29uc29sZS5sb2coZ2VvUG9pbnRzQXJyYXkpXG4gICAgICBkcmF3Q2FyUGFya3MoZ2VvUG9pbnRzQXJyYXkpXG4gICAgXG4vLyBVcGRhdGUgZnVuY3Rpb25zLCBvbmUgZm9yIGVhY2ggYnV0dG9uIGJlY2F1c2UgZm9yIHNvbWUgcmVhc29uIHBhcmFtYXRlcnMgY2Fubm90IGJlIHBhc3NlZCBpbiB0byBhIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggLm9uXG4vLyBJZGVhbHkgSSB3b3VsZCBoYXZlIHdhbnRlZCBpdCB0byB3b3JrIGxpa2UgdGhpcyAub24oJ2NsaWNrJywgdXBkYXRlKHNlYXJjaFRlcm0pKSBzbyBJIGNvdWxkIHJldXNlIHRoZSBcbi8vIHVwZGF0ZSBmdW5jdGlvbiBpbnN0ZWFkIG9mIHdyaXRpbmcgZm91ciB0aW1lc1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlT25lKCl7XG4gICAgICAgIGNvbnN0IGNhcnBhcmtzID0gZDMuc2VsZWN0QWxsKCcuY2FycGFyaycpLnJlbW92ZSgpXG4gICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBcIjM2M1wiXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkUG9pbnRzID0gZ2VvUG9pbnRzQXJyYXkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hcmVhbWFuYWdlcmlkID09IHNlYXJjaFRlcm0pXG4gICAgICAgIGRyYXdDYXJQYXJrcyhzZWxlY3RlZFBvaW50cylcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQb2ludHMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlVHdvKCl7XG4gICAgICAgIGNvbnN0IGNhcnBhcmtzID0gZDMuc2VsZWN0QWxsKCcuY2FycGFyaycpLnJlbW92ZSgpXG4gICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBcIjUxOFwiXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkUG9pbnRzID0gZ2VvUG9pbnRzQXJyYXkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hcmVhbWFuYWdlcmlkID09IHNlYXJjaFRlcm0pXG4gICAgICAgIGRyYXdDYXJQYXJrcyhzZWxlY3RlZFBvaW50cylcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQb2ludHMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlVGhyZWUoKXtcbiAgICAgICAgY29uc3QgY2FycGFya3MgPSBkMy5zZWxlY3RBbGwoJy5jYXJwYXJrJykucmVtb3ZlKClcbiAgICAgICAgY29uc3Qgc2VhcmNoVGVybSA9IFwiNTk5XCJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRQb2ludHMgPSBnZW9Qb2ludHNBcnJheS5maWx0ZXIoaXRlbSA9PiBpdGVtLmFyZWFtYW5hZ2VyaWQgPT0gc2VhcmNoVGVybSlcbiAgICAgICAgZHJhd0NhclBhcmtzKHNlbGVjdGVkUG9pbnRzKVxuICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFBvaW50cylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVGb3VyKCl7XG4gICAgICAgIGNvbnN0IGNhcnBhcmtzID0gZDMuc2VsZWN0QWxsKCcuY2FycGFyaycpLnJlbW92ZSgpXG4gICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBcIjM0NFwiXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkUG9pbnRzID0gZ2VvUG9pbnRzQXJyYXkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hcmVhbWFuYWdlcmlkID09IHNlYXJjaFRlcm0pXG4gICAgICAgIGRyYXdDYXJQYXJrcyhzZWxlY3RlZFBvaW50cylcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQb2ludHMpXG4gICAgfVxuXG4gIC8vb24gY2xpY2sgaGFuZGxlcnMgd2hpY2ggZXhlY3V0ZXMgdGhlIHVwZGF0ZSBmdW5jdGlvbnNcbiAgLy9JIGNob3NlIHRoZSBmb3VyIG1vc3QgY29tbW9uIGFyZWFtYW5hZ2VyaWQgYXJlIDM2MywgNTE4LCA1OTksIDM0NCB3aGljaCBjb3JyZXNwb25lZCB3aXRoIEFtc3RlcmRhbSwgRGVuIEhhYWcsIFJvdHRlcmRhbSwgVXRyZWNodCBcbiAgICAgIGNoYW5nZUJ1dHRvbk9uZVxuICAgICAgICAudGV4dCgnQW1zdGVyZGFtIChJRDogMzYzKScpXG4gICAgICAgIC5vbignY2xpY2snLCB1cGRhdGVPbmUpXG5cbiAgICAgIGNoYW5nZUJ1dHRvblR3b1xuICAgICAgICAudGV4dCgnRGVuIEhhYWcgKElEOiA1MTgpJylcbiAgICAgICAgLm9uKCdjbGljaycsIHVwZGF0ZVR3bylcblxuICAgICAgY2hhbmdlQnV0dG9uVGhyZWVcbiAgICAgICAgLnRleHQoJ1JvdHRlcmRhbSAoSUQ6IDU5OSknKVxuICAgICAgICAub24oJ2NsaWNrJywgdXBkYXRlVGhyZWUpXG5cbiAgICAgIGNoYW5nZUJ1dHRvbkZvdXJcbiAgICAgICAgLnRleHQoJ1V0cmVhY2h0IChJRDogMzQ0KScpXG4gICAgICAgIC5vbignY2xpY2snLCB1cGRhdGVGb3VyKVxuICAgIH0pXG59XG5cbi8vRmV0Y2hlcyB0aGUgZGF0YSBmcm9tIGdpdmVuIHVybFxuZnVuY3Rpb24gZ2V0RGF0YSh1cmwpIHtcbiAgcmV0dXJuIGZldGNoKHVybClcbn1cblxuLy9EcmF3cyBtYXAgdXNpbmcgYSB0b3duc2hpcCBvdXRsaW5lIGRhdGFzZXRcbmZ1bmN0aW9uIGRyYXdNYXAoKSB7XG5cbiAgY29uc3Qgem9vbSA9IGQzLnpvb20oKVxuICAgLnNjYWxlRXh0ZW50KFsxLCA4XSlcbiAgIC5vbignem9vbScsICAoZSkgPT4ge1xuICAgICAgIGcuYXR0cigndHJhbnNmb3JtJywgZS50cmFuc2Zvcm0pXG4gICB9KTtcbiAgXG4vL0NvZGUgYWRhcHRlZCBmcm9tIHNyZWVuMDIwXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vR2V0cyB0b3BvanNvbiBmcm9tIHVybCBhbmQgZHJhd3MgdGhlIHBhdGhzIG9mIHRoZSB0b3duc2hpcHMgd2l0aCBpdFxuICBqc29uKCdodHRwczovL2NhcnRvbWFwLmdpdGh1Yi5pby9ubC93Z3M4NC9nZW1lZW50ZV8yMDIwLnRvcG9qc29uJykudGhlbihcbiAgICAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdG93bnNoaXBzID0gZmVhdHVyZShkYXRhLCBkYXRhLm9iamVjdHMuZ2VtZWVudGVfMjAyMClcbiAgICAgIFxuICAgICAgZ1xuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgLmRhdGEodG93bnNoaXBzLmZlYXR1cmVzKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICBcdC5hdHRyKCdkJywgcGF0aEdlbmVyYXRvcilcbiAgICAgICAgLmFwcGVuZCgndGl0bGUnKVxuICAgICAgICAudGV4dCgoZCkgPT4gYCR7ZC5wcm9wZXJ0aWVzLnN0YXRuYWFtfWApXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFxuLy9IYW5kZWxzIHRoZSByZXNldCBidXR0b24gXG4vLyBzb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUzMDU2MzIwL2h0bWwtZDMtanMtaG93LXRvLXpvb20tZnJvbS10aGUtbW91c2UtY3Vyc29yLXJhdGhlci10aGFuLXRvcC1sZWZ0LWNvcm5lclxuICBcdFx0cmVzZXRCdXR0b25cbiAgICAgIFx0LmF0dHIoJ2N1cnNvcicsICdwb2ludGVyJylcbiAgICAgIFx0LnRleHQoJ1Jlc2V0IEthYXJ0JylcbiAgICAgIFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0Zy50cmFuc2l0aW9uKClcbiAgICAgIFx0XHRcdC5kdXJhdGlvbig3NTApXG4gICAgICBcdFx0LmNhbGwoem9vbS50cmFuc2Zvcm0sIGQzLnpvb21JZGVudGl0eSlcbiAgICAgIFx0fSlcbiAgICAgIFxuICAgICAgc3ZnLmNhbGwoem9vbSlcblx0fVxuKX1cblxuLy9QbG90cyBjYXJwYXJrcyBhbGwgb3ZlciB0aGUgbmV0aGVybGFuZHMgXG5mdW5jdGlvbiBkcmF3Q2FyUGFya3MgKGdlb0RhdGEpIHsgICAgIFxuLy9Tb3VyY2VzOiBodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PU1UUjJUNVZ5eE1jLCBodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWhySjY0anBZYjBBYW5kIGFuZCBoZWxwIGZyb20gR2lqcyBMYWFybWFuICAgIFxuLy9QbG90cyB0aGUgZG90cyBvbiB0aGUgbWFwIHVzaW5nIHRoZSBsb25nIGFuZCBsYXQgZnJvbSB0aGUgY2xlYW5lZCBkYXRhc2V0XG4gICAgICBnXG4gICAgICBcdC5zZWxlY3RBbGwoJ2cnKVxuICAgICAgXHQuZGF0YShnZW9EYXRhKVxuICAgICAgXHQuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgLmF0dHIoJ2N4JywgZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICBjb25zdCBsb25nID0gZC5sb25naXR1ZGVcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IGQubGF0aXR1ZGVcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0aW9uKFsrbG9uZywgK2xhdF0pWzBdICBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hdHRyKCdjeScsIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgY29uc3QgbG9uZyA9IGQubG9uZ2l0dWRlXG4gICAgICAgICAgICBjb25zdCBsYXQgPSBkLmxhdGl0dWRlXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbK2xvbmcsICtsYXRdKVsxXVxuICAgICAgICAgIH0pXG4gIFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2NhcnBhcmsnKVxuICAgICAgXHRcdC5hdHRyKCdyJywgJzAuNHB4Jylcbn1cblxuLy9QbG90cyB0aGUgMjUgbGFyZ2VzdCBkdXRjaCBjaXRpZXMgb24gdGhlIG1hcCAgXG5mdW5jdGlvbiBkcmF3Q2l0aWVzKGNpdHlEYXRhKSB7XG4gICBcdFx0XHRnXG4gICAgICBcdC5zZWxlY3RBbGwoJ2cnKVxuICAgICAgXHQuZGF0YShjaXR5RGF0YSlcbiAgICAgIFx0LmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgIC5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgY29uc3QgbG9uZyA9IGQubG9uZ2l0dWRlXG4gICAgICAgICAgICBjb25zdCBsYXQgPSBkLmxhdGl0dWRlXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbK2xvbmcsICtsYXRdKVswXSAgXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuYXR0cignY3knLCBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgIGNvbnN0IGxvbmcgPSBkLmxvbmdpdHVkZVxuICAgICAgICAgICAgY29uc3QgbGF0ID0gZC5sYXRpdHVkZVxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oWytsb25nLCArbGF0XSlbMV1cbiAgICAgICAgICB9KVxuICBcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdjaXR5JylcbiAgICAgIFx0XHQuYXR0cigncicsICcxLjVweCcpXG59Il0sIm5hbWVzIjpbImdlb01lcmNhdG9yIiwiZ2VvUGF0aCIsImpzb24iLCJmZWF0dXJlIl0sIm1hcHBpbmdzIjoiOzs7RUFBQTtFQUNBO0VBQ08sU0FBUyxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ25DLEVBQUUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUk7RUFDeEMsRUFBRSxPQUFPO0VBQ1QsS0FBSyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7RUFDdEMsS0FBSyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDO0VBQ3BFLEtBQUs7RUFDTCxHQUFHLEVBQUM7RUFDSixFQUFFLE9BQU8sWUFBWTtFQUVyQixDQUFDO0FBQ0Q7RUFDQSxTQUFTLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBQzFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEdBQUc7RUFDbkMsRUFBRSxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUM7RUFDekI7O0VDaEJBO0VBQ0E7RUFDTyxTQUFTLFNBQVMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0VBQzFDLElBQUksT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLO0VBQ25DLFFBQVEsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNuQyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQ3pCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7RUFDekIsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztFQUMxQixTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO0VBQzFCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7RUFDekIsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztFQUN6QixTQUFTLE9BQU8sQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLENBQUM7RUFDcEQsU0FBUyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQztFQUNwQyxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0VBQzdCLFNBQVMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7RUFDL0IsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztFQUN6QixTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQ3pCLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUN0QixNQUFNLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDNUMsTUFBTSxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDbEgsR0FBRyxDQUFDLENBQUM7RUFDTDs7RUNyQkE7QUFNQTtFQUNBO0VBQ0EsTUFBTSxpQkFBaUIsR0FBRyw2REFBNkQsQ0FBQztFQUN4RixNQUFNLGNBQWMsR0FBRyx5SUFBeUksQ0FBQztFQUNqSyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztFQUN4QyxNQUFNLFVBQVUsR0FBR0EsZ0JBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUM7RUFDdEUsTUFBTSxhQUFhLEdBQUdDLFlBQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUM7RUFDdEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDNUIsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUM7RUFDekIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUM7RUFDdkMsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUM7RUFDL0MsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUM7RUFDL0MsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBQztFQUNuRCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFDO0VBQ2pEO0VBQ0E7RUFDQSxPQUFPLEdBQUU7QUFDVDtFQUNBLFNBQVMsT0FBTyxFQUFFO0FBQ2xCO0VBQ0EsRUFBRSxPQUFPLEdBQUU7QUFDWDtFQUNBO0VBQ0EsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDO0VBQ3pCLEtBQUssSUFBSSxDQUFDLENBQUMsWUFBWSxLQUFLO0VBQzVCLE1BQU0sT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFO0VBQ2hDLEtBQUssQ0FBQztFQUNOLEtBQUssSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLO0VBQ3hCLE1BQU0sTUFBTSxlQUFlLEdBQUcsU0FBUTtFQUN0QyxNQUFNLFVBQVUsQ0FBQyxlQUFlLEVBQUM7RUFDakMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBQztFQUNsQyxLQUFLLEVBQUM7RUFDTjtFQUNBO0VBQ0EsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUM7RUFDNUIsS0FBSyxJQUFJLENBQUMsQ0FBQyxtQkFBbUIsS0FBSztFQUNuQyxNQUFNLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxFQUFFO0VBQ3ZDLEtBQUssQ0FBQztFQUNOLEtBQUssSUFBSSxDQUFDLENBQUMsV0FBVyxLQUFLO0VBQzNCLE1BQU0sTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFDO0VBQ3pELE1BQU0sTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsRUFBQztFQUNwRSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFDO0VBQ2pDLE1BQU0sWUFBWSxDQUFDLGNBQWMsRUFBQztFQUNsQztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxTQUFTLFNBQVMsRUFBRTtFQUN4QixRQUFRLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxHQUFFO0VBQzFELFFBQVEsTUFBTSxVQUFVLEdBQUcsTUFBSztFQUNoQyxRQUFRLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksVUFBVSxFQUFDO0VBQzlGLFFBQVEsWUFBWSxDQUFDLGNBQWMsRUFBQztFQUNwQyxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFDO0VBQ25DLEtBQUs7QUFDTDtFQUNBLElBQUksU0FBUyxTQUFTLEVBQUU7RUFDeEIsUUFBUSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sR0FBRTtFQUMxRCxRQUFRLE1BQU0sVUFBVSxHQUFHLE1BQUs7RUFDaEMsUUFBUSxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLFVBQVUsRUFBQztFQUM5RixRQUFRLFlBQVksQ0FBQyxjQUFjLEVBQUM7RUFDcEMsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBQztFQUNuQyxLQUFLO0FBQ0w7RUFDQSxJQUFJLFNBQVMsV0FBVyxFQUFFO0VBQzFCLFFBQVEsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEdBQUU7RUFDMUQsUUFBUSxNQUFNLFVBQVUsR0FBRyxNQUFLO0VBQ2hDLFFBQVEsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxVQUFVLEVBQUM7RUFDOUYsUUFBUSxZQUFZLENBQUMsY0FBYyxFQUFDO0VBQ3BDLFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUM7RUFDbkMsS0FBSztBQUNMO0VBQ0EsSUFBSSxTQUFTLFVBQVUsRUFBRTtFQUN6QixRQUFRLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxHQUFFO0VBQzFELFFBQVEsTUFBTSxVQUFVLEdBQUcsTUFBSztFQUNoQyxRQUFRLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksVUFBVSxFQUFDO0VBQzlGLFFBQVEsWUFBWSxDQUFDLGNBQWMsRUFBQztFQUNwQyxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFDO0VBQ25DLEtBQUs7QUFDTDtFQUNBO0VBQ0E7RUFDQSxNQUFNLGVBQWU7RUFDckIsU0FBUyxJQUFJLENBQUMscUJBQXFCLENBQUM7RUFDcEMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQztBQUMvQjtFQUNBLE1BQU0sZUFBZTtFQUNyQixTQUFTLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztFQUNuQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFDO0FBQy9CO0VBQ0EsTUFBTSxpQkFBaUI7RUFDdkIsU0FBUyxJQUFJLENBQUMscUJBQXFCLENBQUM7RUFDcEMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBQztBQUNqQztFQUNBLE1BQU0sZ0JBQWdCO0VBQ3RCLFNBQVMsSUFBSSxDQUFDLG9CQUFvQixDQUFDO0VBQ25DLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUM7RUFDaEMsS0FBSyxFQUFDO0VBQ04sQ0FBQztBQUNEO0VBQ0E7RUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7RUFDdEIsRUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7RUFDbkIsQ0FBQztBQUNEO0VBQ0E7RUFDQSxTQUFTLE9BQU8sR0FBRztBQUNuQjtFQUNBLEVBQUUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRTtFQUN4QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2QixJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUs7RUFDdkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFDO0VBQ3ZDLElBQUksQ0FBQyxDQUFDO0VBQ047RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFQyxTQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQyxJQUFJO0VBQ3pFLElBQUksQ0FBQyxJQUFJLEtBQUs7RUFDZCxNQUFNLE1BQU0sU0FBUyxHQUFHQyxnQkFBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBQztFQUNqRTtFQUNBLE1BQU0sQ0FBQztFQUNQLFNBQVMsU0FBUyxDQUFDLE1BQU0sQ0FBQztFQUMxQixTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0VBQ2pDLFNBQVMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUMvQixVQUFVLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDO0VBQ2xDLFNBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQztFQUN4QixTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO0VBQ2hEO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxXQUFXO0VBQ2YsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztFQUNqQyxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUM7RUFDM0IsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVU7RUFDOUIsU0FBUyxDQUFDLENBQUMsVUFBVSxFQUFFO0VBQ3ZCLFVBQVUsUUFBUSxDQUFDLEdBQUcsQ0FBQztFQUN2QixTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxZQUFZLEVBQUM7RUFDOUMsUUFBUSxFQUFDO0VBQ1Q7RUFDQSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0VBQ3BCLEVBQUU7RUFDRixFQUFDLENBQUM7QUFDRjtFQUNBO0VBQ0EsU0FBUyxZQUFZLEVBQUUsT0FBTyxFQUFFO0VBQ2hDO0VBQ0E7RUFDQSxNQUFNLENBQUM7RUFDUCxRQUFRLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFDdEIsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDO0VBQ3JCLFFBQVEsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUNoQyxXQUFXLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDakMsWUFBWSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsVUFBUztFQUNwQyxZQUFZLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFRO0VBQ2xDLFlBQVksT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQy9DLFdBQVcsQ0FBQztFQUNaLFdBQVcsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztFQUNqQyxZQUFZLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFTO0VBQ3BDLFlBQVksTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFNBQVE7RUFDbEMsWUFBWSxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0MsV0FBVyxDQUFDO0VBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztFQUMvQixTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFDO0VBQzNCLENBQUM7QUFDRDtFQUNBO0VBQ0EsU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFO0VBQzlCLE1BQU0sQ0FBQztFQUNQLFFBQVEsU0FBUyxDQUFDLEdBQUcsQ0FBQztFQUN0QixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUM7RUFDdEIsUUFBUSxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQ2hDLFdBQVcsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztFQUNqQyxZQUFZLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFTO0VBQ3BDLFlBQVksTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFNBQVE7RUFDbEMsWUFBWSxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0MsV0FBVyxDQUFDO0VBQ1osV0FBVyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQ2pDLFlBQVksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVM7RUFDcEMsWUFBWSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUTtFQUNsQyxZQUFZLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMvQyxXQUFXLENBQUM7RUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO0VBQzVCLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUM7RUFDM0I7Ozs7In0=