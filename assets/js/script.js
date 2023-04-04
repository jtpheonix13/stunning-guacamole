var geocoder;
let map;
const searchButton = $("#searchButton");
const userCity = $("#userCity");

//array of coordinates
var coordsArray = [];

var markersArray = [];

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(36.174465, -86.767960);
    var mapOptions = {
        zoom: 13,
        center: latlng
    }

map = new Map(document.getElementById('map'), mapOptions);
// event listener on the button
searchButton.on("click", geoCity);

// function to get user input
function geoCity() {

    chosenCity = userCity.val().trim();
    console.log(chosenCity);

    geocoder.geocode({address: chosenCity}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location)
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
            })
            latlng = JSON.parse(JSON.stringify(marker.position))
            console.log(latlng);
            console.log(results[0])
            markersArray.push(marker) // pushes the city marker to the markersArray because it wouldn't disappear otherwise
            removeMarkers();
            getFilterMarkers();
        } else {
            alert("Geocode was not successful");
        }
    })

    function getFilterMarkers(){ // this will get the markers depending on the radius and type of place
        var request = {
            location: latlng,
            radius: '5000', // radius in meters
            type: ['restaurant'] // look through Google Maps Place Types documentation to see all possible filters
        }
        placeNameArray = [];
        markersArray = [];
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callBack);
        
        function callBack(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK){
                coordsArray = []; // empties coordsArray everytime the function is called so it doesnt stack
                for (var i = 0; i < results.length; i++){
                    placesCoords = JSON.parse(JSON.stringify(results[i].geometry.location)) // this gets the coordinates of each google place API request (it looks weird i know)
                    var newCoordObject = {
                        coords: placesCoords
                    }
                    coordsArray.push(newCoordObject)
                    // console.log(results[i].name)
                    placeNameArray.push(results[i].name);
                }
                console.log(coordsArray)
                console.log(request)
                placeMarkers(); // places markers after all of the coordinates are pushed into the array
                console.log(markersArray)
            }
            else{
                console.log('something went wrong')
                console.error(status);
                console.log(results)
            }
        }
    }
    }

    // adds markers
    function addMarker(props){
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
    })
    markersArray.push(marker) // stores anchor points in an array so that they can properly be removed
    var infoWindow = new google.maps.InfoWindow({
        content:placeNameArray[i]
    })
    marker.addListener('click', function(){
        infoWindow.close(map);
        infoWindow.open(map, this);
    })
    console.log(markersArray)
    console.log(placeNameArray)
}

// loops through every coordinate in the coordsArray and adds a marker to it
function placeMarkers(){
    for(i = 0; i < coordsArray.length; i++){
        addMarker(coordsArray[i])
    }
}

function removeMarkers(){
    for(var i = 0; i < markersArray.length; i++){
        markersArray[i].setMap(null);
    }
}

}

initMap();
