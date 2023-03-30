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

    map = new Map($('#map')[0], options)

    geocoder = new google.maps.Geocoder();

    function getGeoCode(){
        geocoder.geocode({
            address: 'morristown tennessee' //TODO make the address changeable depending on user input
        }, (results) =>{
            console.log(results[0].geometry.location.lat());
            console.log(results[0].geometry.location.lng());
        })
    }
    getGeoCode();

    //array of coordinates
    coordsArray = [
        {
            coords: {lat: 36.1627, lng: -86.7816}
        },
        {
            coords: {lat: 36.6627, lng: -86.2816}}
    ]

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
    for(var i = 0; i < coordsArray.length; i++){
        addMarker(coordsArray[i])
    }
}

initMap();
