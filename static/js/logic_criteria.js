document.getElementById("filter").style.visibility = "hidden";
document.getElementById("explore").style.visibility = "hidden";

// Creating map object
var map = L.map("map", {
    center: [38.6270, -90.1994],
    zoom: 12
});


//setTimeout(map.invalidateSize(), 1000);

//api request
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

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





//importance levels for business, crime, education, and realty in this order. Initialized all to zero.
var importance = [0,0,0,0];
var categories = ["business", "crime","education", "realty"];



//document.getElementById("filter-btn").addEventListener("click", clickFunction);
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    
}

function dropDownSelectedFunction(select){
    var optionChosen = select.getAttribute("value");
    if (optionChosen == "filter"){
      document.getElementById("filter").style.visibility = "visible";
      document.getElementById("explore").style.visibility = "hidden";
    }
    else if(optionChosen == "explore"){
      document.getElementById("filter").style.visibility = "hidden";
      document.getElementById("explore").style.visibility = "visible";
    }
      
}

function importanceDropDown(select){
  var category = select.getAttribute("id");
  var importanceLevel=Number(select.value);
  var catNum =-1;


  if(category == "businessImportance"){ catNum = 0;}
  else if(category == "crimeImportance"){ catNum = 1;}
  else if(category == "educationImportance"){ catNum = 2;}
  else if(category == "realtyImportance"){ catNum = 3;}
  
  importance[catNum] = importanceLevel;

  for (var i = 0; i<4; i++){
    if (i != catNum){
      var selectedObject = document.getElementById(categories[i]+"Importance");
      console.log(selectedObject);
      for (var j=0; j<selectedObject.length; j++){
        if (selectedObject.options[j].value == select.value){
           selectedObject.remove(j);
        }
      }
    }
  }
 
  console.log(importance);
}



  

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



// // geoJson URL
// var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
// "35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";



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




