
// Creating map object
var map = L.map("map", {
    center: [38.6270, -90.25],
    zoom: 12,
    zoomDelta: 0.25,
    zoomSnap: .1
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
        
        map.panTo(new L.LatLng(myData['lat'], myData['lng']));
        map.setZoom(12.5);

 
       
         
      });
}

function addMarkersToMap(zip){
    
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    tile.addTo(map);
    var zipURL = `/zip_map_data/${zip}`;

    
    d3.json(zipURL, function(data){ 
        myData = data.result;

        var busMarkers = [];
        var edMarkers = [];
        var relMarkers = [];

        for (var i = 0; i < myData.length; i++) {
          // loop through the data, create a new marker, push it to the cityMarkers array
          if(myData[i].type=="E"){
          edMarkers.push(
              L.circle([myData[i].lat,myData[i].lng], {color: 'black', weight: '1', fillColor: 'orange', fillOpacity: 0.5, radius: 200})
              .bindPopup("<p>" + myData[i].name + "</p>")
          );
          }
          else if(myData[i].type=="R"){
            relMarkers.push(
                L.circle([myData[i].lat,myData[i].lng], {color: 'black', weight: '1', fillColor: 'green', fillOpacity: 0.5, radius: 200})
                .bindPopup("<p>" + myData[i].name + "</p>")
            );
            }
          else if(myData[i].type=="B"){
              busMarkers.push(
                L.circle([myData[i].lat,myData[i].lng], {color: 'black', weight: '1', fillColor: 'blue', fillOpacity: 0.5, radius: 200})
                .bindPopup("<p>" + myData[i].name + "</p>")
            
            );
              }
        }
        L.layerGroup(busMarkers).addTo(map);
        L.layerGroup(edMarkers).addTo(map);
        L.layerGroup(relMarkers).addTo(map);
        });
        
        
        
        var zipURL2 = `/zip_nbhd_data/${zip}`;
        var nbhdMarkers = [];
    d3.json(zipURL2, function(data){
        
        myData = data.result;
        
        
        var nbhds = [];
        for (var i = 0; i < myData.length; i++){
            var mylat = myData[i]['lat'];
            var mylng = myData[i]['lng'];
            var mynbhd = myData[i]['neighborhood'];

console.log(mylng);
            if(nbhds.indexOf(mynbhd)<0){

                nbhds.push(mynbhd);

                nbhdMarkers.push(
                    L.marker([mylat,-mylng]).bindPopup("<p>" + mynbhd + "</p>")
                    );
                
            }
            
        }
        L.layerGroup(nbhdMarkers).addTo(map);
         
    });
    
}

function addNbhdTable(zip){
    var zipURL = `/zip_nbhd_data/${zip}`;
    document.getElementById("mytable").innerHTML = "";
   
    //create table
    var table = document.createElement('table');
    document.getElementById("mytable").appendChild(table);
    
    var nbhds = [];

    var cols = ['Neighborhood', 'Population (Census 2010)', 'Wikipedia Page for Neighborhood'];
    // Add the header row.
    var header = table.createTHead();
    var row = header.insertRow(-1);
    for (var i = 0; i < cols.length; i++) {
        var headerCell = document.createElement('th');
        headerCell.innerText = cols[i]; 
        row.appendChild(headerCell);
    }
    // Create table body.
 
    var tBody = document.createElement('tbody');
 
    table.appendChild(tBody);

     // Add the data rows to the table body.
 
    d3.json(zipURL, function(data){
        
        myData = data.result;
        for (var i = 0; i < myData.length; i++){
            var nbhd = myData[i]['neighborhood'];
            var pop = myData[i]['pop(census2010)'];
            var wiki = myData[i]['wiki'];
            var mylink = myData[i]['nbhdProfile'];

            if(nbhds.indexOf(nbhd)<0){

                nbhds.push(nbhd);
                row = tBody.insertRow(-1);
     
                
                var cell1 = row.insertCell(-1);
                cell1.setAttribute('data-label', cols[0]);
                var cellLink = document.createElement("a");
                cellLink.setAttribute("href", mylink);
                cellLink.innerHTML= nbhd;
                cell1.appendChild(cellLink);

                
                //var mylink = document.createElement("a");
                // cell1.setAttribute('href',link);
                // cell1.innerText = nbhd;    

                var cell2 = row.insertCell(-1);
                cell2.setAttribute('data-label', cols[1]);
                cell2.innerText = pop;    

                var cell3 = row.insertCell(-1);
                cell3.setAttribute('data-label', cols[2]);
                cell3.innerText = wiki; 


        
            }
            
        }
         
    });
         
}

function optionChanged(newZip) {
    //Fetch new data each time a new sample is selected
    //buildMap(newZip);
    getZipInfo(newZip);
    addMarkersToMap(newZip);
    addNbhdTable(newZip);
}

  









