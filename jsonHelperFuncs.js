
module.exports = {
 addEntry: (dbJson, timeStamp, money, karma, name) => {
  dbJson.Name = name;
  dbJson.LastUpdate = timeStamp;
  dbJson.Data[dbJson.Data.length] = {
    "Time": timeStamp.toString(),
    "Money": money.toString(),
    "Karma": karma.toString(),
  }
  return dbJson;
},
createJSON: (timeStamp, money, karma, name) => {
  return {
          "Name": name,
	        "LastUpdate": timeStamp,
	        "Data": [
		                {
                    "Time": timeStamp.toString(),
			              "Money": money.toString(),
			              "Karma": karma.toString()
		                }
	                ]
        };
},
};