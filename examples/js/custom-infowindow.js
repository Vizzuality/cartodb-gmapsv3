var
map         = null,
layer       = null,

// Initial coordinates
lat         = 40.7248057566452,
lng         = -73.9967118782795,
initialZoom = 5,

// CartoDB setup
userName    = "examples",
tableName   = 'earthquakes',

infowindow  = null,

// Styling
markerStyle = "#{{table_name}}{marker-fill:#F55; marker-line-color:#F55;}",
mapStyle    = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative", stylers: [ { saturation: -95 },{ gamma: 2.26 } ] }, { featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] }, { featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "road.arterial", stylers: [ { visibility: 'off' } ] }, { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] }, { featureType: "transit", stylers: [ { visibility: 'off' } ] }, { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ],

circle,
radDeg      = 0;

var getRadius = function() {

  var
  r      = 100000, // radius of the circle
  bounds = map.getBounds(),
  center = bounds.getCenter(),
  ne     = bounds.getNorthEast();

  // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
  var lat1 = center.lat() / 57.2958;
  var lon1 = center.lng() / 57.2958;
  var lat2 = ne.lat() / 57.2958;
  var lon2 = ne.lng() / 57.2958;

  // distance = circle radius from center to Northeast corner of bounds
  return r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                       Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
};

function removeCircle() {
  if (circle) { // Remove circle
    circle.setMap(null);
    circle = null;
  }
}

function drawCircle(center) {
  if (circle) return;

  circle = new google.maps.Circle({
    map: map,
    center: center,
    radius: getRadius(),
    strokeWeight: 0,
    fillColor: "#E95050",
    fillOpacity: 1
  });
}

var renderLayer = function(){

  // Our main query
  var query = "SELECT * FROM {{table_name}}";

  if (layer) {
    layer.setOptions({ query: query });
    return;
  }

  // Create layer
  layer = new CartoDBLayer({
    map: map,
    user_name: userName,
    table_name: tableName,
    query: query,
    layer_order: "top",
    tile_style: markerStyle,
    interactivity: "cartodb_id, magnitude, latitude, longitude",
    featureClick: function(ev, latlng, pos, data) {

      // The popup content goes here
      var html = '';

      // Remove unwanted properties
      delete data.latitude;
      delete data.longitude;
      delete data.cartodb_id;

      for(var column in data) {
        html += '<label>' + column + '</label>';
        html += '<p>' + data[column] + '</p>';
      }

      infowindow.setContent(html);

      // Set infowindow center
      infowindow.setPosition(latlng);

      // Show the infowindow
      infowindow.open(map);
    },

    featureOver: function(ev, latlng, pos, data) {
      map.setOptions({ draggableCursor: 'pointer' });

      var center = new google.maps.LatLng(data.latitude, data.longitude);
      drawCircle(center);
    },

    featureOut: function() {
      map.setOptions({ draggableCursor: 'default' });
      removeCircle();
    }

  });
};

function init() {

  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(lat, lng),
    zoom: initialZoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false
  });

  // Create infowindow
  infowindow = new CartoDBInfowindow(map);

  map.setOptions({ styles: mapStyle });

  renderLayer();
}
