const request = require('request-promise-native');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};
const fetchCoordsByIP = function(body) {
  const ip = JSON.stringify(body).slice(11, -4);
  return request(`http://ipwho.is/` + ip);
};

const fetchISSFlyOverTimes = function(body) {
  const coordinates = JSON.parse(body);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const sightings = JSON.parse(body).response;
      for (const sighting of sightings) {
        const date = new Date(0);
        const duration = sighting.duration;
        date.setUTCSeconds(sighting.risetime);

        console.log(date + ' : for ' + duration + ' seconds.');
      }
    })
    .catch((error) => {
      console.log(`It didn't work: ${error}`);
    });
  
};
module.exports = { nextISSTimesForMyLocation };