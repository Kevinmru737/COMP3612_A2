function $(selector) {return document.querySelector(selector)}

//Constants
const NUM_SEASONS = 4;
const F1_DOMAIN = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/"
const RACES = "races.php?season="
const RESULT ="results.php?season="
const QUAL = "qualifying.php?season="
//insert JS code here!
document.addEventListener("DOMContentLoaded", () => {
    //things that should happen when the website boots the first time
    initHomePage();
    popLogo();

    $("#homeButton").addEventListener("click", () => {
        if(!($("#raceView").classList.contains("hidden"))) {
            $("#raceView").classList.toggle("hidden");
            if(!$("#raceDetails").classList.contains("hidden")) {
                $("#raceDetails").classList.toggle("hidden");
            }
            $("#homeLeft select").value = "Select a season...";
        }
        popHomePage();
    });


})
/*
*   initHomePage - Upon first launching the website, the webpage is initialized once
*                  and subsequent calls to return home just affect the "hidden" class
*
*/
function initHomePage() {
    $("#home").classList.toggle("hidden");
    //leftside
    let h1 = document.createElement("h1");
    h1.textContent = "Welcome to F1";
    h1.className = "flex  text-xl justify-center";
    $("#homeLeft").appendChild(h1);

    let form = document.createElement("form");
    form.setAttribute("method", 0);
    form.setAttribute("action", 0);
    form.className = "flex justify-center mt-6";
    let select = document.createElement("select");
    select.setAttribute("name", 0);
    select.className = "w-1/2 p-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    form.appendChild(select);
    let option = document.createElement("option");
    option.textContent = "Select a season...";
    select.appendChild(option);

    //as soon as the user selects a year, it gets the race data
    select.addEventListener("input", (e) => {
        if(e.target.value == "Select a season...") {
            return;
        }
        getRaces(e.target.value);
        
    });
    for(let i = 0; i < NUM_SEASONS; i++) {
        let option = document.createElement("option");
        option.textContent = "202" + i;
        option.setAttribute("value", "202" + i);
        
        select.appendChild(option);
    }
    $("#homeLeft").appendChild(form);

    //rightside
    let img = document.createElement("img");
    img.setAttribute("src", "../src/images/homepagef1.jpg");
    let figure = document.createElement("figure");
    img.className = "object-cover";
    $("#homeRight").appendChild(figure);
    figure.appendChild(img);
}

/*
*   popHomePage - makes the already initialized homepage visible
*
*/
function popHomePage() {
    if($("#home").classList.toggle("hidden")) {
        $("#home").classList.toggle("hidden");
    }
    
}

function popLogo() {
    let logo = document.createElement("img");
    logo.setAttribute("src", "../src/images/f1logo.svg");
    logo.style.width = "64px";
    logo.style.height = "64px";

    $("#logo").innerHTML = '';
    $("#logo").appendChild(logo);
}

/*
*   getRaces - Determines if the race data resides in local storage and either fetches it from
*              the corresponding Web API or local storage (local storage is checked first).
*   Details  - "race" + year is used as the key for local storage.
*
*/
function getRaces(year) {
    let storageKey = "race" + year;
    if(localStorage.getItem(storageKey)) {
        $("#home").classList.toggle("hidden");
        $("#raceView").classList.toggle("hidden");
        let raceData = JSON.parse(localStorage.getItem(storageKey));
        popRaces(raceData);
        return;
    }
    const url = F1_DOMAIN + RACES + year;
    console.dir(url);//REMOVE BEFORE SUBMISSION
    fetch(url)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(url + " didn't work");
            }
        })
        .then(races => {
            localStorage.setItem(storageKey, JSON.stringify(races));
            $("#home").classList.toggle("hidden");
            $("#raceView").classList.toggle("hidden");
            popRaces(races);
        })
        .catch(error => {
            console.error("Error:", error);
        })

    return;
}

