'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

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
};

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
  fetch(`https://restcountries.com/v2/alpha/${country}`)
    .then(response => response.json())
    .then(data => {
      requestCountry(data);
      const [...neighbours] = data.borders;
      if (!neighbours) return;

      neighbours.forEach(neighbour => {
        fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
          .then(response => response.json())
          .then(data => requestCountry(data, 'neighbour'));
      });
    });
};

requestCountryPromises('ind');