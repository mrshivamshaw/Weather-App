// console.log("Helloo jeee")

// const API_KEY = "9fafdb7be04ec8334971c56825822918";

// async function fetchUserWeatherInfo(){
//     let lat = 13.77;
//     let lon = 15.777;
//     const response = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//       );

//     const data =await response.json();
//     console.log("Weather is -> ",data)
//     let newpara = document.createElement('p');
//     newpara.textContent = `${data?.main?.temp.toFixed(2)} °C`
//         document.body.appendChild(newpara)
// }

// starts from here---------------

//getting the required attributes and classes from html
const usertab =document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantAcessConatiner = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const infoContainer = document.querySelector(".user-info-container");

let currtab = usertab;
//api key
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// for getting the background color on the current tab
currtab.classList.add("current-tab");
getfromSessionStorage();

//now switching between the tabs 
function switchTab(clickedTab){
    if(clickedTab != currtab){
        // for getting the background color on the current tab
        currtab.classList.remove("current-tab");
        currtab = clickedTab;
        currtab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //is the searchform container is invisible if yes then make it visible
            infoContainer.classList.remove("active");
            grantAcessConatiner.classList.remove("active");
            searchForm.classList.add("active");
        }
        
        else{
            //initially on the serach tab now switching to the user tab
            searchForm.classList.remove("active");
            //making user tab visible, so we have to display the weather also so lets check the local storage also
            //for coordinates if we have saved them
            infoContainer.classList.add("active");
            getfromSessionStorage();
        }
    }

}

//when clicked on user tab
usertab.addEventListener("click", () => {
    //current tab is passed as input parameter for switch tab
    switchTab(usertab);
});

//when clicked on search tab
searchtab.addEventListener("click", () => {
    //current tab is passed as input parameter for switch tab
    switchTab(searchtab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if we didnt get the local storage
        grantAcessConatiner.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//fetching user data function
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //since we got the info now make the grantTAb invisible
    grantAcessConatiner.classList.remove("active");
    //and now show the loading tab
    loadingScreen.classList.add("ative");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //now as we mgot the user detail remove loading
        loadingScreen.classList.remove("active");
        //and now shoe user details
        infoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }
}

function renderWeatherInfo(weatherInfo){
    //fetch the element to give the there values
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");
    
    //fetch data from weatherinfo object
    //using link first check whats the name of objects by using json formatter

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C `; 
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("Unable to find...")
    }
}

function showposition(position){
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

const grantAccessButton = document.querySelector("[data-grantlocation]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

//this is used in the search tab
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    infoContainer.classList.remove("active");
    grantAcessConatiner.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        infoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        alert("Inavaild Input..")
    }
}

