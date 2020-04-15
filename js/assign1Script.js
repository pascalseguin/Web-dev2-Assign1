document.addEventListener("DOMContentLoaded", function() { 
/*Several helper functions that create and return DOM Elements */
function makeInput( type, name, placeholder,id, cl, val) {

    let temp = document.createElement("input");
    temp.setAttribute("type", `${type}`);
    temp.setAttribute("name", `${name}`);
    temp.setAttribute("id", `${id}`);
    temp.setAttribute("placeholder",`${placeholder}`);
    temp.setAttribute("class", `${cl}`);
    temp.setAttribute("value", `${val}`)
    if (type === "range")
    {
        temp.setAttribute("Min", 0);
        temp.setAttribute("Max", 10);
    }
    return temp;
}function makeDiv(id,cl) {
    let temp = document.createElement("div");
    temp.setAttribute("class", `${cl}`);
    temp.setAttribute("id", `${id}`);
    return temp;
}function makeP(id,cl,content){
    let temp = document.createElement("p");
    temp.setAttribute("id", `${id}`);
    temp.setAttribute("class", `${cl}`);
    temp.textContent = content;
    return temp;
}function makeH2(id,cl,content){
    let temp = document.createElement("h2");
    temp.setAttribute("id",`${id}`);
    temp.textContent = content;
    temp.setAttribute("class", `${cl}`);
    return temp;
}function makeLabel(id,cl,content, aFor){
    let temp = document.createElement("label");
    temp.setAttribute("id", `${id}`);
    temp.setAttribute("class", `${cl}`);
    temp.setAttribute("for", `${aFor}`);
    temp.textContent = content;
    return temp;
}function makeButton(id,cl,content,ty){
    let temp = document.createElement("button");
    temp.setAttribute("id", `${id}`);
    temp.setAttribute("class", `${cl}`);
    temp.setAttribute("type",`${ty}`)
    temp.textContent = content;
    return temp;
}function makeMovieImg(sr,sz,al){
    let temp = document.createElement("img");
    temp.setAttribute("src", `${imgUrl}${sz}${sr}`);
    temp.setAttribute("alt",al);
    return temp;
}function makeImg(sr,al){
    let temp = document.createElement("img");
    temp.setAttribute("src", `${sr}`);
    temp.setAttribute("alt",al);
    return temp;}
function makeList(id,cl){
    let temp = document.createElement("ul")
    temp.setAttribute("id",id);
    temp.setAttribute("class",cl);
    return temp;
    }
function makeLink(id,cl,urPt1,urPt2,content){
    let temp = document.createElement("a");
    temp.setAttribute("id",id);
    temp.setAttribute("class",cl);
    temp.setAttribute("href",urPt1 + urPt2);
    temp.innerText = content;
    return temp;
}
function br() { return document.createElement("br")}
/*filters that run on the array which manipulate out based on the parameters provided. */
function runFilter(){
    let found = 0;
    for (let m of movies){
        let temp = document.getElementById(`${m.imdb_id}`);
        let flag = true;
    if (m.release_date.slice(0,4) < filterObj.yearAfter){
        flag = false;
    }
    else if (m.release_date.slice(0,4) > filterObj.yearBefore){
        flag = false;
    }
    else if (m.ratings.average < filterObj.rateAbove || m.ratings.average > filterObj.rateBelow){
        flag = false;
    }
    else if (m.title.toLowerCase().includes(filterObj.searchT)){
        flag = true;
    }
    else {flag = false}
    
    if (flag){temp.style.display = "grid"; found = found + 1;}
    else {temp.style.display = "none";}

    if (found > 0){
        listHeader.textContent = "List/Matches";
        descHeaders.style.display = "grid";
    }
    else {
        listHeader.textContent = "No Matches found for your Search";
        descHeaders.style.display = "none";
    }
}

}
/*Function to bulid the movie node list based on th array provided */
function createMovieList(){
    for (let m of movies){
    
        let tempContainter = makeDiv(m.imdb_id,"movieContainer");
        let imgDiv = makeDiv("", "movieImg");
        let imgCon = makeMovieImg(m.poster,imgSmall,m.title);
        imgDiv.appendChild(imgCon);
        let titleDiv = makeDiv("","movieTitle");
        let titleCon = makeP("","movieTitle",m.title);
        titleDiv.appendChild(titleCon);
        let yearDiv = makeDiv("","movieYear");
        let yearCon = makeP("","movieYear",m.release_date.slice(0,4));
        yearDiv.appendChild(yearCon);
        let rateDiv = makeDiv("","movieRate");
        let rateCon = makeP("","movieRate",m.ratings.average);
        rateDiv.appendChild(rateCon);
        let viewDiv = makeDiv("","movieView");
        viewCon = makeButton(m.id,"buttons","View","button");
        viewDiv.appendChild(viewCon);
        viewCon.addEventListener("click", (e) => {
            if (e.target && e.target.nodeName.toLowerCase() == "button"){
                gridDef.style.display = "none";
                detailView.style.display = "grid";
                fillDetailsView(e);
            }
        });
    
        tempContainter.appendChild(imgDiv);
        tempContainter.appendChild(titleDiv);
        tempContainter.appendChild(yearDiv);
        tempContainter.appendChild(rateDiv);
        tempContainter.appendChild(viewCon);
        listItems.appendChild(tempContainter);
        
    }
    
    list.appendChild(listItems);
    runFilter();
}
/*Function that builds the default view for the movie in question */
function fillDetailsView(e){
    fetch(movieSpecifics + e.toElement.id)
    .then( (response) =>
    {
        
        if (response.ok){
        return response.json();
        }
        else 
        {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText
            })
        }
    })
    .then( (data) => {
        let bigViewImage = makeMovieImg(data.poster,"w780");
        detpageHeader.innerText = `Everything you want to know about: ${data.title}`;
        mvDetHeader.innerText = `${data.title}`;
        mvSpeakBtn.addEventListener("click", (e) => {if (e.target && e.target.nodeName.toLowerCase() == "button"){const speaking = new SpeechSynthesisUtterance(data.title);speechSynthesis.speak(speaking);}})
        let dTag = makeP("detailsList","menuText","");
        dTag.innerHTML = "Released: "+data.release_date+"<br>Revenue: $"+data.revenue+"<br>Runtime: "+data.runtime +" Minutes<br>TagLine:<br> "+data.tagline;
        descBox.appendChild(dTag);
        dTag.appendChild(br());
        dTag.appendChild(br());
        descBox.appendChild(makeLink("imdb","links",imdbUrl,data.imdb_id,"Learn More on IMDB!"));
        descBox.appendChild(br());
        descBox.appendChild(makeLink("tmdb","Links",tmdbUrl,data.tmdb_id,"Learn more on TMDB!"));
        const rate = makeP("","menuText", "ratings:")
        const pop = makeP("","menuText","Popularity: "+data.ratings.popularity);
        const rcount = makeP("","menuText","Count: "+data.ratings.count);
        const avg = makeP("","menuText","Average: "+data.ratings.average);
        overviewHeader.appendChild(rate);
        overviewHeader.appendChild(pop);
        overviewHeader.appendChild(rcount);
        overviewHeader.appendChild(avg);
        compDiv.appendChild(makeH2("compHeader","menuText","Companies"));
        let compList = makeList("companiesList","lists");
        compDiv.appendChild(compList);
        data.production.companies.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.name;
            temp.setAttribute("class","menuText");
            compList.appendChild(temp);
        });
        countDiv.appendChild(makeH2("countHeader","menuText","Countries"));
        let contList = makeList("countriesList","lists");
        countDiv.appendChild(contList);
        data.production.countries.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.name;
            temp.setAttribute("class","menuText");
            contList.appendChild(temp);
        });
        keywordDiv.appendChild(makeH2("countHeader","menuText","Keywords"));
        let keyList = makeList("keywordsList","lists");
        keywordDiv.appendChild(keyList);
        data.details.keywords.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.name;
            temp.setAttribute("class","menuText");
            keyList.appendChild(temp);
        });
        genDiv.appendChild(makeH2("countHeader","menuText","Genres"));
        let genList = makeList("genreList","lists");
        genDiv.appendChild(genList);
        data.details.genres.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.name;
            temp.setAttribute("class","menuText");
            genList.appendChild(temp);
        });
        mvPoster.setAttribute("src",imgUrl+"w342"+data.poster)
        const bigView = makeDiv("bigView","div");
        detailView.appendChild(bigView);
        
       
        const castList = makeList("cast","Lists");
        data.production.cast.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.character +":  "+e.name;
            temp.setAttribute("class","menuText");
            castList.appendChild(temp);
        });
        castDiv.appendChild(castList);
        const crewList = makeList("cast","Lists");
        data.production.crew.forEach((e) => {
            let temp = document.createElement("li");
            temp.textContent = e.department +"  "+e.job+"   "+e.name;
            temp.setAttribute("class","menuText");
            crewList.appendChild(temp);
        });
        crewDiv.appendChild(crewList)
        mvPoster.addEventListener("click", (e) => {
            if (e.target && e.target.nodeName.toLowerCase() == "img")
            {
                detGridDiv2.style.display = "none";
                detGridDiv3.style.display = "none";
                detGridDiv4.style.display = "none";
                bigView.style.display = "block";
                bigView.appendChild(bigViewImage);
            }
        
        });
        bigView.addEventListener("click", (e) => {
            if (e.target && e.target.nodeName.toLowerCase() == "img")
            {
                detGridDiv2.style.display = "block";
                detGridDiv3.style.display = "block";
                detGridDiv4.style.display = "block";
                bigView.style.display = "none";
            }
        
        });
    })
    .catch((error) => {return console.log(error);})
}

