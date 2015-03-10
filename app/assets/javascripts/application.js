// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .




$(document).on("ready", function(){

	//getLocation(callbackFun);
	templatesRender();
	loadButton();
	startTime();

})


var templates = {};

var sample_data = {
	status: "good",
	location: "close",
	bikes: "14",
	empty: "13"
};

var currentLocation = {

};

var data = {

};

var templatesRender = function(){

	var busTemplate = $(".bus-template").html();
	templates.bus = Handlebars.compile(busTemplate);
	var railTemplate = $(".rail-template").html();
	templates.zipcar = Handlebars.compile(railTemplate);
	var zipcarTemplate = $('.zipcar-template').html();
	templates.zipcar = Handlebars.compile(zipcarTemplate)
	var uberTemplate = $('.uber-template').html();
	templates.uber = Handlebars.compile(uberTemplate);
	var bikeshareTemplate = $('.capital-bikeshare-template').html();
	templates.bikeshare = Handlebars.compile(bikeshareTemplate);

}


var updateAll = function(){

	getBikeshare(currentLocation);
	getUber(currentLocation);
	//getMetroRail(currentLocation);
	//getMetroBus(currentLocation);

	// $('.metro-bus-table').append(templates.bus(sample_data));
	// $('.metro-rail-table').append(templates.rail(sample_data));
	// $('.bikeshare-table').append(templates.bikeshare(sample_data));
	// $('.uber-table').append(templatens.uber(sample_data));
	// $('.zipcar-table').append(templates.zipcar(sample_data));

	var u = setTimeout(function(){updateAll()}, 60000);

}


var callbackFun = function(data){

	currentLocation.lat = data.coords.latitude;
	currentLocation.long = data.coords.longitude;

	updateAll();

}

var getLocation = function(callback){

	navigator.geolocation.getCurrentPosition(callbackFun);

}

var postLocation = function(){

	$.ajax({
	  type: "POST",
	  url: "/users/1/locate",
	  data: currentLocation
	});

}

//hopefully this is what we need
var getMetroBus = function(location){

	$.ajax({
		type: "GET",
		url: "/buses",
		data: location,
		success: function(result){
			console.log(result)
			data.metroBus = result;
			listMetroBus();
		}
	})

}

var listMetroBus = function(){

	if(data.metrobus.length > 0){
		$('.metro-bus-table').removeClass("hidden");
	}

	for(var i = 0 ; i < data.metrobus.length ; i++){
		$('.metro-bus-table').append(templates.bus(data.metrobus[i]));
	}

}

var getZipcar = function(location){

	$.ajax({
		type: "GET",
		url: "/zipcars",
		data: location,
		success: function(result){
			console.log(result)
			data.zipcar = result;
			listZipcar();
		}
	})

}

var listZipcar = function(){

	if(data.metrobus.length > 0){
		$('.metro-bus-table').removeClass("hidden");
	}

	for(var i = 0 ; i < data.metrobus.length ; i++){
		$('.metro-bus-table').append(templates.bus(data.metrobus[i]));
	}

}

var getMetroRail = function(location){

	$.ajax({
		type: "GET",
		url: "/trains",
		data: location,
		success: function(result){
			data.metroRail = result;
			console.log(result);
			listMetroRail();
		}
	})

}

var listMetroRail = function(){

	if(data.metroRail.length > 0){
		$('.metro-rail-table').removeClass("hidden");
	}

	for(var i = 0 ; i < data.bikeshare.length ; i++){
		$('.bikeshare-table').append(templates.rail(data.metroRail[i]));
	}

}

var getUber = function(location){

	$.ajax({
		type: "GET",
		url: "/ubers",
		data: location,
		success: function(result){
			data.uber = result;
			console.log(result);
			listUber();
		}
	})

}



var listUber = function(){

	if(data.uber.length > 0){
		$('.uber-table').removeClass("hidden");
	}

	for(var i = 0 ; i < data.uber.length ; i++){
		$('.uber-table').append(templates.uber(data.uber[i]));
	}

}

var getBikeshare = function(location){

	$.ajax({
		type: "GET",
		url: "/bikeshares",
		data: location,
		success: function(result){
			data.bikeshare = result;
			console.log(result);
			listBikeshare();
		}
	})

}

var listBikeshare = function(){

	if(data.bikeshare.length > 0){
		$('.bikeshare-table').removeClass("hidden");
	}

	for(var i = 0 ; i < data.bikeshare.length ; i++){
		$('.bikeshare-table').append(templates.bikeshare(data.bikeshare[i]));
	}

}

var loadButton = function(){

	$('#load-content').click(function(){
		getLocation();
	})

}

var startTime = function() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $('.time').html(h+":"+m+":"+s);
    var t = setTimeout(function(){startTime()},500);
}

var checkTime = function(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


/*
make calls to these, pass longitude and latitude
bikeshare: GET /bikeshare
bus: GET /metro-Bus
rail: GET /metro-Rail
zipcar: GET /zipcars
uber: GET /uber
*/

