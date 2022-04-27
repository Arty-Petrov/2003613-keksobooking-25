import { createAddressString } from './util.js';
import { sendData, POST_ADDRESS } from './api.js';
import { lodgingTypesMinPrice,lodgingTypesMaxPrice,} from './enum-data.js';
import { initCoordinate, setMapDefault } from './map.js';
import { formPristine } from './form-validate.js';

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const address = adForm.querySelector('#address');
const lodgingType = adForm.querySelector('#type');
const lodgingPrice = adForm.querySelector('#price');
const checkin = adForm.querySelector('#timein');
const checkout = adForm.querySelector('#timeout');
const roomCount = adForm.querySelector('#room_number');
const roomCapacity = adForm.querySelector('#capacity');
const priceSlider = adForm.querySelector('.ad-form__slider');
const submitButton = adForm.querySelector('.ad-form__submit');
const ressetButton = adForm.querySelector('.ad-form__reset');
const successMessage = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
const errorMessage = document.querySelector('#error').content.querySelector('.error').cloneNode(true);

const getPriceByLodgingType = (type, price) => {
  const keyName = type.value;
  return price[keyName];
};

const syncSelectsByValue = (selectFrom, selectTo) => {
  selectTo.value = selectFrom.value;
};

const getMinLodgingPrice = () => getPriceByLodgingType(lodgingType, lodgingTypesMinPrice);

const getMaxLodgingPrice = () => getPriceByLodgingType(lodgingType, lodgingTypesMaxPrice);

const initForm = (form) => {
  if (!form.getAttribute('action')){
    form.action = POST_ADDRESS;
  }
};

const initAddress = () => {
  address.setAttribute('value', createAddressString(initCoordinate.lat, initCoordinate.lng));
  address.setAttribute('readonly', true);
};

const initLodgingPrice = () => {
  lodgingPrice.placeholder = getMinLodgingPrice();
  lodgingPrice.value = '';
  lodgingPrice.setAttribute('min', 0);
};

const initLodgingType = () => {
  lodgingType.value = 'flat';
};

const initRoomCountCapacity = () => {
  syncSelectsByValue(roomCount, roomCapacity);
};

noUiSlider.create(priceSlider, {
  range: {
    min: 0,
    max: getMaxLodgingPrice(),
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseInt(value, 10);
    },
  },
});

const updateSliderStart = (value) => {
  priceSlider.noUiSlider.updateOptions({
    start: value,
  });};

const initSlider = () => {
  updateSliderStart(0);
};

const setFormDefault = () => {
  adForm.reset();
  mapFilters.reset();
  initAddress();
  initLodgingType();
  initLodgingPrice();
  initSlider();
  initRoomCountCapacity();
  formPristine.reset();
};

document.addEventListener('DOMContentLoaded', () => {
  initForm(adForm);
  initAddress();
  initLodgingPrice();
  initRoomCountCapacity();
});

priceSlider.noUiSlider.on('slide', () => {
  lodgingPrice.value = priceSlider.noUiSlider.get();
  formPristine.validate();
});

lodgingPrice.addEventListener('blur', () => {
  updateSliderStart(lodgingPrice.value);
  priceSlider.noUiSlider.set(lodgingPrice.value);
  formPristine.validate();
});

lodgingType.addEventListener('change', () => {
  const price = getMinLodgingPrice();
  lodgingPrice.placeholder = price;
  lodgingPrice.value = '';
});

checkin.addEventListener('change', () => {
  const time = checkin.value;
  checkout.value = time;
});

checkout.addEventListener('change', () => {
  const time = checkout.value;
  checkin.value = time;
});

roomCount.addEventListener('change', () => {
  if (roomCount.value === '100') {
    roomCapacity.value = '0';
  } else {
    syncSelectsByValue(roomCount, roomCapacity);
  }
});

const blockSubmitButton = () => {
  submitButton.disabled = true;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
};

const successRoutine = (evt, message) => {
  const keyPressHandler = function () {
    if (evt.type === 'click' || evt.code === 'Escape'){
      setFormDefault();
      formPristine.reset();
      message.remove();
    }
    unblockSubmitButton();
    setFormDefault();
    setMapDefault();
  };
  return keyPressHandler();
};

const successMessageHandler = (message) => {
  document.addEventListener('click', (evt) => successRoutine(evt, message), {once: true});
  document.addEventListener('keydown', (evt) => successRoutine(evt, message), {once: true});
};

const errorRoutine = () => {
  const keyPressHandler = () =>{
    if (event.type === 'click' || event.code === 'Escape'){
      errorMessage.remove();
      document.removeEventListener('click', errorRoutine);
      document.removeEventListener('keydown', errorRoutine);
    }
    unblockSubmitButton();
  };
  return keyPressHandler();
};

const errorMessageHandler = (message) => {
  const button = (message.querySelector('.error__button'));
  button.addEventListener('click', errorRoutine, {once: true});
  document.addEventListener('click', errorRoutine, {once: true});
  document.addEventListener('keydown', errorRoutine, {once: true});
};

const showMessage = (message, handler) => {
  document.body.append(message);
  handler(message);
};

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = formPristine.validate();
  if (isValid){
    blockSubmitButton();
    sendData(
      () => {showMessage(successMessage, successMessageHandler);},
      () => {showMessage(errorMessage, errorMessageHandler);},
      adForm
    );
  }
});

ressetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  setFormDefault();
  setMapDefault();
});