const bd = document.getElementById("body");
const movieData = "http://www.phseguin.ca/apis/movies-brief.php?id=ALL";
const movieSpecifics = "http://www.phseguin.ca/apis/movies-brief.php?id="
const movies = [];
const imgUrl = "https://image.tmdb.org/t/p/";
const imgSmall  = "w92";
const tmdbUrl = "https://www.themoviedb.org/movie/";
const imdbUrl = "https://www.imdb.com/title/";
const filterObj = {
    searchT: "",
    yearBefore: 10000,
    yearAfter: 0000,
    rateBelow: 10,
    rateAbove: 0
}
/*Below is the append code which I have minified to a limited extent for faster proccessing */
let hideFlag = true;const cpel = makeP("copyrightHome", "text","🇨🇭 Claudio Schwarz | @purzlbaum");const maindiv = makeDiv("divmain","div");const box = makeDiv("entryBox","div");const searchHeader = makeH2("boxHeader", "text", "Movie Browser");const searchBox = makeInput("text", "movieSearchBox", "Enter the Title you would like to search", "movieSearch","","");const searchLabel = makeLabel("label", "text", "Movie Title");const bt1 = makeButton("matches", "buttons", "Show Matching Movies", "button");const bt2 = makeButton("all", "buttons", "Show All Movies", "button");bd.appendChild(maindiv);maindiv.appendChild(box);maindiv.appendChild(cpel);box.appendChild(searchHeader);box.appendChild(br());box.appendChild(br());box.appendChild(searchLabel);box.appendChild(searchBox);box.appendChild(bt1);box.appendChild(bt2);const gridDef = makeDiv("DefaultPage","DefGrid-container");gridDef.style.display = "none";bd.appendChild(gridDef);for (let i = 0; i < 3; i++ ){let tempStrid = "gridDefI" + i;gridDef.appendChild(makeDiv(tempStrid,"DefGrid-item"));}const menu = document.querySelector("#gridDefI1");const list = document.querySelector("#gridDefI2");let listHeader = makeH2("listHeaderTxt","text", "List/Matches");let listHeaderC = makeDiv("","movieContainer");let listHeaderDiv = makeDiv("listHeader", "");let titleHeader = makeH2("titleHeader","text", "Title");let yearHeader = makeH2("yearHeader", "text","Year");let rateHeader = makeH2("rateHeader", "text","Rate");let blankDiv1 = makeDiv("","");let blankDiv2 = makeDiv("","");let yearHDiv = makeDiv("yearDescHead","descHeader");let titleHDiv = makeDiv("titleDescHead","descHeader");let rateHDiv = makeDiv("rateDescHead","descHeader");let descHeaders = makeDiv("description", "movieContainer");const loadingImage = makeImg("../images/loading.gif","Loading Please wait and pray for your packets");const listItems = makeDiv("itemList","");let menuHeader = makeH2("menuFilters", "menuText", "Movie Filters");let menuContainer = makeDiv("menuC", "shown");let menuSearchCaption = makeLabel("menuSC", "menuText", "Title");let menuSearchBox = makeInput("text", "menuSearchBox", "Search For Titles","menuSearchBox","menuText","");let menuYearCaption = makeLabel("menuYC", "menuText", "Year");let form = document.createElement("form");form.setAttribute("id", "menuForm");let yearRadio1 = makeInput("radio", "yearRadio","","yearR1","radioBtn","Before");let yearLabel1 = makeLabel("menuLabels", "", "Before");let yearRadio2 = makeInput("radio","yearRadio", "", "yearR2", "radioBtn", "After");let yearLabel2 = makeLabel("menuLabels", "", "After");let yearRadio3 = makeInput("radio","yearRadio", "", "yearR3", "radioBtn", "Between");let yearLabel3 = makeLabel("menuLabels", "", "Between");let yearTBox1 = makeInput("text", "yearTBox", "eg.2020", "yTBBefore", "inputVal","");let yearTBox2 = makeInput("text", "yearTBox", "eg.1980", "yTBAfter", "inputVal","");let yearTBox3 = makeInput("text", "yearTBox", "eg.1980", "yTBHighBound", "inputVal","");let yearTBox4 = makeInput("text", "yearTBox", "eg.2020", "yTBLowBound", "inputVal","");let yearDiv1 = makeDiv("beforeDiv","menuDiv");let yearDiv2 = makeDiv("afterDiv","menuDiv");let yearDiv3 = makeDiv("betweenDiv","menuDiv");let rateCaption = makeLabel("menuRC", "menuText", "Rating");let rateRadio1 = makeInput("radio", "ratingRadio","","ratingR1","radioBtn","");let rateLabel1 = makeLabel("menuLabels", "", "Below 10");let rateSlider1 = makeInput("range", "ratingSlider","","rSBelow","inputVal",10);let rateRadio2 = makeInput("radio", "ratingRadio","","ratingR2","radioBtn","");let rateLabel2 = makeLabel("menuLabels", "", "Above 0");let rateSlider2 = makeInput("range", "ratingSlider","","rSAbove","inputVal", 0);let rateRadio3 = makeInput("radio", "ratingRadio","","ratingR3","radioBtn","");let rateLabel3 = makeLabel("menuLabels", "", "Between 0, 10");let rateSlider3 = makeInput("range", "ratingSlider","","rSHighBound","inputVal",0);let rateSlider4 = makeInput("range", "ratingSlider","","rSLowBound","inputVal",10);let ratingDiv1 = makeDiv("belowDiv","menuDiv");let ratingDiv2 = makeDiv("aboveDiv","menuDiv");let ratingDiv3 = makeDiv("betweenRDiv","menuDiv");let buttonDiv = makeDiv("btnDiv", "menuDiv");let filterBtn = makeButton("filterBtn", "buttons", "Filter", "button");let clearBtn = makeButton("clearBtn", "buttons", "Clear","button");let hideDiv = makeDiv("menuHideD", "shown");let menuHide = makeButton("hideButton", "buttons","","button");let defPageHeader = makeH2("headerDefPage", "text");defPageHeader.innerHTML = "COMP 3512 Assignment 1<br><sub>Pascal Seguin</sub>";const detailView = makeDiv("detailsPage","");const detGridDiv1 = makeDiv("detailHeader","detailsDiv");const details = makeDiv("detailsBox","detailsDiv");const descBox = makeDiv("DecBox","detailsDiv");const detpageHeader = makeH2("detPgHeader", "text","No Movie Selected");const detGridDiv2 = makeDiv("movieDetails","detailsDiv");const mvDetHeader = makeH2("mvDetailsHeader","text","Movie Title");const mvSpeakBtn = makeButton("speakDetails", "buttons", "Speak","button");const overviewHeader = makeH2("overview","menuText","Overview");const compDiv =  makeDiv("companiesDiv", "detailsDiv");const countDiv = makeDiv("countriesDiv","detailsDiv");const keywordDiv = makeDiv("keywordDiv","detailsDiv");const genDiv = makeDiv("genresDiv","detailsDiv");const detGridDiv3 = makeDiv("moviePosterDiv","div");const closeBtn = makeButton("closeButton","buttons","Close","button");const mvPoster = makeImg("","PosterGoesHere");const detGridDiv4 = makeDiv("cDetails","detailsDiv");const showCast = makeButton("castShow","buttons","Cast","button");const showCrew = makeButton("crewShow","buttons","Cast","button");detGridDiv4.appendChild(showCast);detGridDiv4.appendChild(showCrew);const castDiv = makeDiv("castDetails","detailsDiv");const crewDiv = makeDiv("crewDetails","detailsDiv");bd.appendChild(detailView);detailView.appendChild(detGridDiv1);detGridDiv1.appendChild(detpageHeader);detailView.appendChild(detGridDiv2);detGridDiv2.appendChild(details);details.appendChild(mvDetHeader);details.appendChild(mvSpeakBtn);details.appendChild(descBox);details.appendChild(overviewHeader);details.appendChild(compDiv);details.appendChild(countDiv);details.appendChild(keywordDiv);details.appendChild(genDiv);detGridDiv3.appendChild(closeBtn);detGridDiv3.appendChild(br());detGridDiv3.appendChild(mvPoster);detailView.appendChild(detGridDiv3);detGridDiv4.appendChild(castDiv);detGridDiv4.appendChild(crewDiv);detailView.appendChild(detGridDiv4);listHeaderDiv.appendChild(listHeader);listHeaderC.appendChild(listHeaderDiv);list.appendChild(listHeaderC);yearHDiv.appendChild(yearHeader);titleHDiv.appendChild(titleHeader);rateHDiv.appendChild(rateHeader);descHeaders.appendChild(blankDiv1);descHeaders.appendChild(titleHDiv);descHeaders.appendChild(yearHDiv);descHeaders.appendChild(rateHDiv);descHeaders.appendChild(blankDiv2);list.appendChild(descHeaders);document.querySelector("#gridDefI0").appendChild(defPageHeader);menu.appendChild(menuContainer);menuContainer.appendChild(menuHeader);menuContainer.appendChild(form);form.appendChild(menuSearchCaption);menuSearchCaption.appendChild(menuSearchBox);form.appendChild(br());form.appendChild(br());form.appendChild(menuYearCaption);form.appendChild(yearDiv1);yearDiv1.appendChild(yearRadio1);yearDiv1.appendChild(yearLabel1);yearDiv1.appendChild(yearTBox1);form.appendChild(br());form.appendChild(yearDiv2);yearDiv2.appendChild(yearRadio2);yearDiv2.appendChild(yearLabel2);yearDiv2.appendChild(yearTBox2);form.appendChild(br());form.appendChild(yearDiv3);yearDiv3.appendChild(yearRadio3);yearDiv3.appendChild(yearLabel3);yearDiv3.appendChild(yearTBox3);yearDiv3.appendChild(yearTBox4);form.appendChild(br());form.appendChild(br());form.appendChild(rateCaption);form.appendChild(ratingDiv1);ratingDiv1.appendChild(rateRadio1);ratingDiv1.appendChild(rateLabel1);ratingDiv1.appendChild(rateSlider1);form.appendChild(br());form.appendChild(ratingDiv2);ratingDiv2.appendChild(rateRadio2);ratingDiv2.appendChild(rateLabel2);ratingDiv2.appendChild(rateSlider2);form.appendChild(br());form.appendChild(ratingDiv3);ratingDiv3.appendChild(rateRadio3);ratingDiv3.appendChild(rateLabel3);ratingDiv3.appendChild(rateSlider3);ratingDiv3.appendChild(rateSlider4);menuContainer.appendChild(buttonDiv);buttonDiv.appendChild(br());buttonDiv.appendChild(filterBtn);buttonDiv.appendChild(clearBtn);menu.appendChild(hideDiv);hideDiv.appendChild(menuHide); 
/*This is the event listner for the first page*/
box.addEventListener("click", (e) => {
    bd.style.backgroundImage = "url('../images/default.jpg')";
    bd.style.backgroundSize = "100% auto";
    let credit = makeP("","text","Background retireved from Unsplash")
    bd.appendChild(credit)
    if (e.target && e.target.nodeName.toLowerCase() == "button"){ 
if (localStorage.getItem(movies) == null){

    fetch(movieData)
    .then( (response) =>
    {
        list.appendChild(loadingImage);
        if (response.ok){
        return response.json();
        }
        else 
        {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText
            })
        }
    })
    .then( (data) => {
        movies.push(...data);
        movies.sort((a, b) => {return a.title.localeCompare(b.title)});
        localStorage.setItem("movies",JSON.stringify(movies));
    })
    .then(() => {
        
        createMovieList();
        loadingImage.style.display = "none";
    })
    .catch((error) => {return console.log(error);})
}
else {
    movies = JSON.parse(localStorage.getItem("movies"));
    createMovieList()
}
    if (e.toElement.innerText === "Show Matching Movies"){
     maindiv.style.display = "none";
    gridDef.style.display = "grid";
    menuSearchBox.value = searchBox.value;
    filterObj.searchT = searchBox.value.toLowerCase();
    runFilter(); 
    }
    else if (e.toElement.innerText === "Show All Movies"){
        maindiv.style.display = "none";
        gridDef.style.display = "grid";
    }
}
});
/* This is the event listener for the clear and filter button on the default View */
btnDiv.addEventListener("click", (e) => {
    if (e.toElement.innerText === "Filter"){
    runFilter(); 
    }
    else if (e.toElement.innerText === "Clear"){
        filterObj.searchT = "";
        filterObj.rateBelow = 10;
        filterObj.rateAbove = 0;
        filterObj.yearAfter = 0000;
        filterObj.yearbefore = 10000;

        menuSearchBox.value = "";
        yearTBox1.value = "";
        yearTBox2.value = "";
        yearTBox3.value = "";
        yearTBox4.value = "";
        rateSlider1.value = 10;
        rateSlider2.value = 0;
        rateSlider3.value = 0;
        rateSlider4.value = 10;
        rateLabel3.textContent = "Between 0, 10";
        rateLabel2.textContent = "Above 0";
        rateLabel1.textContent = "Below 10";
        runFilter();
    }
});
/*Event listner for the listing headers to sort by Title, Year and Rate */
descHeaders.addEventListener("click", (e,) => {
    (list);
    const selectList = document.querySelectorAll("#itemList div.movieContainer");
    if (e.target && e.target.nodeName.toLowerCase() =="h2")
    {
    for (let i of selectList){
        listItems.removeChild(i);
    }
    if (e.toElement.innerText === "Title"){
        movies.sort((a, b) => {return a.title.localeCompare(b.title)});
    }
    else if (e.toElement.innerText === "Year"){
        movies.sort((a,b) => {if (a.release_date > b.release_date) return 1;if (b.release_date > a.release_date) return -1;return 0;});
    }
    else if (e.toElement.innerText === "Rate"){
        movies.sort((a,b) => { if (a.ratings.average*10 > b.ratings.average*10)return 1; if (b.ratings.average*10 > a.ratings.average*10)return -1;return 0;});
    }
    createMovieList();

}
});
/*Event listner for the Movie Filters that manipulates the filter Object */
form.addEventListener("change",(e) => {
        
        if (e.target && e.target .nodeName.toLowerCase() == "input") {
        if (yearRadio1.checked){ filterObj.yearBefore = yearTBox1.value; yearTBox4.value = yearTBox1.value;}
        else if (yearRadio2.checked){filterObj.yearAfter = yearTBox2.value; yearTBox3.value = yearTBox2.value;}
        else if (yearRadio3.checked){filterObj.yearAfter = yearTBox3; filterObj.yearBefore = yearTBox4; yearTBox1.value = yearTBox4.value; yearTBox2.value = yearTBox3.value;}
        
         if (rateRadio1.checked)
        {
        filterObj.rateBelow = rateSlider1.value;
        rateLabel1.textContent = "Below " + rateSlider1.value;
        rateSlider4.value = rateSlider1.value;
        rateLabel3.textContent = "Between " + rateSlider2.value + ", " +rateSlider1.value;
        }
        else if(rateRadio2.checked){
           filterObj.rateAbove = rateSlider2.value;
           rateLabel2.textContent = "Above " + rateSlider2.value;
           rateSlider3.value = rateSlider2.value;
            rateLabel3.textContent = "Between " + rateSlider2.value + ", " +rateSlider1.value;
        }
        else if(rateRadio3.checked){
            filterObj.rateBelow = rateSlider4.value;
            rateSlider1.value = rateSlider4.value;
            filterObj.rateAbove = rateSlider3.value; 
            rateSlider2.value = rateSlider3.value;
            rateLabel3.textContent = "Between " + rateSlider3.value + ", " +rateSlider4.value;
            rateLabel2.textContent = "Above " + rateSlider3.value;
            rateLabel1.textContent = "Below " + rateSlider4.value;
        }

        filterObj.searchT = menuSearchBox.value.toLowerCase();
    }

});
/*Event Listernfor the menu hide button on the Default button*/
menuHide.addEventListener("click", (e) => {
        let conView = document.querySelector(".DefGrid-container");
        menu.style.transition = "all 15s linear";
        conView.style.transition = "all 15s linear";
        form.style.transition = "all 15s linear";
        menuHeader.style.transition = "all 15s linear";
        btnDiv.style.transition = "all 15s linear";

        if (hideFlag){
        menu.style.gridTemplateColumns = "0px auto";
        conView.style.gridTemplateColumns = "20px auto auto";
        form.style.display = "none";
        menuHeader.style.display = "none";
        btnDiv.style.display = "none";
        hideFlag = false;
        }
        else {
        menu.style.gridTemplateColumns = "auto 20px";
        conView.style.gridTemplateColumns = "30% auto auto";
        form.style.display = "block";
        menuHeader.style.display = "block";
        btnDiv.style.display = "block";
        hideFlag = true;
        }
    });
/*Event listner to close the detail view and reshow the default view */
closeBtn.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName.toLowerCase() == "button"){
        detailView.style.display = "none";
        gridDef.style.display = "grid";  
    }
});
/*changes the view from being crew details to cast details in the div */
showCast.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName.toLowerCase() == "button")
    {
        castDiv.style.display = "block";
        crewDiv.style.display = "none";
    }
})
/*changes the view from being cast details to crew details in the div */
showCrew.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName.toLowerCase() == "button")
    {
        crewDiv.style.display = "block";
        castDiv.style.display = "none";
    }
})

});
