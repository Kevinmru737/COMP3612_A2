function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

//Constants
const NUM_SEASONS = 4;
const FAV_STORAGE_KEY = "MyFavourites";
const INTRO_MESSAGE = "Stay up to speed with the latest Formula 1 action—your ultimate hub for real-time race results, constructor standings, and circuit details, all in one place."

//Web API URL components
const F1_DOMAIN = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/";
const RACES = "races.php?season=";
const RESULT ="results.php?season=";
const QUAL = "qualifying.php?season=";
const CONSTRUCTOR_ID = "constructors.php?id=";
const CONSTR_RACE_RESULTS1 = "constructorResults.php?constructor=";
const CONSTR_RACE_RESULTS2 = "&season=";
const DRIVER_ID = "drivers.php?id=";
const DRIVER_RACE_RESULTS1 = "driverResults.php?driver=";
const DRIVER_RACE_RESULTS2 = "&season=";
const CIRCUIT_ID = "/circuits.php?id="

document.addEventListener("DOMContentLoaded", () => {
    //things that should happen when the website boots the first time
    initHomePage();
    popLogo();
    initFavoriteBox();    

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

    $("#favoriteButton").addEventListener("click", () => {
        $("#favorites-dialog").showModal();
    });   

    $("#clear-favorites").addEventListener("click", () => {
        clearFavorites();
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
    let h4 = document.createElement("h4");
    h4.textContent = "Welcome to F1";
    h4.className = "mb-6 flex font-bold italic text-4xl justify-center";
    $("#homeLeft").appendChild(h4);
    let h1 = document.createElement("h1");
    h1.textContent = INTRO_MESSAGE;
    h1.className = "flex mr-4 ml-4 text-xl justify-center";
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
    img.setAttribute("src", "src/images/homepagef1.jpg");
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
    logo.setAttribute("src", "src/images/f1logo.svg");
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
    let h1 = document.createElement("h1");
    h1.textContent = "Click on a circuit to see more information.";
    h1.className = "p-4 font-bold text-l italic text-slate-200";
    $("#races").appendChild(h1);
    let ul = document.createElement("ul");
    $("#races").appendChild(ul);

    

    raceData.forEach((race) => {
        let raceCard = document.createElement("li");
        raceCard.className = "raceCard flex row justify-start items-center mx-auto bg-gray-800 text-white border-2 border-gray-600 shadow-lg h-32";
        raceCard.setAttribute("id", race.id);
        ul.appendChild(raceCard);

        let cardLeft = document.createElement("div");
        cardLeft.className = "p-4 bg-gray-850";
        raceCard.appendChild(cardLeft);
        let h2 = document.createElement("h2");
        h2.className = "text-xl font-bold";
        h2.textContent = race.name;
        cardLeft.appendChild(h2);
        let p1 = document.createElement("p1");
        p1.textContent = "Round " + race.round;
        cardLeft.appendChild(p1);
        let p = document.createElement("p");
        p.textContent = race.date;
        cardLeft.appendChild(p);
        raceCard.appendChild(cardLeft);

        let cardMiddle = document.createElement("div");
        cardMiddle.className = "p-2 ";
        let h3 = document.createElement("h3");
        h3.className = "font-bold text-xl";
        h3.textContent = "Circuit";
        cardMiddle.appendChild(h3);

        let span1 = document.createElement("span");
        span1.className = "font-semibold";
        //span1.textContent = race.circuit.name + ', ';
        cardMiddle.appendChild(span1);

        //added link for event listener
        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("id", race.circuit.id);
        a.textContent = race.circuit.name + ", ";
        span1.appendChild(a);
        a.className = "hover:text-red-500 transition duration-300";
        a.addEventListener("click", (e) => {
            $("#circuit-dialog").showModal();
            popCircuitBox(e.target.id, race.year);
        })

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
    $("#detailClickMessage").className = "p-4 font-bold text-l italic text-slate-700";
    $("#detailClickMessage").textContent = 'Click "Details" to see more information about a race.';
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
        popQualDetails(qualResults, id, false);
        return;
    }
    const url1 = F1_DOMAIN + QUAL + year;
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
            popQualDetails(qualResults, id, false);
        })
        .catch(error => {
            console.error("Error:", error);
        })
        return;
}

/*
*   getResults - fetches the corresponding Web API data and calls the appropriate
*                handlers, passing the data after storing it locally. Or returns local data.
*
*
*/
function getResults(id, year) {
    let resultStorageKey = "result" + year;

    if(localStorage.getItem(resultStorageKey)) {
        let results = JSON.parse(localStorage.getItem(resultStorageKey));
        popResultDetails(results, id, false);
        return;
    }
    const url1 = F1_DOMAIN + RESULT + year;
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
            popResultDetails(results, id, false);
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
function popQualDetails(qualData, id, select) {
    //constants
    const qualResults = $("#qualResults");
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    qualResults.innerHTML = '';
    qualResults.setAttribute("data-value", qualData[0].race.id);
    $("#detailClickMessage").classList.add("hidden");

    let h3 = document.createElement("h3");
    h3.className = "text-2xl font-bold mb-4";
    h3.textContent = "Qualifying Results";
    qualResults.appendChild(h3);
    let p = document.createElement("p");
    p.textContent = "Click on a Driver or Constructor for more details.";
    qualResults.appendChild(p);
    let div = document.createElement("div");
    div.className = "overflow-x-auto";
    qualResults.appendChild(div);

    let table = document.createElement("table");
    table.className = "w-full border-collapse border border-gray-700 text-sm text-left";
    div.appendChild(table);

    createQualTableHeader(table, select);

    let sortData = qualData.filter((data) => data.race.id == id);

    addSortEvents("qualResults", sortData);


    for(let i = 0; i < qualData.length; i++) {
        if(qualData[i].race.id == id) {
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            let tr2 = document.createElement("tr");
            tbody.appendChild(tr2);

            let td1 = document.createElement("td");
            td1.className = TABLE_STYLE;
            td1.textContent = qualData[i].position;
            tr2.appendChild(td1);
            let td2 = document.createElement("td");
            td2.className = TABLE_STYLE;
            //td2.textContent = qualData[i].driver.forename + ' ' + qualData[i].driver.surname;
            tr2.appendChild(td2);

            //added link for driver box event listener
            let a2 = document.createElement("a");
            a2.setAttribute("href", "#");
            a2.setAttribute("id", qualData[i].driver.id);
            a2.textContent = qualData[i].driver.forename + ' ' + qualData[i].driver.surname;
            td2.appendChild(a2);
            a2.className = "hover:text-red-500 transition duration-300";
            a2.addEventListener("click", (e) => {
                $("#driver-dialog").showModal();
                popDriverBox(e.target.id, qualData[i].race.year);
            })

            let td3 = document.createElement("td");
            td3.className = TABLE_STYLE;

            //added link for constructor box event listener
            let a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("id", qualData[i].constructor.id);
            a.textContent = qualData[i].constructor.name;
            td3.appendChild(a);
            a.className = "hover:text-red-500 transition duration-300";
            a.addEventListener("click", (e) => {
                $("#constructor-dialog").showModal();
                popConstructorBox(e.target.id, qualData[i].race.year);
            })
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

/*
*   popQualDetails - creates the result details tables from the corresponding
*                    Web API data
*
*
*/
function popResultDetails(resultData, id, select) {
    //constants
    const raceResults = $("#raceResults");
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    raceResults.innerHTML = '';
    raceResults.setAttribute("data-value", resultData[0].race.id);
    $("#detailClickMessage").classList.add("hidden");

    let h3 = document.createElement("h3");
    h3.className = "text-2xl font-bold mb-4";
    h3.textContent = "Race Results";
    raceResults.appendChild(h3);
    let p = document.createElement("p");
    p.textContent = "Click on a Driver or Constructor for more details.";
    raceResults.appendChild(p);
    let div = document.createElement("div");
    div.className = "overflow-x-auto";
    raceResults.appendChild(div);

    let table = document.createElement("table");
    table.className = "table-auto w-full border-collapse border border-gray-700 text-sm text-left";
    div.appendChild(table);

    createResultTableHeader(table, select);

    let sortData = resultData.filter((data) => data.race.id == id);

    addSortEvents("raceResults", sortData);

    let podiumCounter = 0;
    if (select == "Position") {
        podiumCounter = 3;
    }
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
            tr2.appendChild(td2);

            //added link for driver box event listener
            let a2 = document.createElement("a");
            a2.setAttribute("href", "#");
            a2.setAttribute("id", resultData[i].driver.id);
            a2.textContent = resultData[i].driver.forename + ' ' + resultData[i].driver.surname;
            td2.appendChild(a2);
            a2.className = "hover:text-red-500 transition duration-300";
            a2.addEventListener("click", (e) => {
                $("#driver-dialog").showModal();
                popDriverBox(e.target.id, resultData[i].race.year);
            })

            let td3 = document.createElement("td");
            td3.className = TABLE_STYLE;
            tr2.appendChild(td3);

            //added link for event listener
            let a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("id", resultData[i].constructor.id);
            a.textContent = resultData[i].constructor.name;
            td3.appendChild(a);
            a.className = "hover:text-red-500 transition duration-300";
            a.addEventListener("click", (e) => {
                $("#constructor-dialog").showModal();
                popConstructorBox(e.target.id, resultData[i].race.year);
            })

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

/*
*   addSortEvents - id is the string "qualResults" or "raceResults" used to assign
*                   the corrsponding event listeners
*                 - data contains an array of just the results needed
*
*
*/
function addSortEvents(idName, data) {
    const tableHeaders = $$(`#${idName} th`);

    // Add event listeners for mouseover and mouseout
    tableHeaders.forEach((th) => {
        // Handle click event
        th.addEventListener("click", () => {
            if (!th.classList.contains("bg-blue-700")) {
                th.classList.remove("bg-blue-500");
                tableHeaders.forEach(th => th.classList.remove("bg-blue-700"));
                th.classList.toggle("bg-blue-700");
            } else {
                tableHeaders.forEach(th => th.classList.remove("bg-blue-700"));
            }
            
            //only sortPosition is implemented
            switch(th.textContent) {
                case "Position":
                    sortPosition(idName, data);
                    break;
                case "Driver":
                    sortDriver(idName, data);
                    break;
                case "Constructor":
                    sortConstructor(idName, data);
                    break;
                case "Q1":
                    sortTime(idName, data);
                    break;
                case "Q2":
                    sortTime(idName, data);
                    break;
                case "Q3":
                    sortTime(idName, data);
                    break;
                case "Laps":
                    sortLaps(idName, data);
                    break;
                case "Points":
                    sortPoints(idName, data);
                break;
            }
        });
  
        // Handle hover events
        th.addEventListener("mouseover", () => {
            if (!th.classList.contains("bg-blue-700")) {
                // Only apply hover color if not clicked
                th.classList.add("bg-blue-500");
            }
        });
  
        th.addEventListener("mouseout", () => {
            if (!th.classList.contains("bg-blue-700")) {
                // Only remove hover color if not clicked
                th.classList.remove("bg-blue-500");
            }
        });
      });
}

/*
*   sortPosition - Takes in the string "qualResults" or "raceResults" which is the id for the div that displays
*                  the corresponding results
*
*   Details      - sortPosition will sort by ascending order (which is opposite the default result population).
*                  upon subsequent calls it will do descending order, and back to ascending etc...
*                - Uses bubblesort algorithm 
*
*/
function sortPosition(raceType, data) {
    let toModify = $("#qualPosition");
    if(raceType == "qualResults") {
        toModify = $("#qualPosition");
    } else if (raceType == "raceResults") {
        toModify = $("#resultPosition");
    }
    
    let isSelected = "bg-blue-700"; //this style indicates to sort the default way

    //using bubble sort
    if(!(toModify.classList.contains(isSelected))) {
        for(let j = 0; j < data.length - 1; j++) {
            for(let i = 0; i < data.length - 1; i++) {
                if(data[i].position > data[i + 1].position) {
                    let temp = data[i];
                    data[i] = data[i + 1];
                    data[i + 1] = temp;
                }
            }
        }
    } else {
        for(let j = 0; j < data.length - 1; j++) {
            for(let i = 0; i < data.length - 1; i++) {
                if(data[i].position < data[i + 1].position) {
                    let temp = data[i];
                    data[i] = data[i + 1];
                    data[i + 1] = temp;
                }
            }
        }
    }
    //if our header contains "isSelected" we want to remake it the next time without it selected
    if(raceType == "qualResults" && toModify.classList.contains(isSelected)) {
        popQualDetails(data, data[0].race.id, "Position");
    } else if (raceType == "qualResults" && !(toModify.classList.contains(isSelected))) {
        popQualDetails(data, data[0].race.id, false);
    }

    if(raceType == "raceResults" && toModify.classList.contains(isSelected)) {
        popResultDetails(data, data[0].race.id, "Position");
    } else if (raceType == "raceResults" && !(toModify.classList.contains(isSelected))) {
        popResultDetails(data, data[0].race.id, "NoPodium");
    }

}

/*  UNFINISHED - function stubs
*   
*   Intended functionality - The below sorting functions were created with the idea to sort
*                            qualifying and race results by their headers in differing ways.
*
*
*
*/
function sortDriver(raceType) {
    
}

function sortConstructor(raceType) {
    
}

function sortTime() {
    
}

function sortLaps(raceType, data) {

}

function sortPoints(raceType, data) {

}


/*
*   createQuaLTableHeader - Creates a table header for showing qualifying results
*
*   table   - is the table created in popResultDetails, 
*   select  - is the header that should be selected.
*
*   Details - This function circumnavigates some problems that were coming up from
*             CSS styles disappearing upon selection/reloading.
*
*
*/
function createQualTableHeader(table, select) {
    const isSelected = "bg-blue-700";
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    let thead = document.createElement("thead");
    thead.className = "bg-gray-700 text-white";
    table.appendChild(thead);

    let tr1 = document.createElement("tr");
    thead.appendChild(tr1);

    let th1 = document.createElement("th");
    th1.className = TABLE_STYLE;
    th1.textContent = "Position";
    th1.id = "qualPosition";
    let th2 = document.createElement("th");
    th2.className = TABLE_STYLE;
    th2.textContent = "Driver";
    th2.id = "qualDriver";
    let th3 = document.createElement("th");
    th3.className = TABLE_STYLE;
    th3.textContent = "Constructor";
    th3.id = "qualCsontructor";
    let th4 = document.createElement("th");
    th4.className = TABLE_STYLE;
    th4.textContent = "Q1";
    th4.id = "qualQ1";
    let th5 = document.createElement("th");
    th5.className = TABLE_STYLE;
    th5.textContent = "Q2";
    th5.id = "qualQ2";
    let th6 = document.createElement("th");
    th6.className = TABLE_STYLE;
    th6.textContent = "Q3";
    th6.id = "qualQ3";

    switch(select) {
        case "Position":
            th1.classList.add(isSelected);
            break;
        case "Driver":
            th2.classList.add(isSelected);
            break;
        case "Constructor":
            th3.classList.add(isSelected);
            break;
        case "Q1":
            th4.classList.add(isSelected);
            break;
        case "Q2":
            th5.classList.add(isSelected);
            break;
        case "Q3":
            th6.classList.add(isSelected);
            break;
    }

    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);
    tr1.appendChild(th4);
    tr1.appendChild(th5);
    tr1.appendChild(th6);
}

/*
*   createResultTableHeader - Creates a table header for showing race results
*
*   table   - is the table created in popResultDetails, 
*   select  - is the header that should be selected.
*
*   Details - This function circumnavigates some problems that were coming up from
*             CSS styles disappearing upon selection/reloading.
*
*/
function createResultTableHeader(table, select) {
    const isSelected = "bg-blue-700";
    const TABLE_STYLE = "border border-gray-600 px-4 py-2 h-14";
    //creating table header row
    let thead = document.createElement("thead");
    thead.className = "bg-gray-700 text-white";
    table.appendChild(thead);

    let tr1 = document.createElement("tr");
    thead.appendChild(tr1);

    let th1 = document.createElement("th");
    th1.className = TABLE_STYLE;
    th1.textContent = "Position";
    th1.id = "resultPosition";

    let th2 = document.createElement("th");
    th2.className = TABLE_STYLE;
    th2.textContent = "Driver";
    th2.id = "resultDriver";

    let th3 = document.createElement("th");
    th3.className = TABLE_STYLE;
    th3.textContent = "Constructor";
    th3.id = "resultConstructor";
    let th4 = document.createElement("th");
    th4.className = TABLE_STYLE;
    th4.textContent = "Laps";
    th4.id = "resultLaps";
    let th5 = document.createElement("th");
    th5.className = TABLE_STYLE;
    th5.textContent = "Points";
    th5.id = "resultPoints";

    switch(select) {
        case "Position":
            th1.classList.add(isSelected);
            break;
        case "Driver":
            th2.classList.add(isSelected);
            break;
        case "Constructor":
            th3.classList.add(isSelected);
            break;
        case "Laps":
            th4.classList.add(isSelected);
            break;
        case "Points":
            th5.classList.add(isSelected);
            break;
    }

    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);
    tr1.appendChild(th4);
    tr1.appendChild(th5);
}
/*
*   popConstructorBox - populates a pop up box with the selected constructors information/race results
*
*
*/
function popConstructorBox(id, year) {
    const constructorDetails = $("#constructor-details");
    const constructorUrl = F1_DOMAIN + CONSTRUCTOR_ID + id;
    let constructorRaceResultsUrl = F1_DOMAIN + CONSTR_RACE_RESULTS1;

    $("#close-constructor-dialog").addEventListener("click", () => {
        $("#constructor-dialog").close();
    })

    fetch(constructorUrl)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(constructorUrl + " didn't work");
            }
        })
        .then(constructor => {
            $("#constructor-name").textContent = constructor.name;
            $("#constructor-nationality").textContent = constructor.nationality;
            $("#constructor-url").setAttribute("href", constructor.url);
            constructorRaceResultsUrl += constructor.constructorRef;
            constructorRaceResultsUrl += CONSTR_RACE_RESULTS2 + year;
            const constructorRaceResults = $("#constructor-race-results");

            $("#add-favorite-constructor").addEventListener("click", () => {
                addFavConstructor(constructor.name);
            })

            //removes every li item except the header, which is not populated via JS
            constructorRaceResults.querySelectorAll("li:not(:first-child").forEach(li => li.remove());

            fetch(constructorRaceResultsUrl)
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error(constructorRaceResultsUrl + " didn't work");
                    }
                })
                .then(results => {
                    
                    results.forEach((result) => {
                        let li = document.createElement("li");
                        li.className = "flex justify-between py-2 px-4";
                        constructorRaceResults.appendChild(li);
                        let span1 = document.createElement("span");
                        span1.textContent = result.round;
                        li.appendChild(span1);
                        let span2 = document.createElement("span");
                        span2.textContent = result.name;
                        li.appendChild(span2);
                        let span3 = document.createElement("span");
                        span3.textContent = result.forename + ' ' + result.surname;
                        li.appendChild(span3);
                        let span4 = document.createElement("span");
                        span4.textContent = result.positionOrder;
                        li.appendChild(span4);
                    })
                })
                .catch(error => {
                    console.error("Error:", error);
                })
                })
        .catch(error => {
            console.error("Error:", error);
        })
    
}

