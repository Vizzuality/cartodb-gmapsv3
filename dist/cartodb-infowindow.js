/**
   * CartoDB.Infowindow
   * @xavijam
   **/
  CartoDB.Infowindow = function (params) {
    this.latlng_ = new google.maps.LatLng(0,0);
    this.feature_;
    this.map_ = params.map;
    this.columns_;
    this.offsetHorizontal_ = -107;
    this.width_ = 214;
    this.setMap(params.map);
    this.params_ = params;
  };

  CartoDB.Infowindow.prototype = new google.maps.OverlayView();

  CartoDB.Infowindow.prototype.draw = function() {
    var me = this;

    var div = this.div_;
    if (!div) {
      div = this.div_ = document.createElement('DIV');
      div.className = "cartodb_infowindow";

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

      google.maps.event.addDomListener(div, 'click', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
      google.maps.event.addDomListener(div, 'dblclick', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
      google.maps.event.addDomListener(div, 'mousedown', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });
      google.maps.event.addDomListener(div, 'mouseup', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
      google.maps.event.addDomListener(div, 'mousewheel', function (ev) {
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });
      google.maps.event.addDomListener(div, 'DOMMouseScroll', function (ev) {
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });

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

  CartoDB.Infowindow.prototype.setPosition = function() {
    if (this.div_) { 
       var div = this.div_;
       var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
       if (pixPosition) {
         div.style.width = this.width_ + 'px';
         div.style.left = (pixPosition.x - 49) + 'px';
         var actual_height = - $(div).height();
         div.style.top = (pixPosition.y + actual_height + 10) + 'px';
       }
       this.show();
    }
  };

  CartoDB.Infowindow.prototype.open = function(feature,latlng){
    var that = this
      , infowindow_sql = 'SELECT * FROM ' + this.params_.table_name + ' WHERE cartodb_id=' + feature;
    that.feature_ = feature;

    // If the table is private, you can't run any api methods
    if (this.params_.feature!=false) {
      infowindow_sql = this.params_.feature.replace('{{feature}}',feature);
    }

    // Replace {{table_name}} for table name
    infowindow_sql = encodeURIComponent(infowindow_sql.replace(/\{\{table_name\}\}/g,this.params_.table_name));

    $.ajax({
      url:'http://'+ this.params_.user_name +'.cartodb.com/api/v1/sql/?q='+infowindow_sql,
      dataType: 'jsonp',
      timeout: 2000,
      callbackParameter: 'callback',
      success: function(result) {
        positionateInfowindow(result.rows[0],latlng);
      },
      error: function(e,msg) {
        if (that.params_.debug) throw('Error retrieving infowindow variables: ' + msg);
      }
    });

    function positionateInfowindow(variables,center) {
      if (that.div_) {
        var div = that.div_;
        // Get latlng position
        that.latlng_ = latlng;

        // Remove the unnecessary html
        $('div.cartodb_infowindow div.outer_top div.top').html('');
        $('div.cartodb_infowindow div.outer_top div.bottom label').html('');

        // List all the new variables
        for (p in variables) {
          if (p!='cartodb_id' && p!='cdb_centre' && p!='the_geom_webmercator') {
            $('div.cartodb_infowindow div.outer_top div.top').append('<label>'+p+'</label><p class="'+((variables[p]!=null && variables[p]!='')?'':'empty')+'">'+(variables[p] || 'empty')+'</p>');
          }
        }

        // Show cartodb_id?
        if (variables['cartodb_id']) {
          $('div.cartodb_infowindow div.bottom label').html('id: <strong>'+feature+'</strong>');
        }

        that.moveMaptoOpen();
        that.setPosition();
      }
    }
  };

  CartoDB.Infowindow.prototype.hide = function() {
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
  };

  CartoDB.Infowindow.prototype.show = function() {
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
  };

  CartoDB.Infowindow.prototype.destroy = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  CartoDB.Infowindow.prototype.hideAll = function() {
    $('div.cartodb_infowindow').css('visibility','hidden');
  };

  CartoDB.Infowindow.prototype.isVisible = function(marker_id) {
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
  };

  CartoDB.Infowindow.prototype.moveMaptoOpen = function() {
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
  };