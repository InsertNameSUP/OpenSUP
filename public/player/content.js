const urlParams = new URLSearchParams(window.location.search);
const s = urlParams.get('s');
const Responses = {
  Success: 0,
  InvalidUser: 1,
  NoData: 2,
}
var playerData = null;
var steamProfile = null;


(async () => {
    playerData = await fetch("https://opensup.insert-name.repl.co/api/player/" + s).then(data => data.json());
    if(document.readyState && playerData.Response == Responses.Success) {
        document.getElementById("user-profile-pic").src = "https://opensup.insert-name.repl.co/api/profilepic/" + s;
        document.getElementById("user-name").innerText = playerData.Player.Name;
        document.getElementById("last-updated").innerText = "Updated " + Math.round((Date.now()/1000 - parseInt(playerData.Player.LastUpdate))/60) + " minutes ago";
        instantiateCharts();   
    }
    else if(playerData.Response == Responses.NoData) {
      document.getElementById("chart-container").innerHTML = "No Substantial Data Collected. Try again later.";
      window.location.reload(); // Retry so we can get user info like Name and profile pic
      return;
    }
})()

function instantiateCharts() {
    var moneyValues = [];
    var karmaValues = [];
    var moneyTimeStamps = [];
    var karmaTimeStamps = [];
    var moneyChart = document.getElementById("money-track").getContext('2d');
    var karmaChart = document.getElementById("karma-track").getContext('2d');
    playerData = playerData.Player;
  
    if(playerData.Data.length <= 1) {
      document.getElementById("chart-container").innerHTML = "No Substantial Data Collected. Try again later.";
      return;
    }
    if(playerData.Data.length < 3 && playerData.Data.length > 0) { // if theres less than 3 entries, just print all of them onto the graph
      for(var i = 0; i < playerData.length; i++) {
            moneyValues.push(playerData.Data[i].Money);
            moneyTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));
            karmaValues.push(playerData.Data[i].Karma);
            karmaTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));
      }
    }
    for(var i = 0; i < playerData.Data.length; i++) { // Money
        if(i == 0 || i == 1 || i == (playerData.Data.length - 1)) {
            moneyValues.push(playerData.Data[i].Money);
            moneyTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));
            karmaValues.push(playerData.Data[i].Karma);
            karmaTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));
        } else {
            if(playerData.Data[i].Money != playerData.Data[i - 1].Money && playerData.Data[i].Money != playerData.Data[i + 1].Money) { // Remove Duplicates if the point has the same value as the two points behind it and the point infront of it.
                moneyValues.push(playerData.Data[i].Money);
                moneyTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));
            }
            if(playerData.Data[i].Karma != playerData.Data[i - 1].Karma && playerData.Data[i].Karma != playerData.Data[i - 2].Karma && playerData.Data[i].Karma == playerData.Data[i + 1].Karma) { // Remove Duplicates
                karmaValues.push(playerData.Data[i].Karma);
                karmaTimeStamps.push(Math.round((Date.now()/1000 - parseInt(playerData.Data[i].Time))/60/60));         
            }
        }
    }
    var moneyLineChart = new Chart(moneyChart, {
        type:"line",
        data: {
            labels: moneyTimeStamps,
            datasets:[{
                label: 'Money',
                data:moneyValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            elements: {
              point:{
                radius: 2
              }
            },
            responsive: true,
            scales: {
              x: {
                  title: {
                    display: true,
                    text: 'Hours Ago'
                  }
              }
            }
        }
    });
    var karmaLineChart = new Chart(karmaChart, {
        type:"line",
        data: {
            labels: karmaTimeStamps,
            datasets:[{
                label: 'Karma',
                data:karmaValues,
                fill: false,
                borderColor: 'rgb(0, 255, 0)',
                tension: 0.1
            }]
        },
        options: {
            elements: {
              point:{
                radius: 2
              }
            },
            responsive: true,
            scales: {
              x: {
                  title: {
                    display: true,
                    text: 'Hours Ago'
                  }
              }
            }
        }
    });
    moneyLineChart.canvas.parentNode.style.height = '360px';
    moneyLineChart.canvas.parentNode.style.width = '720px';
    karmaLineChart.canvas.parentNode.style.height = '360px';
    karmaLineChart.canvas.parentNode.style.width = '720px';


}

