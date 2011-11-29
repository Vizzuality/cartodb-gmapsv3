/**
 * @name cartodb-gmapsv3 for Google Maps V3 API
 * @version 0.1 [October 10, 2011]
 * @author: xavijam@gmail.com
 * @fileoverview <b>Author:</b> xavijam@gmail.com<br/> <b>Licence:</b>
 *               Licensed under <a
 *               href="http://opensource.org/licenses/mit-license.php">MIT</a>
 *               license.<br/> This library lets you use CartoDB with google
 *               maps v3.
 *                 
 */
/**
 * @name google
 * @class The fundamental namespace for Google APIs 
 */
/**
 * @name google.maps
 * @class The fundamental namespace for Google Maps V3 API 
 */
 /*
 *  - Map style of cartodb
 *  - Infowindow of cartodb
 *  - Tiles style of cartodb
 */
 
 
 
if (typeof(google.maps.CartoDBLayer) === "undefined") {
  /**
   * @params {}
   *    map_canvas    -     Gmapsv3 canvas id (necesary for showing the infowindow)
   *		map						-			Your gmapsv3 map
   *   	user_name 		-		 	CartoDB user name
   *   	table_name 		-			CartoDB table name
   *    query					-			If you want to apply any sql sentence to the table...
   *		map_style			-			If you want to see the map styles created on cartodb (opcional - default = false)
   *		infowindow		-			If you want to see infowindows when click in a geometry (opcional - default = false)
   *		auto_bound		-			Let cartodb auto-bound-zoom in the map (opcional - default = false)
   */
   
  google.maps.CartoDBLayer = function (params) {
    
    var defaults = params;
    
    if (params.infowindow) {
		  addWaxCartoDBTiles(params);
		} else {
		  addSimpleCartoDBTiles(params);											// Always add cartodb tiles, simple or with wax.
		}
	  if (params.map_style) 	setCartoDBMapStyle(params);		// Map style? ok, let's style.
	  if (params.auto_bound) 	autoBound(params);				    // Bounds? CartoDB does it.

	  
	  // Add cartodb tiles to the map
	  function addCartoDBTiles(params) {
		  // Add the cartodb tiles
	    var cartodb_layer = {
	      getTileUrl: function(coord, zoom) {
	        return 'http://' + params.user_name + '.cartodb.com/tiles/' + params.table_name + '/'+zoom+'/'+coord.x+'/'+coord.y+'.png?sql='+params.query;
	      },
	      tileSize: new google.maps.Size(256, 256)
	    };
	    var cartodb_imagemaptype = new google.maps.ImageMapType(cartodb_layer);
	    params.map.overlayMapTypes.insertAt(0, cartodb_imagemaptype);
	  }
	  
	  
	  // Zoom to cartodb geometries
	  function autoBound(params) {
			// Zoom to your geometries
		  $.ajax({
			  method:'get',
		    url: 'http://'+params.user_name+'.cartodb.com/api/v1/sql/?q='+escape('select ST_Extent(the_geom) from '+ params.table_name)+'&callback=?',
		    dataType: 'jsonp',
		    success: function(result) {
		      if (result.rows[0].st_extent!=null) {
		        var coordinates = result.rows[0].st_extent.replace('BOX(','').replace(')','').split(',');
		  
		        var coor1 = coordinates[0].split(' ');
		        var coor2 = coordinates[1].split(' ');
		        var bounds = new google.maps.LatLngBounds();
		  
		        // Check bounds
		        if (coor1[0] >  180 || coor1[0] < -180 || coor1[1] >  90 || coor1[1] < -90 
			        || coor2[0] >  180 || coor2[0] < -180 || coor2[1] >  90  || coor2[1] < -90) {
		          coor1[0] = '-30';
		          coor1[1] = '-50'; 
		          coor2[0] = '110'; 
		          coor2[1] =  '80'; 
		        }
		  
		        bounds.extend(new google.maps.LatLng(coor1[1],coor1[0]));
		        bounds.extend(new google.maps.LatLng(coor2[1],coor2[0]));
		  
		        params.map.fitBounds(bounds);
		      }
		  
		    },
		    error: function(e) {}
		  });	    
	  }
	  
	  
	  // Set the map styles of your cartodb table/map
	  function setCartoDBMapStyle(params) {
		  $.ajax({
		    url:'http://' + params.user_name + '.cartodb.com/tiles/' + params.table_name + '/map_metadata?callback=?',
		    dataType: 'jsonp',
		    success:function(result){
		      var map_style = JSON.parse(result.map_metadata);
		      
		      if (!map_style || map_style.google_maps_base_type=="roadmap") {
		        params.map.setOptions({mapTypeId: google.maps.MapTypeId.ROADMAP});
		      } else if (map_style.google_maps_base_type=="satellite") {
		        params.map.setOptions({mapTypeId: google.maps.MapTypeId.SATELLITE});
		      } else if (map_style.google_maps_base_type=="terrain") {
		        params.map.setOptions({mapTypeId: google.maps.MapTypeId.TERRAIN});
		      } else {
		        var mapStyles = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] },{ featureType: "administrative", stylers: [ { saturation: -95 }, { gamma: 2.26 } ] },{ featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "administrative.locality", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] },{ featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "road.arterial", stylers: [ { visibility: "off" } ] },{ featureType: "road.local", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "transit", stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];
		        map_style.google_maps_customization_style = mapStyles;
		        params.map.setOptions({mapTypeId: google.maps.MapTypeId.ROADMAP});
		      }
		      
		      // Custom tiles
		      if (!map_style) {map_style = {google_maps_customization_style: []}}
		      params.map.setOptions({styles: map_style.google_maps_customization_style})
		    },
		    error: function(e){}
		  });
	  }
	  
	  
	  // Add cartodb tiles to the map
	  function addSimpleCartoDBTiles(params) {
		  // Add the cartodb tiles
	    var cartodb_layer = {
	      getTileUrl: function(coord, zoom) {
	        return 'http://' + params.user_name + '.cartodb.com/tiles/' + params.table_name + '/'+zoom+'/'+coord.x+'/'+coord.y+'.png?sql='+params.query;
	      },
	      tileSize: new google.maps.Size(256, 256)
	    };
	    var cartodb_imagemaptype = new google.maps.ImageMapType(cartodb_layer);
	    params.map.overlayMapTypes.insertAt(0, cartodb_imagemaptype);
	  }
	  
	  
	  // Add cartodb tiles to the map
	  function addWaxCartoDBTiles(params) {
      // interaction placeholder
      var currentCartoDbId;
          params.tilejson = generateTileJson();
          params.infowindow = new CartoDBInfowindow(params);
          params.cache_buster = 0;
          
      params.waxOptions = {
        callbacks: {
          out: function(){
            params.map.setOptions({draggableCursor: 'default'});
          },
          over: function(feature, div, opt3, evt){
            params.map.setOptions({draggableCursor: 'pointer'});
          },
          click: function(feature, div, opt3, evt){
            params.infowindow.open(feature);
          }
        },
        clickAction: 'full'
      };
      
      var wax_tile = new wax.g.connector(params.tilejson);
      params.map.overlayMapTypes.insertAt(0,wax_tile);
      params.interaction = wax.g.interaction(params.map, params.tilejson, params.waxOptions);
	  }
  
 
    // Refresh wax interaction
    function refreshWax(sql) {
      if (params.infowindow) {
        params.cache_buster++;
        params.query = sql;
        params.tilejson = generateTileJson();

        // Remove old wax
        params.map.overlayMapTypes.clear();

        // Setup new wax
        params.tilejson.grids = wax.util.addUrlData(params.tilejson.grids_base,  'cache_buster=' + params.cache_buster);

        // Add map tiles
        var wax_tile = new wax.g.connector(params.tilejson);
        params.map.overlayMapTypes.insertAt(0,wax_tile);

        // Add interaction
        params.interaction.remove();
        params.interaction = wax.g.interaction(params.map, params.tilejson, params.waxOptions);
      }
    }

    // Refresh tiles
    function refreshTiles(sql) {
      // If you are not using interaction on the tiles... let's update your tiles
      if (!params.infowindow) {
        // First remove previous cartodb - tiles.
        params.map.overlayMapTypes.clear();

     	  // Then add the cartodb tiles
     	 	params.query = sql;
    		var cartodb_layer = {
    			  getTileUrl: function(coord, zoom) {
    			  return 'http://' + params.user_name + '.cartodb.com/tiles/' + params.table_name + '/'+zoom+'/'+coord.x+'/'+coord.y+'.png?sql='+params.query;
    		  },
  			  tileSize: new google.maps.Size(256, 256)
  	    };
  	    
  	    var cartodb_imagemaptype = new google.maps.ImageMapType(cartodb_layer);
  	    params.map.overlayMapTypes.insertAt(0, cartodb_imagemaptype);
      }
    }
    
    
    function generateTileJson() {
      var core_url = 'http://' + params.user_name + '.cartodb.com';  
      var base_url = core_url + '/tiles/' + params.table_name + '/{z}/{x}/{y}';
      var tile_url = base_url + '.png?cache_buster=0';
      var grid_url = base_url + '.grid.json';
  
      // SQL?
      if (params.query) {
        var query = 'sql=' + params.query;
        tile_url = wax.util.addUrlData(tile_url, query);
        grid_url = wax.util.addUrlData(grid_url, query);
      }
  
      // Build up the tileJSON
      // TODO: make a blankImage a real 'empty tile' image
      return {
        blankImage: 'blank_tile.png', 
        tilejson: '1.0.0',
        scheme: 'xyz',
        tiles: [tile_url],
        grids: [grid_url],
        tiles_base: tile_url,
        grids_base: grid_url,
        formatter: function(options, data) {
            currentCartoDbId = data.cartodb_id;
            return data.cartodb_id;
        },
        cache_buster: function(){
            return params.cache_buster;
        }
      };
    }
    
  
    // Update tiles & interactivity layer;
    google.maps.CartoDBLayer.prototype.update = function(sql) {
      // Hide the infowindow
      if (params.infowindow) 
        params.infowindow.hide();
      // Refresh wax
      refreshWax(sql);
      // Refresh tiles
      refreshTiles(sql);
    };
  };
}



