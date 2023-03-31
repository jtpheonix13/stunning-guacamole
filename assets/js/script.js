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
        coordsArray = [
            {
                coords: {lat: 36.1627, lng: -86.7816}
            },
            {
                coords: {lat: 36.6627, lng: -86.2816}
            }
        ]

    map = new Map($('#map')[0], options)

    geocoder = new google.maps.Geocoder();

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

    // var marker = new google.maps.Marker({
    //     position: {lat: 36.1627, lng: -86.7816},
    //     map: map
    // })

    // var infoWindow = new google.maps.InfoWindow({
    //     content: '<h1>something</h1>'
    // })

    // marker.addListener('click', function(){
    //     infoWindow.open(map, marker)
    // })

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
