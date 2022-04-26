
document.addEventListener("DOMContentLoaded", function() {

});
function isValidSteam() {
    if(/^[0-9]+$/.test(document.getElementById("steamID").value)) {
        return true;
    } else {
        document.getElementById("steamID").style.backgroundColor = "#B71C1C";
        return false;
    }
}