/*
*   popDriverBox - populates a pop up box with the selected driver information/race results
*
*
*/
function popDriverBox(id, year) {
    const driverDetails = $("#driver-details");
    const driverUrl = F1_DOMAIN + DRIVER_ID + id;
    let driverRaceResultsUrl = F1_DOMAIN + DRIVER_RACE_RESULTS1;

    $("#close-driver-dialog").addEventListener("click", () => {
        $("#driver-dialog").close();
    })

    fetch(driverUrl)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(driverUrl + " didn't work");
            }
        })
        .then(driver => {
            let driverName = driver.forename + ' ' + driver.surname;
            $("#driver-name").textContent = driverName;
            $("#driver-nationality").textContent = driver.nationality;
            $("#driver-dob").textContent = driver.dob;
            $("#driver-url").setAttribute("href", driver.url);
            driverRaceResultsUrl += driver.driverRef;
            driverRaceResultsUrl += DRIVER_RACE_RESULTS2 + year;
            const driverRaceResults = $("#driver-race-results");

            $("#add-favorite-driver").addEventListener("click", () => {
                addFavDriver(driverName);
            })

            //removes every li item except the header, which is not populated via JS
            driverRaceResults.querySelectorAll("li:not(:first-child").forEach(li => li.remove());

            fetch(driverRaceResultsUrl)
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error(driverRaceResultsUrl + " didn't work");
                    }
                })
                .then(results => {
                    results.forEach((result) => {
                        let li = document.createElement("li");
                        li.className = "flex justify-between py-2 px-4";
                        driverRaceResults.appendChild(li);
                        let span1 = document.createElement("span");
                        span1.textContent = result.round;
                        li.appendChild(span1);
                        let span2 = document.createElement("span");
                        span2.textContent = result.name;
                        li.appendChild(span2);
                        let span3 = document.createElement("span");
                        span3.textContent = result.positionOrder;
                        li.appendChild(span3);
                        let span4 = document.createElement("span");
                        span4.textContent = result.grid;
                        li.appendChild(span4);
                    })
                })
                .catch(error => {
                    console.error("Error:", error);
                })
        })
        .catch(error => {
            console.error("Error:", error);
        })
        
        //adds driver image which is currently speedy gonzales
        $("#driver-picture").innerHTML = '';
        $("#driver-picture").className = "flex justify-center items-center mt-4"
        let img = document.createElement("img")
        img.className = "h-24 w-18 flex items-center";
        img.setAttribute("src", "src/images/Speedy_Gonzales.png");
        $("#driver-picture").appendChild(img)
}

