











let map;
// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.

    var options = {
        center: {lat: 36.1627, lng: -86.7816},
        zoom: 8
    }

    //array of coordinates
    coordsArray = []
    

    map = new Map($('#map')[0], options) // initializes the map, its location, and its zoom based on the options object

    geocoder = new google.maps.Geocoder();

var request = {
    location: {lat: 36.1627, lng: -86.7816},
    radius: '5000', // radius in meters
    type: ['doctor'] // look through Google Maps Place Types documentation to see all possible filters
}

service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, callBack);

function callBack(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        for (var i = 0; i < results.length; i++){
            placesCoords = JSON.parse(JSON.stringify(results[i].geometry.location)) // this gets the coordinates of each google place API request (it looks weird i know)
            var newCoordObject = {
                coords: placesCoords
            }
            coordsArray.push(newCoordObject)
            // coordsArray.push(JSON.parse(JSON.stringify(results[i].geometry.location)))
            console.log(newCoordObject);
            // console.log(JSON.parse(JSON.stringify(results[i].geometry.location)))
            console.log(results[i])
        }
        console.log(coordsArray)
        placeMarkers(); // places markers after all of the coordinates are pushed into the array
    }
    else{
        console.log('something went wrong')
        console.error(status);
        console.log(results)
    }
}

    //TODO change this from a window prompt to reading an html input element later
    function askQuestion(){
        addressal = window.prompt('input a location');
    }
    askQuestion();

    function getGeoCode(){
        geocoder.geocode({
            address: addressal // makes the address changeable depending on user input
        }, (results, status) =>{
            if (status == google.maps.GeocoderStatus.OK){
            var searchCoordsLat = results[0].geometry.location.lat(); // gets latitude
            var searchCoordsLng = results[0].geometry.location.lng(); // gets longitude

            // this object will be pushed onto the coordsArray
            var newCoordObject =             
            {
                coords: {lat: searchCoordsLat, lng: searchCoordsLng}
            };

            console.log(results);
            console.log(newCoordObject)
            coordsArray.push(newCoordObject) // pushes the newCoordObject to the coordsArray
            placeMarkers(); // places marker to the coordinates
            }else{
                console.log(`Error status: ${status}`);
            }
        })
    }
    getGeoCode();

    // adds markers
    function addMarker(props){
            var marker = new google.maps.Marker({
                position: props.coords,
                map: map
        })
    }

    // loops through every coordinate in the coordsArray and adds a marker to it
    function placeMarkers(){
        for(var i = 0; i < coordsArray.length; i++){
            addMarker(coordsArray[i])
            console.log(i)
        }
    }
}

initMap();




