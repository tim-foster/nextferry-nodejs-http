var should = require('should');
var assert = require('assert');
var request = require('supertest');
var server = require('../http.js');
require('should-http');

describe('Routing', function(){
	var url = 'http://localhost:8080';

	before(function(done){
		done();
	});

	describe("Won't send Query info", function(){
		it("Return 400 status code", function(done){
			var profile = { name: "blah"};
			request(url)
				.get('/v0/ferry')
				.send(profile)
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.should.have.status(400);
					done();
				});
		});
	});

	describe("Send Improper Query Info", function(){
		it("Returns 400 if improper route", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=255')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.should.have.status(400);
					res.should.be.json();
					done();
				});
		});
	});

	describe("Will send Query info", function(){
		it("Returns 200 when sent proper values", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.should.have.status(200);
					res.should.be.json();
					done();
				});
		});

		it("Contains departingTerminal in response", function(done){
			var profile = { name: "blah"};
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.send(profile)
				.end(function(err, res){
					if(err){
						throw err;
					}
					//console.dir(res);
					res.body.should.have.property('departingTerminal');
					res.should.be.json();
					done();
				});
		});

		it("Contains location in response", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.end(function(err, res){
					if(err){
						throw err;
					}
					//console.dir(res);
					res.body.should.have.property('location');
					res.should.be.json();
					done();
				});
		});

		it("Contains times in response", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.end(function(err, res){
					if(err){
						throw err;
					}
					//console.dir(res);
					res.body.should.have.property('times');
					res.should.be.json();
					done();
				});
		});

		it("Contains routeName in response", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.end(function(err, res){
					if(err){
						throw err;
					}
					//console.dir(res);
					res.body.should.have.property('routeName');
					res.should.be.json();
					done();
				});
		});
	});

	describe("Returns correct route names", function(){
		it("14 is Fauntleroy / Vashon", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=14')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Fauntleroy / Vashon');
					done();
				});
		});

		it("15 is Southworth / Vashon", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=15')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Southworth / Vashon');
					done();
				});
		});
		
		it("13 is Fauntleroy / Southworth", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=13')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Fauntleroy / Southworth');
					done();
				});
		});
		
		it("6 is Edmonds / Kingston", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=6')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Edmonds / Kingston');
					done();
				});
		});

		it("7 is Mukilteo / Clinton", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=7')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Mukilteo / Clinton');
					done();
				});
		});
		
		it("8 is Port Townsend / Coupeville", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=8')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Port Townsend / Coupeville');
					done();
				});
		});

		it("1 is Pt. Defiance / Tahlequah", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=1')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Pt. Defiance / Tahlequah');
					done();
				});
		});

		it("5 is Seattle / Bainbridge Island", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=5')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Seattle / Bainbridge Island');
					done();
				});
		});
		
		it("3 is Seattle / Bremerton", function(done){
			request(url)
				.get('/v0/ferry?lat=47.614053&long=-122.198366&route=3')
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.body['routeName'].should.have.equal('Seattle / Bremerton');
					done();
				});
		});
	});
});