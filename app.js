var allStations = [
	{
		"subwayName": "Union Station", 
		"address": "801 N Vignes St, Los Angeles 90012" 
	},
	{
		"subwayName": "Civic Center", 
		"address": "101 S Hill St, Los Angeles 90013 "
	},
	{
		"subwayName": "Pershing Square", 
		"address": "500 S Hill St, Los Angeles 90013"
	}, 
	{	
		"subwayName": "7th St/Metro Center", 
		"address": "660 S Figueroa St, Los Angeles 90017"
	},
	{
		"subwayName": "Westlake/MacArthur Park",
		"address": "660 S Alvarado St, Los Angeles 90057"
	},
	{
		"subwayName": "Wilshire/Vermont", 
		"address": "3191 Wilshire Bl, Los Angeles 90005" 
	},
	{			
		"subwayName": "Wilshire/Normandie",
		"address": "3510 Wilshire Bl, Los Angeles 90005"
	},
	{
		"subwayName": "Wilshire/Western", 
		"address": "3775 Wilshire Bl, Los Angeles 90005"
	}
];

function stations(data){
	var self = this;

	self.name = ko.observable(data.subwayName);
	self.address = ko.observable(data.address);
}

function SubWayListViewModel() {
	var self = this;
	self.stations = ko.observableArray([]);
	//sets varaible filter to a ko.obesrvable
	self.filter = ko.observable('');

	allStations.forEach(function(station){
		self.stations.push( new stations(station))
	});

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
				var test = item.name().toLowerCase().search(filter) > -1;
				console.log(test);
				return test;
			})
		} 
	})
}

ko.applyBindings(new SubWayListViewModel());


