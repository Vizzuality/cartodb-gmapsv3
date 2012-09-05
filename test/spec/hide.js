describe('Hide funcionality', function() {
  var div, map, cdb_layer;

  beforeEach(function() {
    div = document.createElement('div');
    div.setAttribute("id","map");
    div.style.height = "100px";
    div.style.width = "100px";

    map = new google.maps.Map(div, {
      center: new google.maps.LatLng(51.505, -0.09),
      disableDefaultUI: false,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false
    });

    cdb_layer = new CartoDBLayer({
      map: map,
      user_name:"examples",
      table_name: 'earthquakes',
      query: "SELECT * FROM {{table_name}}",
      tile_style: "#{{table_name}}{marker-fill:#E25B5B}",
      opacity:0.8,
      interactivity: "cartodb_id, magnitude",
      featureOver: function(ev,latlng,pos,data) {},
      featureOut: function() {},
      featureClick: function(ev,latlng,pos,data) {},
      auto_bound: false,
      debug: true
    });

  });


  it('if hides layers should work', function() {

    runs(function () {
      cdb_layer.hide();
    });

    waits(2000);

    runs(function () {
      var $tile = $(div).find("img[gtilekey]").first()
        , opacity = cdb_layer.options.opacity;

      expect(cdb_layer.options.visible).toBeFalsy();
      expect($tile.css("opacity")).toEqual('0');
      expect(opacity).not.toEqual(0);
    });
  });

  // it('If sets opacity to 0, layer should be visible', function() {
  //   cdb_layer.setOpacity(0);
  //   expect(cdb_layer.options.visible).toBeTruthy();
  // });
});