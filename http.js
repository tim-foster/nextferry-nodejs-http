//
// import required modules
//

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var geolib = require('geolib');
var fs = require('fs');
var xml2js = require('xml2js');
var InNOut = require('in-n-out');
var request = require('request');
var util = require('util');

//
// some globals for this crappy HTTP server
//
//    TODO 
//       move to config file
//       find closest should not find Vashon if not on Vashon, etc
//

var port = process.env.PORT || '8080';

// Boundary points create rough polygon around Vashon.
var gf = new InNOut.Geofence([
                        [47.30856866998022, -122.4810791015625],
                        [47.33510005753562, -122.54837036132812],
                        [47.37556964623242, -122.53120422363281],
                        [47.43087434400905, -122.52639770507812],
                        [47.49076091764255, -122.49824523925781],
                        [47.51905562097127, -122.48039245605469],
                        [47.50514209901774, -122.43644714355469],
                        [47.458272792347074, -122.41447448730469],
                        [47.413684985326796, -122.40211486816406],
                        [47.37835950831887, -122.3602294921875],
                        [47.354640975385315, -122.40554809570312],
                        [47.32067235909414, -122.45567321777344],
                        [47.30856866998022, -122.4810791015625]],
                        100)

var terminals = [];
terminals["14"] =  // FAUNTLEROY / VASHON
{
    "Fauntleroy Ferry Dock": {latitude: 47.5232072, longitude: -122.3962173},  
    "Vashon Ferry Dock": {latitude: 47.5101587, longitude: -122.4649865},      
};
terminals["15"] = // SOUTHWORTH / VASHON
{
    "Southworth Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "Vashon Ferry Dock": {latitude: 47.5101587, longitude: -122.4649865},      
};
terminals["13"] = // FAUNTLEROY / SOUTHWORTH
{
    "Fauntleroy Ferry Dock": {latitude: 47.5232072, longitude: -122.3962173},  
    "Southworth Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
};
terminals["272"] = // Anacortes / San Juan Islands / Sidney B.C.
{
    "Anacortes Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "San Juan Is. Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
    "Sidney B.C. Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
};
terminals["6"] = // Edmonds / Kingston
{
    "Edmonds Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "Kingston Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
};
terminals["7"] = // Mukilteo / Clinton
{
    "Mukilteo Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "Clinton Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
};
terminals["8"] = // Port Townsend / Coupeville
{
    "Port Townsend Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "Coupeville Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
};
terminals["1"] = // Pt. Defiance / Tahlequah 
{
    "Pt. Defiance Ferry Dock": {latitude: 47.8089375, longitude: -122.385275},  
    "Tahlequah Ferry Dock": {latitude: 47.3327917, longitude: -122.5148658},
};
terminals["5"] = // Seattle / Bainbridge Island
{
    "Seattle Ferry Dock": {latitude: 47.6026651, longitude: -122.3383706},  
    "Bainbridge Ferry Dock": {latitude: 47.6230888, longitude: -122.5133598 },      
};
terminals["3"] = // Seattle / Bremerton
{
    "Seattle Ferry Dock": {latitude: 47.6026651, longitude: -122.3383706},  
    "Bremerton Ferry Dock": {latitude: 47.7959266, longitude: -122.4963502},      
};

var routes = [];
routes["14"] =
{
  "routeName": "Fauntleroy / Vashon"
};
routes["15"] =
{
  "routeName": "Southworth / Vashon"
}
routes["13"] =
{
  "routeName": "Fauntleroy / Southworth"
}
routes["272"] =
{
  "routeName": "Anacortes / San Juan Islands / Sidney B.C."
}
routes["6"] =
{
  "routeName": "Edmonds / Kingston"
}
routes["7"] =
{
  "routeName": "Mukilteo / Clinton"
}
routes["8"] =
{
  "routeName": "Port Townsend / Coupeville"
}
routes["1"] =
{
  "routeName": "Pt. Defiance / Tahlequah"
}
routes["5"] =
{
  "routeName": "Seattle / Bainbridge Island"
}
routes["3"] =
{
  "routeName": "Seattle / Bremerton"
}
//
// continually load all the schedules into memory 
//
//   TODO refactor for multiple schedules and docks
//

var schedule = [];
//loadSchedules();
setInterval(loadSchedules, 60 * 1000);

function loadSchedules()
{
  return new Promise((resolve, reject) => {
    Promise.all(
      [
        loadSchedule(14,60),
        loadSchedule(15,60),
        loadSchedule(13,60),
        //loadSchedule(272,60);
        loadSchedule(6,60),
        loadSchedule(7,60),
        loadSchedule(8,60),
        loadSchedule(1,60),
        loadSchedule(5,60),
        loadSchedule(3,60)
      ])
    .then(() => {
      resolve();
    })
  })
}
 
