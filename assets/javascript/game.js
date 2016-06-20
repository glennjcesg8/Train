TrainPage = function()
{
	var trainName = $("#trainName");
	var trainDest = $("#trainDest");
	var trainFreq = $("#trainFreq");
	var firstTrainTime  = $("#firstTrainTime");
	var freq = $("#trainFreq");
	var trainSubmit = $("#trainSubmit");
	var trainTable = $("#trainTable");
	var myData = new Firebase("https://glennsapp.firebaseio.com/");
	trainSubmit.on( "click", function() {SubmitTrainFB();});

	trainName.on( "focusout", function() {ValidateName();});
	trainDest.on( "focusout", function() {ValidateDest();});
	firstTrainTime.on( "focusout", function() {ValidateTime();});
	freq.on( "focusout", function() {ValidateFreq();});

	var trainInfo = {
				"name":"",
				"dest":"",
				"startTime":"",
				"freq":0
	};

	this.Init=function(){
		setInterval(function(){GetUpDatedTrainInfo();}, 60000);
	};

	this.GetTrainInfo=function(){
		GetUpDatedTrainInfo();
	};

	ValidateTime=function(){
		if(moment(firstTrainTime.val(),"HH:mm",true).isValid()){

		}else
		{
			alert("You must enter a valid date in military HH:mm format.");
			firstTrainTime.focus();
		}
		
	};
	ValidateFreq=function(){
		var f = trainFreq.val();
		if(f.match(/[^0-9]/i)){
			alert("Minutes can only contain 0 - 9");
			trainFreq.focus();
		}
	};

	ValidateDest=function(){
		var dest = trainDest.val();
		if(dest.match(/[^0-9a-z\-\s]/i) || dest.length < 4){
			alert("Train destination must be alphanumeric and at least 4 characters");
			trainDest.focus();
		}
	};

	ValidateName=function(){
		var name = trainName.val();
		if(name.match(/[^0-9a-z\-\s]/i) || name.length < 4){
			alert("Train name must be alphanumeric and at least 4 characters");
			trainName.focus();
		}
	};


	SubmitTrainFB=function(){
		trainInfo.name = "";
		trainInfo.dest = "";
		trainInfo.startTime = "";
		trainInfo.freq = 0;

		trainInfo.name = trainName.val();
		trainInfo.dest = trainDest.val();
		trainInfo.startTime = firstTrainTime.val();
		trainInfo.freq = trainFreq.val();
		try{
			var ref = myData.push(trainInfo, function(data) {
				GetUpDatedTrainInfo();
				trainName.val("");
				trainDest.val("");
				firstTrainTime.val("");
				trainFreq.val("");
			});		
		}catch(ex){
			//Do Something
		}
	};


	
	GetUpDatedTrainInfo=function(){
			try{
					myData.once("value", function(data) {
		   			var trains = data.exportVal();
		   			var trainRow;
					var startTime;
					var currentTime;
					var aTime;
					var duration;
					var due;
		   			trainTable.empty();
		   		    trainTable.append("<tr><th>Train Name</th><th>Destination</th><th>Frequency(min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>");
		   			for (var property in trains) {
		   				trains = data.exportVal();
					    if (trains.hasOwnProperty(property)) {
					      	trainRow = trains[property];
						    startTime = moment(trainRow.startTime,"HH:mm");
						    currentTime =  moment();
	           		        if(currentTime < startTime){
						       		aTime = startTime.subtract(1,"days");
						       }else{
						       		aTime = startTime;
						       }
	       			   	       while(aTime < currentTime){
	       			   	       		aTime = moment(aTime).add(trainRow.freq, "minutes");
	       			   	       }
	       			   	       duration = moment.duration(aTime.diff(currentTime));
							   due = duration.asMinutes();
							   due = Math.floor(due);
							   aTime = aTime.format("hh:mm A");
						       trainTable.append("<tr><td>"+trainRow.name+"</td><td>"+trainRow.dest+"</td><td>"+trainRow.freq+"</td><td>"+aTime+"</td><td>"+due+"</td></tr>");
					    }
					}
				});		
			}catch(ex){
				//Do Something
			}
	}
};

$(document).ready(function(){
	 var tp = new TrainPage();
	 tp.Init();
	 tp.GetTrainInfo();
})





