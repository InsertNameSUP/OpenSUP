
document.addEventListener("DOMContentLoaded", function() {

});
function isValidSteam() {
    if(/^[0-9]+$/.test(document.getElementById("steamID").value)) {
        return true;
    } else if(/^STEAM_[0-5]:[01]:\d+$/.test(document.getElementById("steamID").value)) {
      document.getElementById("steamID").value = steam.SteamIDTo64(document.getElementById("steamID").value);
      return true;
    } else {
        document.getElementById("steamID").style.backgroundColor = "#B71C1C";
        return false;
    }
}
function TestSteamID32() {
  if(/^STEAM_[0-5]:[01]:\d+$/.test(document.getElementById("steamID").value)) {
      document.getElementById("steamID").value = steam.SteamIDTo64(document.getElementById("steamID").value);
    }
}