/*
*   popCircuitBox - Populates the additional information box about a selected circuit
*
*
*/
function popCircuitBox(id, year) {
    const circuitDetails = $("#circuit-details");
    const circuitUrl = F1_DOMAIN + CIRCUIT_ID + id;

    $("#close-circuit-dialog").addEventListener("click", () => {
        $("#circuit-dialog").close();
    })

    fetch(circuitUrl)
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            } else {
                throw new Error(driverUrl + " didn't work");
            }
        })
        .then(circuit => {
            $("#circuit-name").textContent = circuit.name;
            $("#circuit-location").textContent = circuit.location;
            $("#circuit-country").textContent = circuit.country;
            $("#circuit-url").setAttribute("href", circuit.url);

            $("#add-favorite-circuit").addEventListener("click", () => {
                addFavCircuit(circuit.name);
            })
        })
        .catch(error => {
            console.error("Error:", error);
        })

    $("#circuit-picture").setAttribute("src", "src/images/circuit.jpg");


}

/*
*   initFavoriteBox - Populates the favorite box with locally stored data, if it exists,
*                    otherwise it creates an empty array to store favorites data.
*
*/
function initFavoriteBox() {

    //making a locally stored favorites struct if it doesn't already exist
    if(!(localStorage.getItem(FAV_STORAGE_KEY))) {
        let favorites = {
            drivers: [],
            constructors: [],
            circuits: []
        }
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
    } else {
        favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY));
        if (favorites.drivers.length != 0) {
            favorites.drivers.forEach((driver) => {
                let li = document.createElement("li");
                li.textContent = driver;
                $("#driver-favorites").appendChild(li);
            })
        }
        if (favorites.constructors.length != 0) {
            favorites.constructors.forEach((constructor) => {
                let li = document.createElement("li");
                li.textContent = constructor;
                $("#constructor-favorites").appendChild(li);
            })
        }
        if (favorites.circuits.length != 0) {
            favorites.circuits.forEach((circuit) => {
                let li = document.createElement("li");
                li.textContent = circuit;
                $("#circuit-favorites").appendChild(li);
            })
        }
        
    }
    
    $("#close-favorites-dialog").addEventListener("click", () => {
        $("#favorites-dialog").close();
    })
}
/*
*   addFavDriver - Adds a driver to the favorites list
*
*   driver - Takes in a name as a paramter 
*/
function addFavDriver(driver) {
    let favorites;

    if(localStorage.getItem(FAV_STORAGE_KEY)) {
        favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY));
    } else {
        return;
    }
    if(!(favorites.drivers.find((driverName) => driverName == driver))) {
        favorites.drivers.push(driver);
        let li = document.createElement("li");
        li.textContent = driver;
        $("#driver-favorites").appendChild(li);
        //adding a heart icon, doing it here since this only happens once even if the button is pressed a lot
        let img = document.createElement("img");
        img.setAttribute("src", "src/images/heart.png");
        img.className = "h-4 w-4";
        $("#driver-name").appendChild(img);
        
    }
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
}

