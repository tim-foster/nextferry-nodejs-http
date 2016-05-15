//
// import required modules
//

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var geolib = require('geolib');
var fs = require('fs');
var xml2js = require('xml2js');

//
// some globals for this crappy HTTP server
//
//    TODO 
//       move to config file
//       find closest should not find Vashon if not on Vashon, etc
//

var terminals = [];
terminals["14"] = 
{
    "Fauntleroy Ferry Dock": {latitude: 47.5232072, longitude: -122.3962173},  // FAUNTLEROY
    "Vashon Ferry Dock": {latitude: 47.5101587, longitude: -122.4649865},      // VASHON
}

//
// continually load all the schedules into memory 
//
//   TODO refactor for multiple schedules and docks
//

var schedule = [];
loadSchedules();
setInterval(loadSchedules, 60 * 1000);

function loadSchedules()
{
   loadSchedule(14,60);
}
 
function loadSchedule(route, cache) {
    var parser = new xml2js.Parser();

    // need to load the XML file and parse schedule information
    console.log("Loading XML: " + __dirname + '/schedules/route_' + route + '.xml');

    try {
      fs.readFile(__dirname + '/schedules/route_' + route + '.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
          schedule["Fauntleroy Ferry Dock"] = result["SchedResponse"]["TerminalCombos"][0]["SchedTerminalCombo"][0];
          schedule["Vashon Ferry Dock"] = result["SchedResponse"]["TerminalCombos"][0]["SchedTerminalCombo"][1];
  	  console.dir(schedule); 
          console.log('Done');
        });
      });
    } catch(err) {
        console.log("Failed to load XML: " + err);
    }
}

//
// ferry times request
//
//   GET params:
//	route: terminal route (vashon/faunt is route 14)
//	lat: current device lat
//	long: current device long
//

dispatcher.onGet("/v0/ferry", function(req, res) {
    var route = 0;
    var location = { latitude: 0, longitude: 0 }

    // parse the query data
    queryData = url.parse(req.url, true).query;
    route = queryData.route;
    location.latitude = queryData.lat;
    location.longitude = queryData.long;

    // find the closest location for the route
    closest = geolib.findNearest(location, terminals[route]);

    // time to write our results
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify( 
	{ departingTerminal: closest['key'], 
          location: terminals[route][closest['key']] ,
	  times: [  
		schedule[closest['key']]["Times"][0]["SchedTime"][0], 
		schedule[closest['key']]["Times"][0]["SchedTime"][1] 
          ],
        }
   ));
   res.end('');
   console.log('Path Hit: ' + req.url + '\nClosest Ferry Terminal: ' + closest['key'] + ', ' + 
    	closest['distance'] + ' meters away' + "\n\n");
});    

//
// to handle the request
//

function handleRequest(request, response){
    try {
        //log the request on console
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

// create the http server
var server = http.createServer(handleRequest);

// start our http server
server.listen(80, function(){
   console.log("Server running");
});
