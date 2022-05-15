const express = require('express');
const cors = require('cors');
const Database = require("@replit/database")
const path = require('path')
const fetch = require('node-fetch')
const app = express();
const dataBase = new Database();
const proxy = process.env['proxy']
var top100SteamIDs = []
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
cloudscraper = require("cloudscraper");
const jsonUtil = require("./jsonHelperFuncs.js")
const Responses = {
  Success: 0,
  InvalidUser: 1,
  NoData: 2,
}
function UpdateUserData(steam64) {  // steam64 MUST be a string to avoid having to deal with large numbers in JS.
  fetch(proxy + "https://superiorservers.co/api/profile/" + steam64 + "/").then(data=> data.json()).then(async (playerInfo) => {
          console.log(`Updating Data for... ${playerInfo.Badmin.Name} ( https://superiorservers.co/api/profile/${steam64} )`);
          const currentTimeStamp = Math.round(Date.now()/1000); // UNIX seconds
          const playerDBInfo = await dataBase.get("P_" + playerInfo.SteamID64);
          // "P_" to differentiate from topPlayers.
          if(playerDBInfo == null) { // First Visit
                // Create an entirely new JSON profile
                dataBase.set("P_" + playerInfo.SteamID64, jsonUtil.createJSON(currentTimeStamp, playerInfo.DarkRP.Money, playerInfo.DarkRP.Karma, playerInfo.Badmin.Name))
          } else {
                // Add to prexisting JSON profile
                dataBase.set("P_" + playerInfo.SteamID64, jsonUtil.addEntry(playerDBInfo, currentTimeStamp, playerInfo.DarkRP.Money, playerInfo.DarkRP.Karma, playerInfo.Badmin.Name))
          }
    }).catch((err) => { 
    console.log("Fail:" + Math.round(Date.now()/1000) + " (Time)");
    })
}
async function UpdateAllUserData() {
  const keyNames = await dataBase.list("P_"); // Keynames are steam64 ids.
  UpdateTopPlayersList();
  for (let i = 0; i < keyNames.length; i++) {
    UpdateUserData(keyNames[i].substring("P_".length));
  }
  
}
async function UpdateTopPlayersList() {
  const leaderBoardData = await fetch(proxy + "https://superiorservers.co/api/darkrp/leaderboard/money/").then(data=> data.json())
    formattedData = {}
    const timeStamps = await dataBase.get("timeStamps");
    const currentTimeStamp = Math.round(Date.now()/1000); // UNIX seconds
    for(var i = 0; i < leaderBoardData.Data.length; i ++) {
          const playerInfo = leaderBoardData.Data[i];
          console.log(`Top 100 (${playerInfo.Rank}) | Updating Data for ${playerInfo.Name} ( https://superiorservers.co/api/profile/ ${playerInfo.SteamID64} )`);
          const playerDBInfo = await dataBase.get("TP_" + playerInfo.SteamID64);

          // "TP_" to differentiate from regular players
          if(playerDBInfo == null) { // First Visit
                // Create an entirely new JSON profile
                if(timeStamps != null) {
                  dataBase.set("TP_" + playerInfo.SteamID64, jsonUtil.NewTopPlayersEntry(timeStamps, playerInfo.Money, playerInfo.Name))
                } else {
                  dataBase.set("TP_" + playerInfo.SteamID64, jsonUtil.NewTopPlayersEntry([], playerInfo.Money, playerInfo.Name))
                }

          } else {
                // Add to prexisting JSON profile
                dataBase.set("TP_" + playerInfo.SteamID64, jsonUtil.AddTopPlayersEntry(playerDBInfo, playerInfo.Money, playerInfo.Name))
          }
    }
      if(timeStamps == null) {
        dataBase.set("timeStamps", [currentTimeStamp])
      } else {
        timeStamps.push(currentTimeStamp);
        dataBase.set("timeStamps", timeStamps);
      }
  return top100SteamIDs;
}
async function getSteamProfiles(steamIDs) {
  const data = await fetch("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=A223629895416F3E62A2E08F84D92D7A&steamids=" + steamIDs).then(data=> data.json());
  return data;
}
async function a() {

}
a();
UpdateAllUserData();
setInterval(UpdateAllUserData, 86400000); // Every 30 mins


app.get('/api/player/:steamid', async (req, res) => {
    const playerData = await dataBase.get("P_" + req.params.steamid);
    if(playerData == null) {
      const steamProf = await getSteamProfiles(req.params.steamid);
      if(steamProf.response.players.length > 0) { // Check if steamID is valid player
          UpdateUserData(req.params.steamid)
          res.send({Response: Responses.NoData});
      } else {
          res.send({Response: Responses.InvalidUser});
      }
    } else {
      res.send({Response: Responses.Success, Player: playerData});
    }
});
app.get('/api/top/players/', async (req, res) => {
    const timeStamps = await dataBase.get("timeStamps");
    const topPlayerSteamIDs = await dataBase.list("TP_");
    var topPlayerData_Temp = []
    for(var i = 0; i < topPlayerSteamIDs.length; i++) { // Collect all Data
        topPlayerData_Temp[i] = dataBase.get(topPlayerSteamIDs[i]);
    }
    const topPlayerData = await Promise.all(topPlayerData_Temp); // Wait for data to "come in"
    if(topPlayerData == null || timeStamps == null) {
          res.send({Response: Responses.NoData});
    } else {
      res.send({Response: Responses.Success, TimeStamps: timeStamps, Data: topPlayerData});
    }
});
app.get('/api/clear/:steamid', async (req, res) => {
  dataBase.delete(req.params.steamid)
  console.log(req.params.steamid + " Removed.")
  res.send({Response: Responses.Success});
});
app.get('/api/clearall/', async (req, res) => {
  console.log("Clearing All...")
  await dataBase.empty();
  console.log("Cleared All!")
  res.send({Response: Responses.Success});
});
app.get('/api/profilepic/:steamid', async (req, res) => {
  const playerData = await getSteamProfiles(req.params.steamid);
  return res.redirect(playerData.response.players[0].avatarfull);
})
app.get('/api/open/*', async (req, res) => {
    var error = false;
    const requestedURL = req.originalUrl.substring("/api/open/".length);
    const data = await fetch(proxy + "https://superiorservers.co/api/" + requestedURL)
    const dataJSON = await data.json().catch(err => {
      res.send({Response: Responses.NoData});
      error = true;
      return;
      });
  if(!error) {
    if(dataJSON == null) {
      res.send({Response: Responses.NoData});
    } else {
      res.send({Response: Responses.Success, Data: dataJSON});
    }
  }



})
app.get('/awake/*', async (req, res) => {
  res.send("Still Awake.");
});
app.listen(3000, () => {
  console.log('server started');
});
