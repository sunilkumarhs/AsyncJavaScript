'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imageContainer = document.querySelector('.images');

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
  countriesContainer.style.opacity = 1;
  btn.style.opacity = 0;
};

const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getJsonReaponse = (url, errMsg = 'Something went wrong!') => {
  return fetch(url).then(response => {
    // console.log(response);

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
  getJsonReaponse(
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
        getJsonReaponse(
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

// btn.addEventListener('click', function () {
//   requestCountryPromises('india');
// });

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
      // requestCountryPromises(nat);
    })
    .catch(err => {
      console.log(err);
      console.log(`Something went wrong 💥💥 ${err.message}. Try Again! `);
    });
};

// whereAmI(19.037, 72.873);
// whereAmI(52.508, 13.381);
// whereAmI(-33.933, 18.474);

///////////////////////////////////////////////
//building the simple promise
// const loterryPromise = new Promise(function (resolve, reject) {
//   setTimeout(function () {
//     if (Math.random() <= 0.5) {
//       resolve('You have won 🎉');
//     } else {
//       reject(new Error('You have lost, better luck next time 💔'));
//     }
//   }, 2000);
// });

// loterryPromise.then(res => console.log(res)).catch(err => console.error(err));

// //promisifying setTimeout
const wiat = seconds => {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// wiat(1)
//   .then(() => {
//     console.log('1 second passed');
//     return wiat(1);
//   })
//   .then(() => {
//     console.log('2 second passed');
//     return wiat(1);
//   })
//   .then(() => {
//     console.log('3 second passed');
//     return wiat(1);
//   })
//   .then(() => {
//     console.log('4 second passed');
//     return wiat(1);
//   })
//   .then(() => {
//     console.log('5 second passed');
//     return wiat(1);
//   });

//////////////////////////////////////////////
//instant execueting promise
/*
Promise.resolve('abc').then(res => console.log(res));
Promise.reject(new Error('error has occured!')).catch(err =>
  console.error(err)
);
*/

//Promisifying Geolocation API

const getPosition = () => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));

const whereIAm = () => {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=372291038963244980266x8087`
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
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
      console.error(err);
      console.error(
        new Error(`Something went wrong 💥💥 ${err.message}. Try Again! `)
      );
    });
};

btn.addEventListener('click', whereIAm);

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/
// const wiat = seconds => {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };
let image;
const createImage = path => {
  return new Promise(function (resolve, reject) {
    image = document.createElement('img');
    image.src = path;
    image.onerror = () => {
      reject('Error occured in loading the image!');
    };
    image.onload = () => {
      image.style.display = 'block';
      resolve(imageContainer.insertAdjacentElement('afterbegin', image));
    };
  });
};

createImage('img/img-1.jpg')
  .then(() => {
    return wiat(2);
  })
  .then(() => {
    image.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(() => {
    return wiat(2);
  })
  .then(() => {
    image.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(() => {
    return wiat(2);
  })
  .catch(err => {
    console.error(new Error(err));
    imageContainer.insertAdjacentText('afterbegin', err);
  });

//////////////////////////////////////////////////////////////////////
// async and await methods

const myLocation = async () => {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const resp = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=372291038963244980266x8087`
    );
    if (!resp.ok) throw new Error('Geolocation could not found!');
    const posData = await resp.json();

    const location = await fetch(
      `https://restcountries.com/v2/name/${posData.country}`
    );
    if (!location.ok) throw new Error('Country could not found!');
    const country = await location.json();
    requestCountry(country[1]);
    return `You are in ${posData.city} city, ${posData.country}`;
  } catch (err) {
    console.error(`💥 ${err}`);
    renderError(`💥 ${err.message}`);
    throw err;
  }
};
// console.log('1: Fetching the Geolocation.');
// (async function () {
//   try {
//     const city = await myLocation();
//     console.log(`2: ${city}`);
//   } catch (err) {
//     console.error(`2: ${err}`);
//   }
//   console.log('3: Finished the fetching Gealocation.');
//   // } finally {
//   //   console.log('3: Finished the fetching Gealocation.');
//   // }
// })(myLocation);

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJsonReaponse(
    //   `https://restcountries.com/v2/name/${c1}`
    // );
    // const [data2] = await getJsonReaponse(
    //   `https://restcountries.com/v2/name/${c2}`
    // );
    // const [data3] = await getJsonReaponse(
    //   `https://restcountries.com/v2/name/${c3}`
    // );
    // console.log([data1.capital, data2.capital, data3.capital]);

    const data = await Promise.all([
      getJsonReaponse(`https://restcountries.com/v2/name/${c1}`),
      getJsonReaponse(`https://restcountries.com/v2/name/${c2}`),
      getJsonReaponse(`https://restcountries.com/v2/name/${c3}`),
    ]);
    console.log(data.map(cp => cp[0].capital));
  } catch (err) {
    console.error(err);
  }
};

// get3Countries('sri lanka', 'nepal', 'bhutan');
// promise.race
// (async function () {
//   try {
//     const data = await Promise.race([
//       getJsonReaponse(`https://restcountries.com/v2/name/sri lanka`),
//       getJsonReaponse(`https://restcountries.com/v2/name/nepal`),
//       getJsonReaponse(`https://restcountries.com/v2/name/bhutan`),
//     ]);
//     console.log(data[0]);
//   } catch (err) {
//     console.error(err);
//   }
// })();

//timeout poromise
const timeout = async function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took to long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJsonReaponse(`https://restcountries.com/v2/name/sri lanka`),
  timeout(0.5),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

//promise allsetled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Success'),
]).then(resp => console.log(resp));

// Promise.all([
//   Promise.resolve('Success'),
//   Promise.reject('Error'),
//   Promise.resolve('Success'),
// ])
//   .then(resp => console.log(resp))
//   .catch(err => console.error(err));

// promise.any
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Success'),
])
  .then(resp => console.log(resp))
  .catch(err => console.error(err));