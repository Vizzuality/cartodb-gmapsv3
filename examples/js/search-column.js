var
map          = null,
layer        = null,

layerVisible = true,
// Initial coordinates
lat          = 40.7248057566452,
lng          = -50.9967118782795,
initialZoom  = 2,

// CartoDB setup
userName     = "javierarce",
tableName    = 'country_boundaries',

// Styling
markerStyle  = null;

//"#{{table_name}}  { line-color:#FFFFFF; line-width:1; line-opacity:1; polygon-opacity:1; } \
//#{{table_name}} [operating<=104] { polygon-fill:#980043 } \
//#{{table_name}} [operating<=19]  { polygon-fill:#DD1C77 } \
//#{{table_name}} [operating<=10]  { polygon-fill:#DF65B0 } \
//#{{table_name}} [operating<=2]   { polygon-fill:#D4B9DA } \
//#{{table_name}} [operating<=0]   { polygon-fill:#F1EEF6 }";

mapStyle     = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative", stylers: [ { saturation: -95 },{ gamma: 2.26 } ] }, { featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] }, { featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "road.arterial", stylers: [ { visibility: 'off' } ] }, { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] }, { featureType: "transit", stylers: [ { visibility: 'off' } ] }, { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];

var updateLayer = function(country) {

  var query = null;

  if ( country != null ) { // Our main query
    query = "SELECT * FROM {{table_name}} WHERE admin = '" + country + "'";
  } else {
    query = "SELECT * FROM {{table_name}}";
  }

  if (layer) {
    layer.setOptions({ query: query });
    layer.setBounds();
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
    interactivity: "cartodb_id"
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

  map.setOptions({ styles: mapStyle });

  updateLayer();

  $('.controls .countries').on("change", function(e) {
    e.preventDefault();

    var country = $(".controls").find('.countries option:selected').val();

    updateLayer(country);
  });

}
