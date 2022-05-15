const Responses = {
  Success: 0,
  InvalidUser: 1,
  NoData: 2,
}
var playerData = null;



(async () => {
    chartData = await fetch("https://opensup.insert-name.repl.co/api/top/players/").then(data => data.json());
    if(document.readyState && chartData.Response == Responses.Success) {
        instantiateCharts();   
    }
    else {
      window.location.reload(); // Retry, change to an error page later
      return;
    }
})()

function instantiateCharts() {
    var moneyDataSets = [];
    var moneyTimeStamps = [];
    var moneyChart = document.getElementById("money-track").getContext('2d');
    var karmaChart = document.getElementById("karma-track").getContext('2d');
    playerData = chartData.Data;
      for(var i = 0; i < playerData.length; i++) {
          moneyValues = playerData[i].Data;
          moneyDataSets[i] = {
                label: playerData[i].Name,
                data:moneyValues,
                fill: false,
                borderColor: getRandomColor(),
                tension: 0
          }
      }
      for(var i = 0; i < playerData[0].Data.length; i ++) {
        moneyTimeStamps.push(Math.round((Date.now()/1000 - parseInt(chartData.TimeStamps[i]))/60/60));
      }

    var moneyLineChart = new Chart(moneyChart, {
        type:"line",
        data: {
            labels: moneyTimeStamps,
            datasets:moneyDataSets
        },
        options: {
            plugins: {
              legend: {
                   display: false
                  },
              tooltip: {
                callbacks: {
                  title: function(context) {
                    return context[0].label + ' Hour(s) Ago';
                  }
                }
              },
              decimation: {
                enabled: true,
                algorithm: 'lttb',
                samples: 50,
              },
            },
            elements: {
              point:{
                radius: 5
              }
            },
            //responsive: true,
            scales: {
              x: {
                  title: {
                    display: true,
                    text: 'Hours Ago'
                  }
              },
              y: {
                  type: 'linear',
                  beginAtZero: false,
                  grace: '0%',
                  title: {
                    display: true,
                    text: 'Money'
                  }
              }
            }
        }
    });

}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}