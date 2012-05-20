# What is the CartoDB library for GMaps v3?

This library allows you to use your own CartoDB tables with Google Maps v3.

# Using the library

Using the library is really easy. It accepts the following parameters to manage the behavior of your CartoDB layers:

<table>
<tr>
<td><b>Parameter name</b></td>
<td><b>Description</b></td>
<td><b>Required</b></td>
</tr>

<tr>
<td>map</td>
<td>The Google Map object.</td>
<td>Yes</td>
</tr>

<tr>
<td>username</td>
<td>Your CartoDB user name.</td>
<td>Yes</td>
</tr>

<tr>
<td>table_name</td>
<td>Your CartoDB table name.</td>
<td>Yes</td>
</tr>

<tr>
<td>query</td>
<td>A SQL query.</td>
<td>Yes</td>
</tr>

<tr>
<td><i>layer_order</i></td>
<td>If you want to set the order of the CartoDB layer.</td>
<td>Number or String ("top" or "bottom")</td>
<td></td>
<td>No</td>
</tr>

<tr>
<td>map_style</td>
<td>Show the same style as you defined in CartoDB.</td>
<td>No</td>
</tr>

<tr>
<td>interactivity</td>
<td>If you want to add interactivity to the layer without making requests.</td>
<td>String (columns separated by commas)</td>
<td></td>
<td>No</td>
</tr>

<tr>
<td>featureMouseOver</td>
<td>A callback when hovers in a feature</td>
<td>Function</td>
<td><b>data:</b> The feature data requested in `interactivity`</td>
<td>No (But only will work with `interactivity` specified)</td>
</tr>

<tr>
<td>featureMouseOut</td>
<td>A callback when hovers out a feature</td>
<td>Function</td>
<td></td>
<td>No (But only will work with `interactivity` specified)</td>
</tr>

<tr>
<td>featureMouseClick</td>
<td>A callback when clicks in a feature</td>
<td>Function</td>
<td>
  <b>latlng:</b> The LatLng leaflet object where was clicked<br/>
  <b>data:</b> The CartoDB data of the clicked feature with the `interactivity` param.
</td>
<td>No (But only will work with `interactivity` specified)</td>
</tr>

<tr>
<td>tile_style</td>
<td>If you want to add other style to the layer.</td>
<td>No</td>
</tr>

<tr>
<td>auto_bound</td>
<td>If you want to zoom in the area where the layer is positioned.</td>
<td>No</td>
</tr>

<tr>
<td>debug</td>
<td>If you want to debug the library, set to true.</td>
<td>No</td>
</tr>

<tr>
<td>tiler_protocol</td>
<td>Tiler protocol (opcional - default = 'http').</td>
<td>No</td>
</tr>

<tr>
<td>tiler_domain</td>
<td>Tiler domain (opcional - default = 'cartodb.com').</td>
<td>No</td>
</tr>

<tr>
<td>tiler_port</td>
<td>Tiler port as a string (opcional - default = '80').</td>
<td>No</td>
</tr>

</table>

# Usage notes

If you want to get a feature clicked || hover data (via the `interactivity` parameter), the columns must be in a string separated by commas.
If you don't want to write the name of the table several times, you can use {{table_name}} in the `query` or `tile_style` parameters.
We strongly recommend the use of the files available in this repository. These are tested, and if you decide use updated ones, the library could not work.


# Example

Here's a [live example](http://vizzuality.github.com/cartodb-gmapsv3/custominfowindow.html)!

First of all add the necessary script and css files:

```html
<link href="css/cartodb-gmapsv3.css" rel="stylesheet" type="text/css">
<link href="http://code.google.com/apis/maps/documentation/javascript/examples/default.css" rel="stylesheet" type="text/css" />          
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="js/wax.g.min-6.0.3.js"></script>
<script type="text/javascript" src="dist/cartodb-gmapsv3.js"></script>
```
When the document is loaded, start creating the map:

```javascript
var map = new google.maps.Map(document.getElementById('map'), {
  center: new google.maps.LatLng(20, 0),
  zoom: 3,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false
});
```

And then add the CartoDB layer:

```javascript
var cartodb_gmapsv3 = new CartoDBLayer({
  map: map,
  user_name:'example',
  table_name: 'earthquakes',
  query: "SELECT * FROM {{table_name}}",
  layer_order: "top",
  tile_style: "#{{table_name}}{marker-fill:red}",
  interactivity: "cartodb_id, magnitude",
  featureMouseClick: function(feature, latlng, data) {alert(feature)}
  auto_bound: true
});
```

# Functions
New funcionalities are coming, in the meantime you can use:


- **removeLayer**: Removes the cartodb layer from the map.
    Example: ```cartodb_gmapsv3.removeLayer();```
- **hide**: Hide the cartodb layer from the map.
    Example: ```cartodb_gmapsv3.hide();```
- **show**: Show again the cartodb layer in the map.
    Example: ```cartodb_gmapsv3.show();```
- **setInteraction**: Set the interaction of your layer to true or false.
    Example: ```cartodb_gmapsv3.setInteraction(false);```
- **setLayerOrder**: Change the order of the CartoDB layer.
    Example: ```cartodb_gmapsv3.setOrder("top"); cartodb_gmapsv3.setOrder("bottom"); cartodb_gmapsv3.setOrder(2);```
- **setQuery**: Change the query parameter for the layer
    Example: ```cartodb_gmapsv3.setQuery("SELECT * FROM {{table_name}} WHERE cartodb_id > 10");```
- **setStyle**: Change the style of the layer tiles
    Example: ```cartodb_gmapsv3.setStyle("#{{table_name}}{marker-fill:blue}");```
- **setInteractivity**: Change the columns you want to get data (it needs to reload the tiles)
    Example: ```cartodb_gmapsv3.setInteractivity("cartodb_id, the_geom, magnitude");```
- **setOpacity**: _Not available yet_ -> Waiting for this ticket fixed: https://github.com/mapbox/wax/issues/194