/*
*   popRaces - takes in an array of race data and populates the HTML document
*
*
*
*/
function popRaces(raceData) {
    $("#races").innerHTML = '';

    raceData.forEach((race) => {
        let raceCard = document.createElement("div");
        raceCard.className = "raceCard flex row justify-start items-center mx-auto bg-gray-800 text-white border-2 border-gray-600 shadow-lg overflow-hidden h-32";
        raceCard.setAttribute("id", race.id);
        $("#races").appendChild(raceCard);

        let cardLeft = document.createElement("div");
        cardLeft.className = "p-4 bg-gray-850";
        raceCard.appendChild(cardLeft);
        let h2 = document.createElement("h2");
        h2.className = "text-xl font-bold";
        h2.textContent = race.name;
        cardLeft.appendChild(h2);
        let p = document.createElement("p");
        p.textContent = race.date;
        cardLeft.appendChild(p);
        raceCard.appendChild(cardLeft);

        let cardMiddle = document.createElement("div");
        cardMiddle.className = "p-2 ";
        let span1 = document.createElement("span");
        span1.className = "font-semibold";
        span1.textContent = race.circuit.name + ', ';
        cardMiddle.appendChild(span1);
        let span2 = document.createElement("span");
        span2.className = "italic";
        span2.textContent = race.circuit.location + ', ' + race.circuit.country;
        cardMiddle.appendChild(span2);
        raceCard.appendChild(cardMiddle);

        let button = document.createElement("button");
        button.className = "bg-gray-900 hover:bg-gray-950 text-white font-semibold rounded px-4 h-12 border-2 border-gray-500 ml-auto mr-4 transition duration-300";
        button.textContent = "Details";
        button.value = race.id;
        button.addEventListener("click", (e) => {
            $("#eventResults").textContent = race.name;
            if($("#raceDetails").classList.contains("hidden")) {
                $("#raceDetails").classList.toggle("hidden");
            }
            getQualResults(e.target.value, race.year);
            getResults(e.target.value, race.year);
        });
        raceCard.appendChild(button);
    })
    //$("#detailClickMessage").textContent = 'Click "Details" to see more information about a race.'
}

/*
*   getQualResults - fetches the corresponding Web API data and calls the appropriate
*                handlers, passing the data after storing it locally
*
*
*/
function getQualResults(id, year) {
    let qualStorageKey = "qual" + year;

    if(localStorage.getItem(qualStorageKey)) {
        let qualResults = JSON.parse(localStorage.getItem(qualStorageKey));
        popQualDetails(qualResults, id);
        return;
    }
    const url1 = F1_DOMAIN + QUAL + year;
    console.dir(url1);//**REMOVE BEFORE SUBMISSION**
    fetch(url1)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(url1 + " didn't work");
            }
        })
        .then(qualResults => {
            localStorage.setItem(qualStorageKey, JSON.stringify(qualResults));
            popQualDetails(qualResults, id);
        })
        .catch(error => {
            console.error("Error:", error);
        })
        return;
}

/*
*   getResults - fetches the corresponding Web API data and calls the appropriate
*                handlers, passing the data after storing it locally
*
*
*/
function getResults(id, year) {
    let resultStorageKey = "result" + year;

    if(localStorage.getItem(resultStorageKey)) {
        let results = JSON.parse(localStorage.getItem(resultStorageKey));
        popResultDetails(results, id);
        return;
    }
    const url1 = F1_DOMAIN + RESULT + year;
    console.dir(url1);//**REMOVE BEFORE SUBMISSION**
    fetch(url1)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(url1 + " didn't work");
            }
        })
        .then(results => {
            localStorage.setItem(resultStorageKey, JSON.stringify(results));
            popResultDetails(results, id);
        })
        .catch(error => {
            console.error("Error:", error);
        })
        return;
}

/*
*   popQualDetails - creates the Qualifying details tables from the corresponding
*                    Web API data
*
*
*/
function popQualDetails(qualData, id) {
    //constants
    const qualResults = $("#qualResults");
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    qualResults.innerHTML = '';

    let h3 = document.createElement("h3");
    h3.className = "text-2xl font-bold mb-4";
    h3.textContent = "Qualifying Results";
    qualResults.appendChild(h3);
    let div = document.createElement("div");
    div.className = "overflow-x-auto";
    qualResults.appendChild(div);

    let table = document.createElement("table");
    table.className = "table-auto w-full border-collapse border border-gray-700 text-sm text-left";
    div.appendChild(table);

    //creating table header row
    let thead = document.createElement("thead");
    thead.className = "bg-gray-700 text-white";
    table.appendChild(thead);

    let tr1 = document.createElement("tr");
    thead.appendChild(tr1);

    let th1 = document.createElement("th");
    th1.className = TABLE_STYLE;
    th1.textContent = "Position";
    tr1.appendChild(th1);
    let th2 = document.createElement("th");
    th2.className = TABLE_STYLE;
    th2.textContent = "Driver";
    tr1.appendChild(th2);
    let th3 = document.createElement("th");
    th3.className = TABLE_STYLE;
    th3.textContent = "Constructor";
    tr1.appendChild(th3);
    let th4 = document.createElement("th");
    th4.className = TABLE_STYLE;
    th4.textContent = "Q1";
    tr1.appendChild(th4);
    let th5 = document.createElement("th");
    th5.className = TABLE_STYLE;
    th5.textContent = "Q2";
    tr1.appendChild(th5);
    let th6 = document.createElement("th");
    th6.className = TABLE_STYLE;
    th6.textContent = "Q3";
    tr1.appendChild(th6);

    console.dir(qualData);
    //let podiumCounter = 0;
    for(let i = 0; i < qualData.length; i++) {
        if(qualData[i].race.id == id) {
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            let tr2 = document.createElement("tr");
            /* probably not good for qualifying?
            if(podiumCounter == 0) {
                tr2.className = "bg-yellow-500 text-black";
                podiumCounter++;
            } else if(podiumCounter == 1) {
                tr2.className = "bg-slate-500";
                podiumCounter++;
            } else if(podiumCounter == 2) {
                tr2.className = "bg-yellow-800";
                podiumCounter++;
            } */
            tbody.appendChild(tr2);

            let td1 = document.createElement("td");
            td1.className = TABLE_STYLE;
            td1.textContent = qualData[i].position;
            tr2.appendChild(td1);
            let td2 = document.createElement("td");
            td2.className = TABLE_STYLE;
            td2.textContent = qualData[i].driver.forename + ' ' + qualData[i].driver.surname;
            tr2.appendChild(td2);
            let td3 = document.createElement("td");
            td3.className = TABLE_STYLE;
            td3.textContent = qualData[i].constructor.name;
            tr2.appendChild(td3);
            let td4 = document.createElement("td");
            td4.className = TABLE_STYLE;
            td4.textContent = qualData[i].q1;
            tr2.appendChild(td4);
            let td5 = document.createElement("td");
            td5.className = TABLE_STYLE;
            td5.textContent = qualData[i].q2;
            tr2.appendChild(td5);
            let td6 = document.createElement("td");
            td6.className = TABLE_STYLE;
            td6.textContent = qualData[i].q3;
            tr2.appendChild(td6);
        }
    }
}

