var model = [
	{
		"name": "<h3>Golden Gopher</h3>", 
		"address": "417 W. 8th St, Los Angeles, CA 90014",
		"geoLocation":  {lat: 34.04501, lng: -118.25619},
		"type": "<h3><span class='glyphicon'>&#127864;</span></h3>",
		"typeId": "1",
		"image": 'gg.jpg',
		"yelpId": "golden-gopher-los-angeles" 
	},
	{
		"name": "<h3>Baldoria</h3>", 
		"address": "",
		"geoLocation":  {lat: 34.0482589, lng: -118.2423212},
		"type": "<h3><span class='glyphicon'>&#x1F377;</span></h3>",
		"typeId": "2",
		"image": 'ACBrewery.jpg',
		"yelpId": "baldoria-los-angeles" 
	},
	{	
		"name": "<h3>Miro</h3>", 
		"address": "888 Wilshire Blvd, Los Angeles, CA 90017",
		"geoLocation":  {lat: 34.049792, lng: -118.259187},
		"type": "<h3><span class='glyphicon'>&#x1F377;</span></h3>",
		"typeId": "3",
		"image": "<style> background-image: url('gg.jpg')</style>",
		"yelpId": "miro-los-angeles"
	},
	{
		"name": "<h3>Wokcano</h3>",
		"address": "800 W 7th St, Los Angeles, CA 90017",
		"geoLocation":  {lat: 34.0486002281524, lng: -118.259231314681},
		"type": "<h3><i class='fa fa-beer' aria-hidden='true'></i></h3>",
		"typeId": "3",
		"image": "<style> background-image: url('gg.jpg')</style>",
		"yelpId": "wokcano-los-angeles-4"
	},
	{
		"name": "<h3>Arashi Sushi</h3>", 
		"address": "1111 S Hope St #100, Los Angeles, CA 90015",
		"geoLocation":  {lat: 34.04209, lng: -118.2637},
		"type": "<h3><span class='glyphicon'>&#x1F378;</span></h3>",
		"typeId": "2",
		"image": "<style> background-image: url('gg.jpg')</style>",
		"yelpId": "arashi-sushi-los-angeles" 
	}
];

function SubWayListViewModel() {
	var self = this;

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
	self.showMarkerMouseOver = function(item){
		item.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
	}
	self.hideMakerMouseOut = function(item){
		item.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
	}
	function toggleBounce (locationClick){
		if (locationClick.marker.getAnimation() === 1){
			locationClick.marker.setAnimation(null);
			locationClick.marker.setIcon
		} else {
			locationClick.marker.setAnimation(1)
			bounceTimer(locationClick.marker);
		}
	}

	function openInfoWindow(locationClick){
		var marker = locationClick.marker;
		var content = "<div> "+ marker.title + "<br>" + "<img src="+marker.rating +"></img><br><img src="+ marker.imageSnapShot+"> </img></div>.";
			infowindow.setContent(content); 
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
		self.openInfoWindow = function() {
			var content = "<div> "+ marker.title + "<br>" + "<img src="+marker.rating +"></img><br><img src="+ marker.imageSnapShot+"> </img></div>.";
			infowindow.setContent(content); 
    		infowindow.open(map, marker);
 		};

		//Adds event listeners to each instance of Marker that toggles bounce animation.
		marker.addListener('click', self.openInfoWindow);		
		marker.addListener('click', toggleBounceMarkerClick);
		//adds marker to each item in the array.  Appends a property 'marker' and a value of the instaniated class Marker to each item in the array.
		location.marker = marker; 
	})
	//creates a property on the object SubWayListView with a ko.computed function as a value. 
	self.filteredItems = ko.computed(function(){
		//sets local variable filter to the value of self.filter which takes userinput from an input.  makes all entered string lowercase
		var filter = self.filter().toLowerCase();
		//if filter has no text (strings) in it call self.stations which returns entire array of stations and set all marker visible to true. 
		if (!filter){
			self.stations().forEach(function(item, i){
				item.marker.setVisible(true);	
			})
		return self.stations();
		//if filter then do something else.....
		} else {
			//returning some ko.utils arrfilter which takes an arry as first parameter and and a function that returns a boolean
			return ko.utils.arrayFilter(self.stations(), function(item){
				//takes item.name() which returns the value of the name property of all items in the stations() observableArray and makes the string lowercase. The search function takes the user input from the input and returns a boolean for each item in the stations() observableArray after each keyup. For search function any value greater than -1 is true. -1 is false. 
				if (item.name.toLowerCase().indexOf(filter) > -1){
					//if item in array is returned from filter then make marker visible and return the item in array.
					item.marker.setVisible(true);
					return item;
				}else{
					//if item is not returned from filter then set marker visible to false.
					item.marker.setVisible(false);	
				} 
			})
		} 
	})
}

var map, infowindow;
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
       	zoom: 14,
       	styles: styles
     });

    infowindow = new google.maps.InfoWindow({

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

(function yelpInvoker (){
	model.forEach(function(item, i){
		var yelpAPIUrl = "https://api.yelp.com/v2/business/" + model[i].yelpId;
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
			callback: 'cb'         
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
		$.ajax(settings)
		.done(function(returnedData){
			var data = returnedData;
			var marker = model[i].marker;
			marker.rating = data.rating_img_url_small;
			marker.imageSnapShot = data.image_url;
		})
		.fail(function(){
			alert("Oops looks like we can't access Yelp right now. Please browse the site and try refreshing the page in a few minutes.")
		});
	})
})();

$("#menu-icon").click(function(){
	$("nav").toggleClass("open");
	$("#instructions").hide();
})
