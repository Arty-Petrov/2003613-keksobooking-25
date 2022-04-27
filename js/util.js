const ALERT_SHOW_TIME = 5000;
const TIMEOUT_DELAY_TIME = 500;
const ACCURACY_DIGITS = 5;

const fixDigitAccuracy = (digit, fractionAccuracy = ACCURACY_DIGITS) => digit.toFixed(fractionAccuracy);

const createAddressString = (lat, lng) => `${fixDigitAccuracy(lat)}, долгота: ${fixDigitAccuracy(lng)}`;

const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayRange = (array, rangeSize, filterFn) => {
  const filteredArray = filterFn(array);
  const arrayItemsCount = filteredArray.length;
  const rangeItemsCount = (rangeSize < arrayItemsCount) ? rangeSize : arrayItemsCount;
  const rangeStartIndex = getRandomPositiveInteger(0, arrayItemsCount);
  let resultArray = [];
  if ((rangeStartIndex + rangeItemsCount) > arrayItemsCount) {
    resultArray = resultArray.concat(filteredArray.slice(rangeStartIndex));
    resultArray = resultArray.concat(filteredArray.slice(0, rangeStartIndex + rangeItemsCount - arrayItemsCount));
    return resultArray;
  }
  const rangeEndIndex = rangeStartIndex + rangeItemsCount;
  resultArray = resultArray.concat(filteredArray.slice(rangeStartIndex, rangeEndIndex));
  return resultArray;
};

const disableElements = (...elements) => {
  for (const element of elements){
    const elementChildren = element.children;
    for (const child of elementChildren) {
      child.setAttribute('disabled', true);
    }
    element.classList.add(`${element.classList[0]}--disabled`);
  }
};

const enableElements = (...elements) => {
  for (const element of elements){
    const elementChildren = element.children;
    for (const child of elementChildren) {
      child.removeAttribute('disabled');
    }
    element.classList.remove(`${element.classList[0]}--disabled`);
  }
};

const showAlert = (message, element, elementToLock, alertShowTime = ALERT_SHOW_TIME) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 999999;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.textContent = message;
  element.append(alertContainer);
  disableElements(elementToLock);
  setTimeout(() => {
    alertContainer.remove();
  }, alertShowTime);
};

const debounce = (callback, timeoutDelay = TIMEOUT_DELAY_TIME) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {
  createAddressString,
  enableElements,
  disableElements,
  getRandomArrayRange,
  showAlert,
  debounce,
};
