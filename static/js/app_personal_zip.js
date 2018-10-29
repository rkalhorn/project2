
// Creating map object
var map = L.map("map", {
    center: [38.6270, -90.25],
    zoom: 12
});


//setTimeout(map.invalidateSize(), 1000);

//api request
var tile = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
})
tile.addTo(map);

var mapmargin = 50;
$('#map').css("height", ($(window).height() - mapmargin));
$(window).on("resize", resize);
resize();
function resize(){

    if($(window).width()>=980){
        $('#map').css("height", ($(window).height() - mapmargin));    
        $('#map').css("margin-top",50);
    }else{
        $('#map').css("height", ($(window).height() - (mapmargin+12)));    
        $('#map').css("margin-top",-21);
    }

}
map.invalidateSize();

// function buildMap(zip){

// }

function getZipInfo(zip){
    //Get location on page to put data
    // var chartIDTag = d3.select("#charts");
    // document.getElementById("charts").innerHTML = "";
    // var ul = chartIDTag.append('ul');

    // //Get data for zip
    var zipURL = `/zip_data/${zip}`;

    document.getElementById('business_rating').innerHTML = "";
    document.getElementById('education_rating').innerHTML = "";
    document.getElementById('crime_rating').innerHTML = "";
    document.getElementById('real_rating').innerHTML = "";

    d3.json(zipURL, function(data){ 
        myData = data.result[0];
        document.getElementById('business_rating').innerHTML = myData['busRating'];
        document.getElementById('education_rating').innerHTML = myData['edRating'];
        document.getElementById('crime_rating').innerHTML = myData['crimeRating'];
        document.getElementById('real_rating').innerHTML = myData['realRating'];
        //document.getElementById('business_rating').innerHTML =  ;
        
        mykeys = d3.keys(myData);

        myvalues = d3.values(myData);
        console.log(myvalues);
        var myobjects = mykeys.map(function(e, i) {
            var returnVal = e + " : "+ myvalues[i] + "</br>";
            console.log(returnVal);
            return returnVal;
        });
       
        // ul.selectAll('li')
        //     .data(myobjects)
        //     .enter()
        //     .append('li')
        //     .html(String); 
      });
}

function addMarkersToMap(zip){

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    tile.addTo(map);
    var zipURL = `/zip_map_data/${zip}`;
    console.log(zipURL);


    
    d3.json(zipURL, function(data){ 
        myData = data.result;

        

        var busMarkers = [];
        var edMarkers = [];

        for (var i = 0; i < myData.length; i++) {
          // loop through the data, create a new marker, push it to the cityMarkers array
          if(myData[i].type=="E"){
          edMarkers.push(
              L.circle([myData[i].lat,myData[i].lng], {color: 'black', weight: '1', fillColor: 'orange', fillOpacity: 0.5, radius: 200})
              .bindPopup("<p>" + myData[i].name + "</p>")
          );
          }
          else if(myData[i].type=="R"){
            edMarkers.push(
                L.circle([myData[i].lat,myData[i].lng], {color: 'black', weight: '1', fillColor: 'green', fillOpacity: 0.5, radius: 200})
                .bindPopup("<p>" + myData[i].name + "</p>")
            );
            }
          else if(myData[i].type=="B"){
              busMarkers.push(
            L.marker([myData[i].lat,myData[i].lng]).bindPopup("<p>" + myData[i].name + "</p>")
            );
              }
        }
        L.layerGroup(busMarkers).addTo(map);
        L.layerGroup(edMarkers).addTo(map);



        // myData.forEach(function(point){
        //     var lat = point.lat;
        //     var lon = point.lng;
        //     var feature = {type: 'Feature',
        //         properties: point,
        //         geometry: {
        //             type: 'Point',
        //             coordinates: [lon,lat]
        //         }
        //     };
        //     if(point.type == "B"){bjsonFeatures.push(feature);}
        //     else if(point.type == "C"){cjsonFeatures.push(feature);}
        //     else if(point.type == "E"){ejsonFeatures.push(feature);}
        //     else if(point.type == "R"){rjsonFeatures.push(feature);}
        // });
        //  console.log(bjsonFeatures);
        // var bgeoJson = { type: 'FeatureCollection', features: bjsonFeatures };
        // //var cgeoJson = { type: 'FeatureCollection', features: cjsonFeatures };
        // var egeoJson = { type: 'FeatureCollection', features: ejsonFeatures };
        // var rgeoJson = { type: 'FeatureCollection', features: rjsonFeatures };
        
        // var bgeojsonMarkerOptions = {
        //     radius: 8,
        //     fillColor: "#ff7800",
        //     color: "#000",
        //     weight: 1,
        //     opacity: 1,
        //     fillOpacity: 0.8
        // };
        
        

        // L.geoJSON(bgeoJson, {
        //     pointToLayer: function (feature, latlng) {
        //         return L.marker(latlng, bgeojsonMarkerOptions);
        //     }
        // }).addTo(map);







        // myData = data.result[0];
        // document.getElementById('business_rating').innerHTML = myData['busRating'];
        // document.getElementById('education_rating').innerHTML = myData['edRating'];
        // document.getElementById('crime_rating').innerHTML = myData['crimeRating'];
        // document.getElementById('real_rating').innerHTML = myData['realRating'];
        // //document.getElementById('business_rating').innerHTML =  ;
        
        // mykeys = d3.keys(myData);

        // myvalues = d3.values(myData);
        // console.log(myvalues);
        // var myobjects = mykeys.map(function(e, i) {
        //     var returnVal = e + " : "+ myvalues[i] + "</br>";
        //     console.log(returnVal);
        //     return returnVal;
        });
}


function optionChanged(newZip) {
    //Fetch new data each time a new sample is selected
    //buildMap(newZip);
    getZipInfo(newZip);
    addMarkersToMap(newZip);
}

  






// function chooseColor(borough){
//     switch(borough){
//         case "Brooklyn":
//             return "green";
//             break;
//         case "Bronx":
//             return "yellow";
//             break;
//         case "Staten Island":
//             return "red";
//             break;
//         case "Manhattan":
//             return "blue";
//             break;
//         case "Queens":
//             return "purple";
//             break;
//         default:
//             return "grey";
        
//     }
// }


// //D3 geoJson request
// d3.json(link, function(dataset){
//     L.geoJSON(dataset,{
//         style: function(feature){
//             return{
//                 color: "white",
//                 fillColor: chooseColor(feature.properties.borough),
//                 fillOpacity: 0.5,
//                 weight: 1.9
//             };
//         },
//         onEachFeature: function(feature, layer){
//             layer.on({
//                 mouseover: function(event){
//                     layer = event.target;
//                     layer.setStyle({
//                         fillOpacity: .75
//                     });
//                 },
//                 mouseout: function(event){
//                     layer = event.target;
//                     layer.setStyle({
//                         fillOpacity: .5
//                     });
//                 },
//                 click: function(event){
//                     map.fitBounds(event.target.getBounds());
//                 },
//             })
//             layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1>" +
//                             "<h2>" + feature.properties.borough + "</h2>"
//             );
//         }
//     }).addTo(map);
// });




