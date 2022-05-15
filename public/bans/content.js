const urlParams = new URLSearchParams(window.location.search);
var banTablel
var options;
pageNum = parseInt(urlParams.get("p"));
if(pageNum < 1 || isNaN(pageNum)) pageNum = 1;
getOptions();
banPages = [];
banResults = [];
prepBanPages();

window.onload = async function () {
  banTable = document.getElementById("bans-table");
  handleOptions();
  banPages = await Promise.all(banPages);
  for(var p = 0; p < banPages.length; p++) {
    banResults = banResults.concat(banPages[p].Data.data);
  }
  if(options.Servers.DRP && options.Servers.CWRP && options.Servers.MILRP) {
      for(var i = 0; i < 100; i++) {
        banTable.appendChild(createRow(banResults[i]));
      }
  } else {
      numOfEntries = 0;
      for(var i = 0; i < banResults.length; i++) {
        if((banResults[i][2] == "DarkRP & Zombies" && options.Servers.DRP) || (banResults[i][2] == "CWRP" && options.Servers.CWRP) || (banResults[i][2] == "MilRP" && options.Servers.MILRP)) {
          banTable.appendChild(createRow(banResults[i]));
          numOfEntries++;
        }
      }
      if(numOfEntries == 0) {
        errElem = document.createElement("td");
        errElem.innerHTML = `No Results Found :(`;
        errElem.colSpan = "100";
        //errElem.style = `background-color: rgb(2, 119, 189);`
        banTable.appendChild(errElem);
      }
  }

}

function getOptions() {
  options = localStorage.getItem("banOptions");
  if(options == null) {
    options = {
      Servers: {
        DRP: true,
        CWRP: true,
        MILRP: true
      }
    };
  } else {
    options = JSON.parse(options);
  }
  
}
function handleOptions() {
  document.getElementById("drp-checkbox").checked = options.Servers.DRP;
  document.getElementById("cwrp-checkbox").checked = options.Servers.CWRP;
  document.getElementById("milrp-checkbox").checked = options.Servers.MILRP;
  document.getElementById("page-select").value = pageNum;
}


// API Functions
function prepBanPages() {
  banPages = [];
  if(options.Servers.DRP && options.Servers.CWRP && options.Servers.MILRP) {
   banPages.push(fetch("https://opensup.insert-name.repl.co/api/open/bans?draw=1&length=100&start=" + (pageNum*100)).then(data=> data.json()));
  } else {
    for(var i = 0; i < 5; i ++) {
      banPages.push(fetch("https://opensup.insert-name.repl.co/api/open/bans?draw=1&length=100&start=" + ((pageNum * 5 + i)*100)).then(data=> data.json()));
    }
  }
}
// Table Functions

function createRow(banEntry) {
    const tableRow = document.createElement("tr");
    var tableEntries = [];
    for(var i = 0; i < banEntry.length; i++) {
        if(i == 4 || i == 6 || i >= 10) continue;
        newCell = document.createElement("td");
        if(banEntry[9] != "") {newCell.classList.add("appealed-ban");}
        else if(banEntry[10]) {newCell.classList.add("active-ban")}
        newCell.innerHTML = banEntry[i];
        if(i == 1) {
          newCell.innerHTML = util.FormatDate(banEntry[i])
        }
        if(i == 7) {
         newCell.innerHTML = banEntry[i] <= 0 ? 'Permanent' : util.TimeToString(banEntry[i]);
        }
        if(i == 3 || i == 5) { // Link names to profiles
          newCell.innerHTML = `<a href="https://superiorservers.co/profile/${banEntry[i + 1]}"> ${banEntry[i]} </a>`;
        }
        if(i == 9 || i == 8) {newCell.innerHTML = util.Linkify(newCell.innerHTML) }
        tableRow.appendChild(newCell);
    }
    return tableRow;
}


// Page Functions
function changePage(n) {
  pageNum += n;
  if(pageNum < 1) pageNum = 1;
  location.href = "https://opensup.insert-name.repl.co/bans/?p=" + pageNum;
}
function setPage() {
  pageNum = parseInt(document.getElementById("page-select").value);
  if(pageNum < 1) pageNum = 1;
  location.href = "https://opensup.insert-name.repl.co/bans/?p=" + pageNum;
  return false;
}

// Filter Functions
function onServerFilterChange() {
  options.Servers.DRP = document.getElementById("drp-checkbox").checked;
  options.Servers.CWRP = document.getElementById("cwrp-checkbox").checked;
  options.Servers.MILRP = document.getElementById("milrp-checkbox").checked;
  localStorage.setItem("banOptions", JSON.stringify(options));
  //document.location.reload();
}