function loadSchedule(route, cache) {
    var parser = new xml2js.Parser();

    // need to load the XML file and parse schedule information
    //console.log("Loading XML: " + __dirname + '/schedules/route_' + route + '.xml');
    try {
      var apiRequestString = "http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/%s/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c";
      var options = {
        url: util.format(apiRequestString, route),
        headers: {
          'Accept':'application/json'
        },
        method: 'GET'
      };
      return new Promise((resolve, reject) => {
        request(options, function(error, response, body){
          if(error){
            console.log(error);
          }
          else{
            var info = JSON.parse(body);
            // console.dir(info);
            var firstTerminal = Object.keys(terminals[route])[0];
            var secondTerminal = Object.keys(terminals[route])[1];
            schedule[route] = [];
            schedule[route][firstTerminal] = info["TerminalCombos"][0];
            schedule[route][secondTerminal] = info["TerminalCombos"][1];
            resolve();
          }
        });
      })
      
      /*
      fs.readFile(__dirname + '/schedules/route_' + route + '.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
        var firstTerminal = Object.keys(terminals[route])[0];
        var secondTerminal = Object.keys(terminals[route])[1];
        //console.log("Route: " + route);
        schedule[route] = [];
        schedule[route][firstTerminal] = result["SchedResponse"]["TerminalCombos"][0]["SchedTerminalCombo"][0];
        schedule[route][secondTerminal] = result["SchedResponse"]["TerminalCombos"][0]["SchedTerminalCombo"][1];
        //console.dir("Route: " + route);
        //console.dir(schedule[route]); 
        //console.log('Done');
        });
      });
      */

    } catch(err) {
        console.log("Failed to load XML: " + err);
    }
}

function clearTerminals(isInVashon, terminalSet){
  var tempTerminalSet = {}
  for(terminal in terminalSet){
    //Clearing invalid terminals from the terminal set whether or not we are in vashon.
    if(isInVashon == gf.inside([terminalSet[terminal]["latitude"], terminalSet[terminal]["longitude"]])){
      tempTerminalSet[terminal] = terminalSet[terminal];
    }
  }
  return tempTerminalSet;
}

//
// ferry times request
//
//   GET params:
//  route: terminal route (vashon/faunt is route 14)
//  lat: current device lat
//  long: current device long
//

dispatcher.onGet("/v0/ferry", function(req, res) {
  try{
    var route = 0;
    var location = { latitude: 0, longitude: 0 }
    var isInVashon = null;
    var terminalSet = {};
    var response = {};

    // parse the query data
    queryData = url.parse(req.url, true).query;
    route = queryData.route;
    if(!route)
      route = 14;
    location.latitude = queryData.lat;
    location.longitude = queryData.long;

    //Check if the location is inside of vashon
    isInVashon = gf.inside([location.latitude, location.longitude]);



    //Clearing improper terminals from the terminal set based on vashon location.
    if(isInVashon){
      terminalSet = clearTerminals(isInVashon, terminals[route]);
    }
    else{
      terminalSet = clearTerminals(isInVashon, terminals[route]);
    }

    // find the closest location for the route
    closest = geolib.findNearest(location, terminalSet);

    //console.log('Path Hit: ' + req.url + '\nClosest Ferry Terminal: ' + closest['key'] + ', ' + 
    //  closest['distance'] + ' meters away' + "\n\n");
    //console.dir(schedule[route]);

    //Build the dictionary we will be using to write results
    response.departingTerminal = closest['key'];
    response.location = terminals[route][closest['key']];
    response.times = [
                          //Sometimes the route does not have times populated. Use ternary to prevent null reference error.
                          // schedule[route][closest['key']]["Times"] != "" ? schedule[route][closest['key']]["Times"][0]["SchedTime"][0] : "unknown Times",
                          // schedule[route][closest['key']]["Times"] != "" ? schedule[route][closest['key']]["Times"][0]["SchedTime"][1] : "unknown Times"
                          schedule[route][closest['key']]["Times"] != "" ? schedule[route][closest['key']]["Times"][0] : "unknown Times",
                          schedule[route][closest['key']]["Times"] != "" ? schedule[route][closest['key']]["Times"][1] : "unknown Times"
                          ];
    response.routeName = routes[route].routeName;

    // time to write our results
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(response));
    res.end('');
  } catch(err){
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({routeName:"Improper Request"}));
    res.end('');
  }
  
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
this.server = http.createServer(handleRequest);

if(require.main === module){
  // start our http server
  // this.server.listen(8080, function(){
  //    console.log("Server running");
  // });
  loadSchedules()
    .then(() =>{
      console.log('Listening on: '+ port);
      this.server.listen(port);
    });

} else {
  exports.server = this.server;

  exports.listen = function(port){
    loadSchedules()
      .then(() =>{
        this.server.listen(port);
      });
    return this.server;

  };

  exports.close = function(){
    this.server.close();
  };


}

// // start our http server
// server.listen(8080, function(){
//    console.log("Server running");
// });