/*
*   addFavConstructor - Adds a constructor to the favorites list
*
*   constructor - Takes in a name as a paramter 
*/
function addFavConstructor(constructor) {
    let favorites;
    if(localStorage.getItem(FAV_STORAGE_KEY)) {
        favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY));
    } else {
        return;
    }
    if(!(favorites.constructors.find((constructorName) => constructorName == constructor))) {
        favorites.constructors.push(constructor);
        let li = document.createElement("li");
        li.textContent = constructor;
        $("#constructor-favorites").appendChild(li);

        //adding a heart icon, doing it here since this only happens once even if the button is pressed a lot
        let img = document.createElement("img");
        img.setAttribute("src", "src/images/heart.png");
        img.className = "h-4 w-4";
        $("#constructor-name").appendChild(img);
        
    }
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
}

/*
*   addFavCircuit - Adds a circuit to the favorites list
*
*   circuit - Takes in a name as a paramter 
*/
function addFavCircuit(circuit) {
    let favorites;
    if(localStorage.getItem(FAV_STORAGE_KEY)) {
        favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY));
    } else {
        return;
    }
    if(!(favorites.circuits.find((circuitName) => circuitName == circuit))) {
        favorites.circuits.push(circuit);
        let li = document.createElement("li");
        li.textContent = circuit;
        $("#circuit-favorites").appendChild(li);

        //adding a heart icon, doing it here since this only happens once even if the button is pressed a lot
        let img = document.createElement("img");
        img.setAttribute("src", "src/images/heart.png");
        img.className = "h-4 w-4";
        $("#circuit-name").appendChild(img);
        
    }
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
}

/*
*   clearFavorites - clears favorites, replaces the local data with an empty data set,
*                    as well as clears the favorites display box.
*
*/
function clearFavorites() {
    let favorites = {
        drivers: [],
        constructors: [],
        circuits: []
    }
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
    $("#driver-favorites").innerHTML = '';
    $("#constructor-favorites").innerHTML = '';
    $("#circuit-favorites").innerHTML = '';
}