const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

let maBalise =document.getElementById("MonEntete")
console.log(maBalise)
let baliseMain = document.querySelector("main")
console.log(baliseMain)
let MesBalisesSection = document.querySelectorAll("section")
console.log(MesBalisesSection)