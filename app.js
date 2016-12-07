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

	allStations.forEach(function(station){
		self.stations.push( new stations(station))
	});
}

ko.applyBindings(new SubWayListViewModel());


