function getRandomWholeNumber(minRangeValue, maxRangeValue) {

  let minVal = Math.ceil(Number(minRangeValue));
  let maxVal = Math.floor(Number(maxRangeValue));

  if ((minVal < 0) || (maxVal < 0) || (Math.ceil(minVal) >= Math.floor(maxVal))) {
    return null;
  }

  /*логику рандомайзера подсмотрел на 
  https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
  let min = minVal;
  let max = maxVal;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGeoCoordinate(minRangeValue, maxRangeValue, fractionLength) {

  let minVal = Number(minRangeValue);
  let maxVal = Number(maxRangeValue);
  let frLength = parseInt(Number(fractionLength));

  /*Максимальное значение геокоординат — 360˚ 
  В условии не было этой проверки, если не нужна, уберу*/
  maxVal = (maxVal > 360) ? 360 : maxVal;

  if ((minVal < 0) || (maxVal < 0) || (minVal >= maxVal)) {
    return null;
  }

  /*логику рандомайзера подсмотрел на 
  https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
  let min = Math.ceil(minVal * Math.pow(10, frLength));
  let max = Math.floor(maxVal * Math.pow(10, frLength));
  return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, frLength);
}

//проверка
let minThreshold = 0;
let maxThreshold = 3;
let fractionL = 8;
let number;
for (let i = 0; i < 100000; i++) {
  number = getRandomGeoCoordinate(minThreshold, maxThreshold, fractionL);
  if (minThreshold > number && maxThreshold > number) {
    console.log("getRandomGeoCoordinate false " + "min: " + minThreshold + " max: " + maxThreshold + " result: " + number);
  }
}
console.log("getRandomGeoCoordinate min: " + minThreshold + " max: " + maxThreshold + " result: " + number);

for (let i = 0; i < 100000; i++) {
  number = getRandomWholeNumber(minThreshold, maxThreshold);
  if (minThreshold > number && maxThreshold > number) {
    console.log("getRandomWholeNumber false " + "min: " + minThreshold + " max: " + maxThreshold + " result: " + number);
  }
}
console.log("getRandomWholeNumber min: " + minThreshold + " max: " + maxThreshold + " result: " + number);