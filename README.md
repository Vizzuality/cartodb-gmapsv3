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
<td>map_canvas</td>
<td>The DOM element id for the map.</td>
<td>Yes</td>
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
<td>map_style</td>
<td>Show the same style as you defined in CartoDB.</td>
<td>No</td>
</tr>

<tr>
<td>infowindow</td>
<td>If you want to add interactivity to the layer, showing the info window.</td>
<td>No</td>
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

</table>

# Usage notes

If you choose a CartoDB private table you'll need to [authenticate](http://developers.cartodb.com/api/authentication.html) beforehand. If you want to show specific columns in the info window (via the `infowindow` parameter), the columns must be in a query using `WHERE` clauses. Keep in mind the `cartodb_id` and `the_geom_webmercator` columns are required.

If you don't want to write the name of the table several times, you can use {{table_name}} in the query, tile_style and infowindow parameters. {{feature}} is required in the infowindow paramenter when you want to show specific information on it.

# Example

Here's a [live example](http://vizzuality.github.com/cartodb-gmapsv3/)!

First create your map:

```javascript
var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(20, 0),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false
});
```

And then add the CartoDB layer:

```javascript
var cartodb_gmapsv3 = new google.maps.CartoDBLayer({
    map_canvas: 'map_canvas',
    map: map,
    user_name: "examples",
    table_name: 'earthquakes',
    query: "SELECT cartodb_id,the_geom_webmercator,magnitude FROM {{table_name}}",
    tile_style: "#{{table_name}}{line-color:#719700;line-width:1;line-opacity:0.6;polygon-opacity:0.6;}",
    map_style: true,
    infowindow: "SELECT cartodb_id,the_geom_webmercator,magnitude FROM {{table_name}} WHERE cartodb_id={{feature}}",
    auto_bound: true,
    debug: false
});
```

# Functions

New funcionalities are coming, in the meantime you can use:

* update: It needs a parameter and a new value to work. Example: cartodb_gmapsv3.update('query','SELECT * FROM earthquakes WHERE cartodb_id>2');
* destroy: Removes the cartodb layer from the map. Example: cartodb_gmapsv3.destroy();
* hide: Hide the cartodb layer from the map (For now, hide and destroy are the same, but will be replace in the future).
* show: Show again the cartodb layer in the map. Example: cartodb_gmapsv3.show();
* isVisible: Returns if cartodb layer is visible or not. Example: cartodb_gmapsv3.isVisible(); -> true | false