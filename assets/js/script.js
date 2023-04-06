var geocoder;
let map;
const searchButton = $("#searchButton");
const userCity = $("#userCity");
const amusementPark = $("#checkAmusement");
const aquarium = $("#checkAquarium");
const cafe = $("#checkCafe");
const campground = $("#checkCampground");
const casino = $("#checkCasino");
const restaurant = $("#checkRestaurant");
const museum = $("#checkMuseum");
const nightClub = $("#checkNight");
const shoppingMall = $("#checkShopping");
const tourist = $("#checkTourist");
const zoo = $("#checkZoo");

const attractionArr = [amusementPark, aquarium, cafe, campground, casino, restaurant, museum, nightClub, shoppingMall, tourist, zoo];
const typeArr = ["amusement_park", "aquarium", "cafe", "campground", "casino", "restaurant", "museum", "night_club", "shopping_mall", "tourist_attraction", "zoo"];


//array of coordinates
coordsArray = []

var markersArray = [];

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(36.174465, -86.767960);
    var mapOptions = {
        zoom: 13,
        center: latlng,
        styles: [ // this is removing the default icons on the map
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                {
                    visibility: "off",
                },
                ],
            },
            {
                featureType: "administrative",
                elementType: "labels",
                stylers: [
                {
                    visibility: "off",
                },
                ],
            },
            ],   
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
                position: results[0].geometry.location
            })
            latlng = JSON.parse(JSON.stringify(marker.position))
            console.log(latlng)
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
            type: [], // look through Google Maps Place Types documentation to see all possible filters
        }

        for (var i = 0; i < attractionArr.length; i++) {
            var checkedBox = attractionArr[i];
            if (checkedBox.is(":checked")) {
                request.type.push(typeArr[i]);
            } 
        }
        console.log(request.type);
        
        if (request.type.length > 0) { // only make the API call if at least one type is selected
            placeNameArray = [];
            markersArray = [];
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callBack);
        } else{ // if no type is selected, remove all markers from the map
            removeMarkers();
        }

        function callBack(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK){
                coordsArray = []; // empties coordsArray everytime the function is called so it doesnt stack
                for (var i = 0; i < results.length; i++){
                    placesCoords = JSON.parse(JSON.stringify(results[i].geometry.location)) // this gets the coordinates of each google place API request (it looks weird i know)
                    var newCoordObject = {
                        coords: placesCoords
                    }
                    coordsArray.push(newCoordObject)
                    placeNameArray.push(results[i].name);
                }
                resultsArray = results;
                console.log(resultsArray)
                placeMarkers(); // places markers after all of the coordinates are pushed into the array
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
        animation: google.maps.Animation.DROP,
        icon: {
            url: resultsArray[i].icon,
            scaledSize: new google.maps.Size(26,26)
        }
    })
    markersArray.push(marker) // stores anchor points in an array so that they can properly be removed
    if(resultsArray[i].rating){ // checks to see if a rating is applicable
        var infoWindow = new google.maps.InfoWindow({
            content:`
            <h4><strong>${placeNameArray[i]}</strong></h4> 
            Ratings: ${resultsArray[i].rating} out of 5 Stars (${resultsArray[i].user_ratings_total} total reviews)
            `
        })
    }else{
        var infoWindow = new google.maps.InfoWindow({
            content:`
            <h4><strong>${placeNameArray[i]}</strong></h4> (${resultsArray[i].user_ratings_total} total reviews)
            `
        })
    }

    marker.addListener('click', function(){ // changes the google maps window to be the center
        infoWindow.open(map, this);
        map.panTo(marker.position)
        infoWindowCounter++;
    })


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
