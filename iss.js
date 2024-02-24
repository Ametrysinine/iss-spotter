const request = require("request");
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const url = 'https://api.ipify.org/?format=json';
  let IP;
  request(url, (error, response, body) => {
    setTimeout(() => {

      if (error) {
        return callback(error, null);
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      if (body) {
        IP = JSON.stringify(body).slice(11, -4); // Return IP string only
      }

      return callback(error, IP);
    }, 1);
  });

};

const fetchCoordsByIP = function(IP, callback) {
  const url = 'http://ipwho.is/' + IP + '?fields=latitude,longitude,success';
  request(url, (error, response, body) => {
    setTimeout(() => {
      let description;
      if (error) {
        return callback(error, null);
      }
      const parsedBody = JSON.parse(body);

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      if (parsedBody.success === false) {
        const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
        callback(Error(message), null);
        return;
      } else {
        description = parsedBody;
        return callback(error, description);
      }

    }, 1);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const latitude = coords.latitude;
  const longitude = coords.longitude;
  const url = 'https://iss-flyover.herokuapp.com/json/?lat=' + latitude + '&lon=' + longitude;


  request(url, (error, response, body) => {
    setTimeout(() => {
      let description;
      if (error) {
        return callback(error, null);
      }
      const parsedBody = JSON.parse(body);

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS sightinngs. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      if (parsedBody.success === false) {
        const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for ISS ${parsedBody.ip}`;
        callback(Error(message), null);
        return;
      } else {
        description = parsedBody.response;
        return callback(error, description);
      }

    }, 1);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, IP) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(IP, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passes);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

