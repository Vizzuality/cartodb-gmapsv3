var
map          = null,
layer        = null,

layerVisible = true,
// Initial coordinates
lat          = 40.7248057566452,
lng          = -73.9967118782795,
initialZoom  = 5,

// CartoDB setup
userName     = "examples",
tableName    = 'points_na',

// Styling
markerStyle  = "#{{table_name}}{marker-fill:#F55; marker-line-color:#F55;}",
mapStyle     = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative", stylers: [ { saturation: -95 },{ gamma: 2.26 } ] }, { featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] }, { featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "road.arterial", stylers: [ { visibility: 'off' } ] }, { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] }, { featureType: "transit", stylers: [ { visibility: 'off' } ] }, { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];

var updateLayer = function(){

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
    interactivity: "cartodb_id",
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

  $('a[data-action="toggle"]').on("click", function() {
    if (layerVisible) {
      layer.hide();
      $(this).text("Show layer");
    } else {
      layer.show();
      $(this).text("Hide layer");
    }
    layerVisible = !layerVisible;
  });

}
