var model = [
	{
		"subwayName": "Union Station", 
		"address": "801 N Vignes St, Los Angeles 90012",
		"geolocation":  {lat: 34.056219, lng: -118.236502} 
	},
	{
		"subwayName": "Civic Center", 
		"address": "101 S Hill St, Los Angeles 90013",
		"geolocation":  {lat: 34.05426, lng: -118.246891}
	},
	{
		"subwayName": "Pershing Square", 
		"address": "500 S Hill St, Los Angeles 90013",
		"geolocation":  {lat: 34.04851, lng: -118.253278}
	},
	{	
		"subwayName": "7th St/Metro Center", 
		"address": "660 S Figueroa St, Los Angeles 90017",
		"geolocation":  {lat: 34.048707, lng: -118.258518}
	},
	{
		"subwayName": "Westlake/MacArthur Park",
		"address": "660 S Alvarado St, Los Angeles 90057",
		"geolocation":  {lat: 34.05721, lng: -118.275925 }
	},
	{
		"subwayName": "Wilshire/Vermont", 
		"address": "3191 Wilshire Bl, Los Angeles 90005",
		"geolocation":  {lat: 34.062256, lng: -118.289497 } 
	},
	{			
		"subwayName": "Wilshire/Normandie",
		"address": "3510 Wilshire Bl, Los Angeles 90005",
		"geolocation":  {lat: 34.061332, lng: -118.301165 }
	},
	{
		"subwayName": "Wilshire/Western", 
		"address": "3775 Wilshire Bl, Los Angeles 90005",
		"geolocation":  {lat: 34.06211, lng: -118.308859 }
	}
];


function stations(data){
	var self = this;

	self.name = ko.observable(data.subwayName);
	self.address = ko.observable(data.address);
	self.geoLocation = ko.observable(data.geolocation);
}

function SubWayListViewModel() {
	var self = this;
	self.stations = ko.observableArray([]);
	//sets varaible filter to a ko.obesrvable
	self.filter = ko.observable('');

	model.forEach(function(station){
		self.stations.push( new stations(station))
	});

	//Render markers from the ViewModel....refactored the code below on line 75 from notes(https://discussions.udacity.com/t/having-trouble-on-markers-array/181801/4) 
	// for (var i = 0; i < model.length; i++) {
		//     createMarker(model[i]);
		// }

	// function createMarker(marker){
	//    	var marker = new google.maps.Marker({
		//      position: marker.geolocation,
		//      map: map,
		//  	title: ""
	 //    	});
	 // }
	self.stations().forEach(function(location){
		var marker = new google.maps.Marker({
			map: map,
			position: location.geoLocation(),
			title: location.name()
		});

		location.marker = marker;
	})

	//creates a property on the object SubWayListView with a ko.computed function as a value. 
	self.filteredItems = ko.computed(function(){
		//sets local variable filter to the value of self.filter which takes userinput from an input.  makes all entered string lowercase
		var filter = self.filter().toLowerCase();
		//if filter has no text (strings) in it call self.stations which returns entire array of stations
		if (!filter){
			return self.stations()
		//if filter then do something else.....
		} else {
			//returning some ko.utils arrfilter which takes an arry as first parameter and and a function that returns a boolean
			return ko.utils.arrayFilter(self.stations(), function(item){
				//takes item.name() which returns the value of the name property of all items in the stations() observableArray and makes the string lowercase. Th search function takes the user input from the input and returns a boolean for each item in the stations() observableArray after each keyup. For search function any value greater than -1 is true. -1 is false. 
				return item.name().toLowerCase().search(filter) > -1;
			})
		} 
	})
}

var map;
function initMap() {
     var self = this;
     //Testing out how styles work....
     var styles = [
         {
             featureType: 'road.local',
             elementType: 'geometry.fill',
             stylers: [{color: '#FFB6C1'}]
         }
     ];

     var downTown = {lat: 34.052235, lng: -118.243683};
     // Constructor creates a new map - only center and zoom are required.
     map = new google.maps.Map(document.getElementById('map'), {
        center: downTown,
       	zoom: 13,
       	styles: styles
     });

	ko.applyBindings(new SubWayListViewModel());
}

