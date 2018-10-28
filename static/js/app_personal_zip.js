function buildMap(zip){
    // Creating map object
    var map = L.map("map", {
        center: [38.6270, -90.1994],
        zoom: 12
    });

    //api request
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(map);
}

function getZipInfo(zip){
    //Get location on page to put data
    // var chartIDTag = d3.select("#charts");
    // document.getElementById("charts").innerHTML = "";
    // var ul = chartIDTag.append('ul');

    // //Get data for zip
    var zipURL = `/zip_data/${zip}`;

    d3.json(zipURL, function(data){ 
        myData = data.result[0];
        document.getElementById('business_rating').innerHTML = myData['busRating'];
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

function optionChanged(newZip) {
    //Fetch new data each time a new sample is selected
    //buildMap(newZip);
    console.log(newZip);
    getZipInfo(newZip);
}

  
getZipInfo("63109");






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




