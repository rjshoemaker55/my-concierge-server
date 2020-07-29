const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const port = 4000;
require('dotenv').config();

app.use(cors());

let options = {
  method: 'GET',
  headers: {
    'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
    'x-rapidapi-key': process.env.API_KEY,
  },
};

app.get('/locationid/:cityName', async (req, res) => {
  console.log('Hit locationid GET route');

  const destCity = req.params.cityName;

  const locationQueryString = `
    https://tripadvisor1.p.rapidapi.com/locations/auto-complete?lang=en_US&units=mi&query=${destCity}
  `;

  const locationQuery = await fetch(locationQueryString, options);
  const locationResponse = await locationQuery.json();

  if (
    !locationResponse.data.length ||
    locationResponse.data[0].result_type == 'profiles'
  ) {
    res.send({ error: 'Invalid location' });
  } else {
    res.send(locationResponse.data[0].result_object.location_id);
  }
});

app.get('/hotellist/:locationid/:checkin/:nights/:sortBy', async (req, res) => {
  console.log('Hit hotellist GET route');
  let locationId = req.params.locationid;
  let checkIn = req.params.checkin;
  let nights = req.params.nights;
  let sortBy = req.params.sortBy;

  let hotelListQueryString = `https://tripadvisor1.p.rapidapi.com/hotels/list?offset=0&currency=USD&limit=30&order=asc&lang=en_US&sort=recommended&location_id=${locationId}&adults=1&checkin=${checkIn}&rooms=1&nights=${nights}&sort=${sortBy})`;

  const hotelListQuery = await fetch(hotelListQueryString, options);
  const hotelListResponse = await hotelListQuery.json();
  res.send(hotelListResponse.data);
});

app.listen(port, () => console.log(`app listening on port ${port}`));
