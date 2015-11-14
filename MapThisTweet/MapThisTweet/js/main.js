var DATAPATH = 'data/';

var CLEAR_DELAY = 1800;

var isProdTest = false;

var map;

var listOfCities = {}
    , stackOfTweets
    , points = [];

/**
 * TODO
 * stream
 */

$(function () {

  function _displayInfoWindowsLower() {
    points.forEach(function (point) {
      point.infowindow.setZIndex(3);
    });
  }

  function getCities(argument) {
    var url = isDev ? DATAPATH + 'cities.json' : 'api/citys'; // FIXME api const

    $.getJSON(url, function (data) {
      data.forEach(function (item) {
        var cityId = item.id;

        listOfCities[cityId] = item;
      });

      getTweets();
    })
  }

  function getTweets() {
    var url = isDev ? DATAPATH + 'tweets.json' : 'api/tweets';

    $.getJSON(url, function (data) {
      stackOfTweets = data;

      $('#map').trigger('show');
    });
  }

  $('#map').on('init', function () {
    getCities();

    setInterval(function () { // clear up
      if (points.length) {
        var shifted = points.shift();
        shifted.infowindow.close();
        shifted.marker.setMap(null);
      }
    }, CLEAR_DELAY);
  })

  $('#map').on('show', function () {

    if (stackOfTweets.length) {
      $(stackOfTweets).each(function (index, item) {
        var cityId = item.cityId;
        var city = listOfCities[cityId];

        var location = city['location'];
        var content = item.text;
        var coords = new google.maps.LatLng(location.lat, location.lng);

        var infowindow = new google.maps.InfoWindow({
          content: content,
          maxWidth: 200
        });

        var marker = new google.maps.Marker({
          position: coords,
          map: map,
          visible: false
        });

        points.push({
          marker: marker,
          infowindow: infowindow
        });


        // TODO control timeout;
        // TODO small size markers?
        setTimeout(function () {
          _displayInfoWindowsLower();

          marker.setVisible(true);
          infowindow.setZIndex(10);
          infowindow.open(map, marker);
        }, 1000 + 1000 * index);

      });
    }


  })
})



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.34436, lng: 108.92035}, // xi'an
    zoom: 5
  });

  $('#map').trigger('init');
}
