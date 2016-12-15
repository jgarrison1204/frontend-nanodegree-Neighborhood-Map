var model = [
	{
		"name": "Union Station", 
		"address": "801 N Vignes St, Los Angeles 90012",
		"geoLocation":  {lat: 34.056219, lng: -118.236502} 
	},
	{
		"name": "Civic Center", 
		"address": "101 S Hill St, Los Angeles 90013",
		"geoLocation":  {lat: 34.05426, lng: -118.246891}
	},
	{
		"name": "Pershing Square", 
		"address": "500 S Hill St, Los Angeles 90013",
		"geoLocation":  {lat: 34.04851, lng: -118.253278}
	},
	{	
		"name": "7th St/Metro Center", 
		"address": "660 S Figueroa St, Los Angeles 90017",
		"geoLocation":  {lat: 34.048707, lng: -118.258518}
	},
	{
		"name": "Westlake/MacArthur Park",
		"address": "660 S Alvarado St, Los Angeles 90057",
		"geoLocation":  {lat: 34.05721, lng: -118.275925 }
	},
	{
		"name": "Wilshire/Vermont", 
		"address": "3191 Wilshire Bl, Los Angeles 90005",
		"geoLocation":  {lat: 34.062256, lng: -118.289497 } 
	},
	{			
		"name": "Wilshire/Normandie",
		"address": "3510 Wilshire Bl, Los Angeles 90005",
		"geoLocation":  {lat: 34.061332, lng: -118.301165 }
	},
	{
		"name": "Wilshire/Western", 
		"address": "3775 Wilshire Bl, Los Angeles 90005",
		"geoLocation":  {lat: 34.06211, lng: -118.308859 }
	}
];

function SubWayListViewModel() {
	var self = this;
	var infowindow = new google.maps.InfoWindow({
    	content: "contentString"
	});

	self.stations = ko.observableArray([]);
	//sets varaible filter to a ko.obesrvable
	self.filter = ko.observable('');

	model.forEach(function(station){
		self.stations.push(station);
	});

		//add eventlistener to li item thorugh knockoutjs.On click map marker should animate to bounce. Click binding passes the current object into the function
	self.listClickEvents = function(locationClick){
		//toggles animation property on Marker instance when location is clicked from list <li>.
		toggleBounce(locationClick);
		openInfoWindow(locationClick);
	}

	function toggleBounce (locationClick){
		if (locationClick.marker.getAnimation() === 1){
			locationClick.marker.setAnimation(null);
		} else {
			locationClick.marker.setAnimation(1)
			bounceTimer(locationClick.marker);
		}
	}

	function openInfoWindow(locationClick){
		var marker = locationClick.marker;
		infowindow.open(map, marker);
	}

	//toggles animation property on Marker instance when location is clicked from marker.
	function toggleBounceMarkerClick(){
		if (this.getAnimation() === 1){
			this.setAnimation(null);
		} else {
			this.setAnimation(1);
			bounceTimer(this);
		}
	}
	
	function bounceTimer(marker) {
    	setTimeout(function(){ 
    		marker.setAnimation(null); 
    	}, 5000);
	}

	//iterate over the stations ko.observable array and add a new marker object for each location.
	self.stations().forEach(function(location){
		var marker = new google.maps.Marker({
			map: map,
			position: location.geoLocation,
			animation: google.maps.Animation.DROP,
			title: location.name
		});
		//Adds event listeners to each instance of Marker that toggles bounce animation.
		self.createInfoWindow = function() {
    		infowindow.open(map, marker);
 		};

		marker.addListener('click', self.createInfoWindow);		
		marker.addListener('click', toggleBounceMarkerClick);
		//adds marker to each item in the array.  Appends a property 'marker' and a value of the instaniated class Marker to each item in the array.
		location.marker = marker; 
	})
	

	//creates a property on the object SubWayListView with a ko.computed function as a value. 
	self.filteredItems = ko.computed(function(){
		//sets local variable filter to the value of self.filter which takes userinput from an input.  makes all entered string lowercase
		var filter = self.filter().toLowerCase();
		//if filter has no text (strings) in it call self.stations which returns entire array of stations
		if (!filter){
			return self.stations();
		//if filter then do something else.....
		} else {
			//returning some ko.utils arrfilter which takes an arry as first parameter and and a function that returns a boolean
			return ko.utils.arrayFilter(self.stations(), function(item){
				//takes item.name() which returns the value of the name property of all items in the stations() observableArray and makes the string lowercase. The search function takes the user input from the input and returns a boolean for each item in the stations() observableArray after each keyup. For search function any value greater than -1 is true. -1 is false. 
				return item.name.toLowerCase().search(filter) > -1;
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

//**************---oauth authentication and yelp ajax request---*******************
//returns a randomly generated string for nonce.
function nonceGenerator(){
	//set text to empty string
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < possible.length; i++) {
        //append random letter/number from possible 
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var yelpAPIUrl = "https://api.yelp.com/v2/search";
var consumerKey = "pKjjkCVkTPY3raywLLURWw";
var token = "fUdERmrVQm4B28_4NMkmwGXYsk1MPTac";
var consumerSecret = "S9gTUkQ61Tvmx6P00nz8FJSXkXI";
var tokenSecret = "fhDfkFZlEVCIxBPfeZv47fF4MEA";

var parameters = {
	oauth_consumer_key: consumerKey,
	oauth_token: token,
	oauth_signature_method: 'HMAC-SHA1',
	oauth_timestamp: Math.floor(Date.now()/1000),
	//this is typical for oauth found this explanation: see this for explanation https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
	oauth_nonce: nonceGenerator(),
	callback: 'cb',
	term: "food",
	location: "San+Francisco"             
};

var encodedSignature = oauthSignature.generate('GET', yelpAPIUrl, parameters, consumerSecret, tokenSecret);
	parameters.oauth_signature = encodedSignature;

var settings = {
	url: yelpAPIUrl,
    data: parameters,
    cache: true,
    dataType: "jsonp",
};

//Used .done to return data from success ajax call because success was depreicated after jQuery 3.0
$.ajax(settings).done(function(data){
	return data;
});