/**
 * CartoDB Infowindow
 * @xavijam
 **/


	function CartoDBInfowindow(params) {
	  this.latlng_ = new google.maps.LatLng(0,0);
		this.feature_;
		this.map_ = params.map;
		this.columns_;
	  this.offsetHorizontal_ = -107;
	  this.width_ = 214;
	  this.setMap(params.map);
	  this.params_ = params;
	  this.getActiveColumns(params);
	}


	CartoDBInfowindow.prototype = new google.maps.OverlayView();


	CartoDBInfowindow.prototype.getActiveColumns = function(params) {
	  var that = this;
	  $.ajax({
	    url:'http://' + params.user_name + '.cartodb.com/tiles/' + params.table_name + '/infowindow?callback=?',
	    dataType: 'jsonp',
	    success:function(result){
	      var columns = JSON.parse(result.infowindow);
	      if (columns) {
	        that.columns_ = parseColumns(columns);
	      } else {
	        $.ajax({
      		  method:'get',
      	    url: 'http://'+ that.params_.user_name +'.cartodb.com/api/v1/sql/?q='+escape('select * from '+ that.params_.table_name + ' LIMIT 1'),
      	    dataType: 'jsonp',
      	    success: function(columns) {
      	      that.columns_ = parseColumns(columns.rows[0]);
      	    },
      	    error: function(e) {}
      	  });
	      }

	    },
	    error: function(e){}
	  });
	  
	  function parseColumns(columns) {
	    var str = '';
      for (p in columns) {
        if (columns[p] && p!='the_geom_webmercator') {
          str+=p+',';
        }
      }
      return str.substr(0,str.length-1);
	  }
	}


	CartoDBInfowindow.prototype.draw = function() {
	  var me = this;
		
	  var div = this.div_;
	  if (!div) {
	    div = this.div_ = document.createElement('div');
	    div.setAttribute('class','cartodb_infowindow');
	
      div.innerHTML = '<a href="#close" class="close">x</a>'+
  			              '<div class="outer_top">'+
  			                '<div class="top">'+
  			                '</div>'+
  			              '</div>'+
  			              '<div class="bottom">'+
  											'<label>id:1</label>'+
  		                '</div>';
      
 	    $(div).find('a.close').click(function(ev){
 	      ev.preventDefault();
 	      ev.stopPropagation();
        me.hide();
      });

      google.maps.event.addDomListener(div,'click',function(ev){ev.preventDefault()});
      google.maps.event.addDomListener(div,'dblclick',function(ev){ev.preventDefault()});
      google.maps.event.addDomListener(div,'mousedown',function(ev){ev.preventDefault()});
      google.maps.event.addDomListener(div,'mouseup',function(ev){ev.preventDefault()});
      google.maps.event.addDomListener(div,'mousewheel',function(ev){ev.stopPropagation()});
      google.maps.event.addDomListener(div,'DOMMouseScroll',function(ev){ev.stopPropagation()});
			
	    var panes = this.getPanes();
	    panes.floatPane.appendChild(div);

	    div.style.opacity = 0;
	  }
	
	  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
	  if (pixPosition) {
		  div.style.width = this.width_ + 'px';
		  div.style.left = (pixPosition.x - 49) + 'px';
		  var actual_height = - $(div).height();
		  div.style.top = (pixPosition.y + actual_height + 5) + 'px';
	  }
	};
	
	
	CartoDBInfowindow.prototype.setPosition = function() {
	  if (this.div_) { 
 	    var div = this.div_;
 	    var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
 	    if (pixPosition) {
 		    div.style.width = this.width_ + 'px';
 		    div.style.left = (pixPosition.x - 49) + 'px';
 		    var actual_height = - $(div).height();
 		    div.style.top = (pixPosition.y + actual_height + 5) + 'px';
 	    }
 	    this.show();
    }
	}
	
	
	CartoDBInfowindow.prototype.open = function(feature){
	  var that = this;
	  that.feature_ = feature;

    $.ajax({
		  method:'get',
	    url: 'http://'+ this.params_.user_name +'.cartodb.com/api/v1/sql/?q='+escape('select '+that.columns_+',ST_AsGeoJSON(ST_PointOnSurface(the_geom),6) as cdb_centre from '+ this.params_.table_name + ' where cartodb_id=' + feature)+'&callback=?',
	    dataType: 'jsonp',
	    success: function(result) {
	      positionateInfowindow(result.rows[0]);
	    },
	    error: function(e) {}
	  });
   
    function positionateInfowindow(variables) {
      if (that.div_) {
        var div = that.div_;
        // Get latlng position
        that.latlng_ = that.transformGeoJSON(variables.cdb_centre);
                
        // Remove the list items
        $('div.cartodb_infowindow div.outer_top div.top').html('');

        for (p in variables) {
          if (p!='cartodb_id' && p!='cdb_centre') {
            $('div.cartodb_infowindow div.outer_top div.top').append('<label>'+p+'</label><p class="'+((variables[p]!=null)?'':'empty')+'">'+(variables[p] || 'empty')+'</p>');
          }
        }
        
        $('div.cartodb_infowindow div.bottom label').html('id: <strong>'+feature+'</strong>');
        that.moveMaptoOpen();
        that.setPosition();     
      }
    }
	}	
	

	CartoDBInfowindow.prototype.hide = function() {
	  if (this.div_) {
	    var div = this.div_;
	    $(div).animate({
	      top: '+=' + 10 + 'px',
	      opacity: 0},
	      100, 'swing',
        function () {
          div.style.visibility = "hidden";
        }
			);
	  }
	}


	CartoDBInfowindow.prototype.show = function() {
	  if (this.div_) {
	    var div = this.div_;
			div.style.opacity = 0;
			div.style.visibility = "visible";
			$(div).animate({
	      top: '-=' + 10 + 'px',
	      opacity: 1},
	      250
			);
		}
	}


	CartoDBInfowindow.prototype.isVisible = function(marker_id) {
	  if (this.div_) {
	    var div = this.div_;
			if (div.style.visibility == 'visible' && this.feature_!=null) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	
	CartoDBInfowindow.prototype.transformGeoJSON = function(str) {
    var json = JSON.parse(str);
    return new google.maps.LatLng(json.coordinates[1],json.coordinates[0]);
  }
	
	
	CartoDBInfowindow.prototype.moveMaptoOpen = function() {
		var left = 0;
		var top = 0;
		var div = this.div_;
	  var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.latlng_);

		if ((pixPosition.x + this.offsetHorizontal_) < 0) {
			left = (pixPosition.x + this.offsetHorizontal_ - 20);
		}
		
		if ((pixPosition.x + 180) >= ($('#'+this.params_.map_canvas).width())) {
			left = (pixPosition.x + 180 - $('#'+this.params_.map_canvas).width());
		}
		
		if ((pixPosition.y - $(div).height()) < 0) {
			top = (pixPosition.y - $(div).height() - 30);
		}
				
		this.map_.panBy(left,top);
	}
