var mymap = L.map('mapid').setView([51.505, -0.09], 10);
    
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWxwYWJsZXRlIiwiYSI6ImNqbGVkbXNpcTAzb2wzcHBkOWZrbzUyZ2cifQ.i4-VZonzFgf7GBoQVpYPXg', {
    minZoom: 8,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
};

mymap.on('click', onMapClick);

function prepareUrl(url, obj) {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return url + '?' + str
};

var dbquery = 'SELECT last("lng") AS "lng", last("lat") AS "lat", (0.4*last("pm10")) + (0.6*last("pm25")) AS "aqi" FROM "aqa"."autogen"././ WHERE time > now() - 15m GROUP BY time(15m)'

var url_params = {
    q: dbquery,
    db: 'aqa',
    epoch: 's'

};

var dbreq = "http://aqa.unloquer.org:8086/query"

var my_query = prepareUrl(dbreq, url_params);

console.log(my_query);

d3.json(my_query)
    .then(function(data) {
        console.log("entre!!");
        // console.log(data['results'][0]['series'][0]['name']);
        var results = data['results'];

        results.forEach(function(s) {
            // console.log(s['series'])
            s['series'].forEach(function(d) {
                console.log(d['name'])
                d['values'].forEach(function(v) {
                    var res = {}
                    res['name'] = d['name']
                    res[d['columns'][0]] = v[0]
                    res[d['columns'][1]] = v[1]
                    res[d['columns'][2]] = v[2]
                    res[d['columns'][3]] = v[3]

                    console.log(res);
                    return res
                });
            });
        });
  });