// ref: https://github.com/pbca26/agama-wallet-lib/blob/master/src/time.js#L1
const secondsToString = (seconds, skipMultiply, showSeconds) => {
  const a = new Date(seconds * (skipMultiply ? 1 : 1000));
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
  const min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : a.getMinutes();
  const sec = a.getSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}${(showSeconds ? `:${sec}` : '')}`;

  return time;
};

// ref: https://github.com/pbca26/agama-wallet-lib/blob/master/src/time.js#L28
const checkTimestamp = (dateToCheck, currentEpochTime = Date.now() / 1000) => {
  const secondsElapsed = Number(currentEpochTime) - Number(dateToCheck / 1000);

  return Math.floor(secondsElapsed);
};

// src: https://stackoverflow.com/questions/8942895/convert-a-number-of-days-to-days-months-and-years-with-jquery/8943500
const secondsElapsedToString = (timestamp, srcInSeconds) => { // in seconds
  let secondsElapsed = srcInSeconds ? timestamp : checkTimestamp(timestamp);
  let str = '';
  // map lengths of `secondsElapsed` to different time periods
  const oneDay = 24 * 3600;
  const values = [{
    str: ' year',
    num: 365 * oneDay,
  }, {
    str: ' month',
    num: 30 * oneDay,
  }, {
    str: ' week',
    num: 7 * oneDay,
  }, {
    str: ' day',
    num: 1 * oneDay,
  }, {
    str: ' hour',
    num: 3600,
  }, {
    str: ' minute',
    num: 60,
  }, {
    str: ' second',
    num: 1,
  }];

  // iterate over the values...
  for (let i = 0; i < values.length; i++) {
    const _value = Math.floor(secondsElapsed / values[i].num);

    // ... and find the largest time value that fits into the secondsElapsed
    if (_value >= 1) {
      // If we match, add to the string ('s' is for pluralization)
      str += `${_value + values[i].str + (_value > 1 ? 's' : '')} `;

      // and subtract from the secondsElapsed
      secondsElapsed -= _value * values[i].num;
    }
  }

  return str.trim(); // trim space chars
};

module.exports = {
  secondsToString,
  checkTimestamp,
  secondsElapsedToString,
};