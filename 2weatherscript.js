const userWeather = document.querySelector("[data-userWeather]");
const searchWeather = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const userInfoNotFound = document.querySelector(".notfound");
// const notFoundAdd = document.querySelector(".notfoundadd")

//initially vairables need????

let currentTab = userWeather;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-style-tab");
grantAccessContainer.classList.add("active");



function switchWeatherTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-style-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-style-tab");

        if(!searchForm.classList.contains("active")) {
        //kya search form wala container is invisible, if yes then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
    

}

userWeather.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchWeatherTab(userWeather);
    userInfoNotFound.classList.remove("active");
});

searchWeather.addEventListener("click", () => {
    //pass clicked tab as input paramter
    userInfoNotFound.classList.remove("active")
    switchWeatherTab(searchWeather);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    } 
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        // console.log("response", response);
        if (response.status !== 200){
            loadingScreen.classList.remove("active");
            userInfoNotFound.classList.add("active");

        }
        else{
            const  data = await response.json();
            // userInfoNotFound.classList.remove("active");
            // console.log("data", data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data);
        }

        
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        // alert ("err");
        console.log("catch k andr", err)
        userInfoNotFound.classList.add("active");

        //HW

    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // return alert("data not stored")
        // img.scr = ` D:\study\tech learn\work vs\devclasses\6 js\mini project class\2 weather assets\not-found.png`
        //HW - show an alert for no gelolocation support available
        // navigator.geolocation.classList.remove("")
        userInfoNotFound.classList.add(".active");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
     
    else 
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );

    if (response.status !== 200) {
        // You can do your error handling here
        loadingScreen.classList.remove("active");
       
        userInfoNotFound.classList.add("active");


    } else {
        // Call the .json() method on your response to get your JSON data
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        userInfoNotFound.classList.remove("active");
        renderWeatherInfo(data);
    }
         
      
        
    }
    catch(err) {
        loadingScreen.classList.remove("active");
    }
}