'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const requestCountry = country => {
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v2/alpha/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(request.responseText);
    console.log(data);
    // (${
    //     data[0].name.nativeName.hin.common
    //   })
    const html = `<article class="country">
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
  });
};

requestCountry('ind');
requestCountry('npl');
requestCountry('lka');
