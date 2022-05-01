
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
NewTopPlayersEntry: (prexistingTimeStamps, money, name) => {
      // PrexistingTimeStamps is necessary incase someone drops off the leaderboard and a new player comes onto it.
        moneyArray = [];
        for(var i = 0; i < prexistingTimeStamps.length; i++) {
          moneyArray.push(null);
        }
        moneyArray.push(money.toString());
        return {
          "Name": name,
	        "Data": moneyArray,
        };
},
AddTopPlayersEntry: (dbJson, money, name) => {
      dbJson.Name = name;
      dbJson.Data[dbJson.Data.length] = money.toString();
  return dbJson;
},
};