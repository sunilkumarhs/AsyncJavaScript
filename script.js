'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const requestCountry = (data, className = '') => {
  const html = `<article class="country ${className}">
<img class="country__img" src=${data.flag} />
<div class="country__data">
  <h3 class="country__name">${data.name} </h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(
    +data.population / 100000000
  ).toFixed(1)} billion peoples</p>
  <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
  <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
</div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
  btn.style.opacity = 0;
};

const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getReaponse = (url, errMsg = 'Something went wrong!') => {
  return fetch(url).then(response => {
    console.log(response);

    if (!response.ok) throw new Error(`${errMsg} (${response.status})`);

    return response.json();
  });
};

///////////////////////////////////////

// const requestCountryandNeighbour = country => {
//   const request1 = new XMLHttpRequest();

//   request1.open('GET', `https://restcountries.com/v2/alpha/${country}`);
//   request1.send();

//   request1.addEventListener('load', function () {
//     const data1 = JSON.parse(request1.responseText);
//     console.log(data1);
//     requestCountry(data1);

//     const [...neighbours] = data1.borders;

//     console.log(neighbours);
//     if (!neighbours) return;

//     neighbours.forEach(neighbour => {
//       const request2 = new XMLHttpRequest();
//       request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
//       request2.send();

//       request2.addEventListener('load', function () {
//         const data2 = JSON.parse(request2.responseText);
//         console.log(data2);
//         requestCountry(data2, 'neighbour');
//       });
//     });
//   });
// };

// requestCountryandNeighbour('ind');

const requestCountryPromises = country => {
  getReaponse(
    `https://restcountries.com/v2/name/${country}`,
    'Country Not Found!'
  )
    .then(data => {
      let val;
      if (data.length > 1) {
        val = data[1];
      } else {
        val = data[0];
      }
      console.log(val);
      requestCountry(val);
      const test = val.borders;

      if (!test) throw new Error('Neighbour Country Not Found!');

      const [...neighbours] = val.borders;

      // const neighbours = data.borders;

      // return getReaponse(
      //   `https://restcountries.com/v2/alpha/${neighbours}`,
      //   'Neighbour Country Not Found!'
      // );
      neighbours.forEach(neighbour => {
        getReaponse(
          `https://restcountries.com/v2/alpha/${neighbour}`,
          'Neighbour Country Not Found!'
        ).then(data => requestCountry(data, 'neighbour'));
      });
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try Again! `);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  requestCountryPromises('india');
});

// requestCountryPromises('aus');

///////////////////////////////////////
console.log('Challenge #1');
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
const toJSON = url => {
  return fetch(url).then(resp => {
    console.log(resp);
    return resp.json();
  });
};
const whereAmI = (lat, lng) => {
  toJSON(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=372291038963244980266x8087`
  )
    .then(data => {
      console.log(data);
      const region = data.region;
      const country = data.country;
      if (!region || !country) throw new Error('Data Not Found!');
      console.log(`You are in ${region}, ${country}`);
      const nat = country.toLowerCase();
      requestCountryPromises(nat);
    })
    .catch(err => {
      console.log(err);
      console.log(`Something went wrong 💥💥 ${err.message}. Try Again! `);
    });
};

whereAmI(19.037, 72.873);
// whereAmI(52.508, 13.381);
// whereAmI(-33.933, 18.474);