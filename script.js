
function createMap(data) {

  // map

  var map = L.map('map');

  var layer = L.tileLayer.provider('Esri.WorldStreetMap');

  map.addLayer(layer);

  map.setView([0, 0], 3);

  var markers = [];

  _.each(data.features, function(feature) {

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    var marker = L.circleMarker([lat, lon], {
      className: 'toponym',
      offset: Number(feature.properties.offset),

    });


    marker.bindPopup(feature.properties.toponym);

    markers.push(marker);
    map.addLayer(marker);

  });

  // slider

var input = $('#slider input');

  var max =_.last(data.features).properties.offset;
  input.attr('max', max);

  input.on('input', function() {
    var offset = Number(input.val());


    _.each(markers, function(marker) {

      if (marker.options.offset < offset) {
        map.addLayer(marker);

      }

      else{
        map.removeLayer(marker);
      }
    });
  });
    input.trigger('input');

    // Marker clusters

    var clusters = L.markerClusterGroup();

    _.each(markers, function(marker)  {
      clusters.addLayer(marker);

    })

      map.addLayer(clusters);

      // Heatmap

      var points =_.map(data.features, function(feature) {

        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];

        return [lat, lon, 1];

      });
      var heat = L.heatLayer(points, {
        minOpacity: 0.3

      });

      map.addLayer(heat);


}

// On page start
$(function() {
  $.getJSON('data/80-days.geojson', function(data) {
    createMap(data);
  });
});
