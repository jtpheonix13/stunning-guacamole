var geocoder;
let map;
const searchButton = $("#searchButton");
const userCity = $("#search-input");
const searchFormEl = $('#search-form')
const citySearch = $("#city-search");
const parks = $("#parks");
const museum = $("#museum");
const nightLife = $("#night-life");
const cafe = $("#cafe");
const tourist = $("#tourist");
const shopping = $("#shopping");
const zoo = $("#zoo");
const casino = $("#casino");
const campground = $("#campground");

//array of coordinates
coordsArray = [];

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

$("body").on("load", checkStorage());

function checkStorage () {
    var getCity = localStorage.getItem("city");
    console.log(getCity);

    if (getCity == "") {
        return;
    } else {
        geoCity(getCity);
    }

}


// function to get user input
function geoCity(getCity) {

    chosenCity = getCity;
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
            // add parks icons
            parks.on('click', addPark);
            museum.on('click', addMuseum);
            nightLife.on('click', addNightLife);
            cafe.on('click', addCafe);
            tourist.on('click', addTourist);
            shopping.on('click', addShopping);
            zoo.on('click', addZoo);
            casino.on('click', addCasino);
            campground.on('click', addCampground);

            function addCampground() {
                var icons = "campgroun";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addCasino() {
                var icons = "casino";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addZoo() {
                var icons = "zoo";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addShopping() {
                var icons = "shopping_mall";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addTourist() {
                var icons = "tourist_attraction";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addPark() {
                var icons = "park";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addMuseum() {
                var icons= "museum";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addNightLife() {
                var icons= "night_club";
                removeMarkers();
                getFilterMarkers(icons);
            }

            function addCafe() {
                var icons = "cafe";
                removeMarkers();
                getFilterMarkers(icons);
            }
        } else {
            alert("Geocode was not successful");
        }
    })



    function getFilterMarkers(type1){ // this will get the markers depending on the radius and type of place



        var request = {
            location: latlng,
            radius: '5000', // radius in meters
            type: [type1], // look through Google Maps Place Types documentation to see all possible filters
        }




        
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
    props.name = placeNameArray[i]
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
        baseURL = `https://www.reddit.com/search.json?q=${props.name}&type=comments`;
        getRedditPost(baseURL);
        infoWindow.open(map, this);
        map.panTo(marker.position);
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

};

initMap();

citySearch.on("click", saveCity);
searchFormEl.on("submit", function(event){
    event.preventDefault();
    saveCity();
    location.href ='selection1.html'
})

function saveCity () {
    chosenCity = userCity.val().trim();
    console.log(chosenCity);
    localStorage.setItem("city", chosenCity);

}

function getRedditPost(){
    console.log(baseURL)
  
    fetch(baseURL)
      .then(response =>{
        console.log(response);
        return response.json()
      })
      .then(data =>{
        var textValue;
        var titleValue;
        var authorValue;
        console.log(data.data.children);
  
        for(var i = 0; i < data.data.children.length; i++){ // this filters out any posts that dont have text
          if(data.data.children[i].data.selftext.trim().length > 0){
            textValue = `${data.data.children[i].data.selftext}`;
            titleValue = `${data.data.children[i].data.title}`;
            authorValue = `Posted by u/${data.data.children[i].data.author}`;
            console.log(textValue);
            console.log(titleValue);
            console.log(authorValue);
            i += data.data.children.length;
            continue;
          }
        }
        $('#reddit-author').html(authorValue); // this sets the text element in the HTML to whatever it gets from reddit and shortens it to the desired amount of letters
        if ($('#reddit-title').html(titleValue.substring(0, 150)) > 150){
            $('#reddit-title').html(titleValue.substring(0, 150) + '...'); 
        }else{
            $('#reddit-title').html(titleValue);
        }

        $('#reddit-text').html(textValue.substring(0, 1000) + '...'); 
      })
      .catch(err => console.error(err));
  }





