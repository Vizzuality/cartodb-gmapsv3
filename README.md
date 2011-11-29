CartoDB library for GMaps.v3
============================
Use your own CartoDB tables with Google Maps (version 3).

Using the library
------------------
Using the library is really easy, you'll only need:

* Your CartoDB user name.
* A *public* table.
* A query.

Params
------
The library accepts certain params to manage the cartodb layer:

* map_canvas (required): 	The DOM element id where the map is
* map (required): 		The google map object create before
* username (required): 		Your CartoDB user name
* table_name (required): 	Your CartoDB table name
* query (required): 		A query to experiment with
* map_style:			Show the same style as you defined in CartoDB
* infowindow:			If you want to add interactivity to the layer, showing the infowindow
* autobound:			If you want to zoom in the area where the layer is positioned


Example
-------
First of all create your map:

	var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(20,0),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false});
  
And then add the cartodb layer:

	var cartodb_gmapsv3 = new google.maps.CartoDBLayer({
    map_canvas: 'map_canvas',
    map: map,
    user_name:'xavijam',
    table_name: 'test',
    query: "SELECT * FROM test",
    map_style: true,
    infowindow: true,
    auto_bound: true});


[live example](http://vizzuality.github.com/cartodb-gmapsv3/)


Functions
---------
New funcionalities are coming, in the meantime you can use:

* update: It needs a new query to work. Example: cartodb_gmapsv3.update('SELECT * FROM test WHERE cartodb_id>2');