function popResultDetails(resultData, id) {
    //constants
    const raceResults = $("#raceResults");
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    raceResults.innerHTML = '';

    let h3 = document.createElement("h3");
    h3.className = "text-2xl font-bold mb-4";
    h3.textContent = "Race Results";
    raceResults.appendChild(h3);
    let div = document.createElement("div");
    div.className = "overflow-x-auto";
    raceResults.appendChild(div);

    let table = document.createElement("table");
    table.className = "table-auto w-full border-collapse border border-gray-700 text-sm text-left";
    div.appendChild(table);

    //creating table header row
    let thead = document.createElement("thead");
    thead.className = "bg-gray-700 text-white";
    table.appendChild(thead);

    let tr1 = document.createElement("tr");
    thead.appendChild(tr1);

    let th1 = document.createElement("th");
    th1.className = TABLE_STYLE;
    th1.textContent = "Position";
    tr1.appendChild(th1);
    let th2 = document.createElement("th");
    th2.className = TABLE_STYLE;
    th2.textContent = "Driver";
    tr1.appendChild(th2);
    let th3 = document.createElement("th");
    th3.className = TABLE_STYLE;
    th3.textContent = "Constructor";
    tr1.appendChild(th3);
    let th4 = document.createElement("th");
    th4.className = TABLE_STYLE;
    th4.textContent = "Laps";
    tr1.appendChild(th4);
    let th5 = document.createElement("th");
    th5.className = TABLE_STYLE;
    th5.textContent = "Points";
    tr1.appendChild(th5);

    console.dir(resultData);
    let podiumCounter = 0;
    for(let i = 0; i < resultData.length; i++) {
        if(resultData[i].race.id == id) {
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            let tr2 = document.createElement("tr");
            if(podiumCounter == 0) {
                tr2.className = "bg-yellow-500 text-black";
                podiumCounter++;
            } else if(podiumCounter == 1) {
                tr2.className = "bg-slate-500";
                podiumCounter++;
            } else if(podiumCounter == 2) {
                tr2.className = "bg-yellow-800";
                podiumCounter++;
            } 
            tbody.appendChild(tr2);

            let td1 = document.createElement("td");
            td1.className = TABLE_STYLE;
            td1.textContent = resultData[i].position;
            tr2.appendChild(td1);
            let td2 = document.createElement("td");
            td2.className = TABLE_STYLE;
            td2.textContent = resultData[i].driver.forename + ' ' + resultData[i].driver.surname;
            tr2.appendChild(td2);
            let td3 = document.createElement("td");
            td3.className = TABLE_STYLE;
            td3.textContent = resultData[i].constructor.name;
            tr2.appendChild(td3);
            let td4 = document.createElement("td");
            td4.className = TABLE_STYLE;
            td4.textContent = resultData[i].laps;
            tr2.appendChild(td4)
            let td5 = document.createElement("td");
            td5.className = TABLE_STYLE;
            td5.textContent = resultData[i].points;
            tr2.appendChild(td5);
        }
    }


}