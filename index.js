const { nextISSTimesForMyLocation } = require('./iss');


nextISSTimesForMyLocation((error, data) => {
  if (error !== null) {
    console.log(error);
  }
  for (const sighting of data) {
    const date = new Date(0);
    const duration = sighting.duration;
    date.setUTCSeconds(sighting.risetime);

    console.log(date + ' : for ' + duration + ' seconds.');
  }
});