import { HousingClassPrice } from './enum-data.js';

const mapFilters = document.querySelector('.map__filters');
const filterType = mapFilters.querySelector('#housing-type');
const filterPrice = mapFilters.querySelector('#housing-price');
const filterRoomsCount = mapFilters.querySelector('#housing-rooms');
const filterGuestsCount = mapFilters.querySelector('#housing-guests');
const filterFeatureList = mapFilters.querySelector('#housing-features');

const getPropName = (filterElement) => filterElement.id.slice(filterElement.id.lastIndexOf('-') + 1);

const getPropValue = (item, filterElement) => item[getPropName(filterElement)];

const checkItemPresence = (prop, filterElement) => {
  const propValue = getPropValue(prop, filterElement);
  const filterValue = filterElement.value;
  return  `${propValue}` === `${filterValue}`;
};

const checkItemPriceValueInFilterRange = (prop, filterElement) => {
  const filterValue = filterElement.value;
  const minValue = HousingClassPrice[filterValue].min;
  const maxValue = HousingClassPrice[filterValue].max;
  const propValue = getPropValue(prop, filterElement);
  return propValue >= minValue && propValue < maxValue;
};
const getFeaturesFilter = (filterElement) => {
  const checkboxes = filterElement.querySelectorAll('.map__checkbox');
  const checkedCheckboxes = [];
  checkboxes.forEach((el) => {
    if (el.checked){
      checkedCheckboxes.push(el.value);
    }
  });
  return checkedCheckboxes;
};

const checkItemFeatures = (prop, filterElement) => {
  const checkedCheckboxes = getFeaturesFilter(filterElement);
  const propValue = getPropValue(prop, filterElement);
  let propValues = [];
  if (propValue === undefined){
    return false;
  }
  propValues = Object.values(propValue);
  for (const el in checkedCheckboxes) {
    if (!(propValues.includes(checkedCheckboxes[el]))) {
      return false;
    }
  }
  return true;
};

const checkFilterIsActive = (filterElement) => {
  const filterActivated = !filterElement.disable;
  const filterValue = filterElement.value !== 'any';
  return filterActivated && filterValue;
};

const checkCheckboxesChecked = (filterElement) => {
  const featuresFiltersCount = getFeaturesFilter(filterElement).length;
  return featuresFiltersCount > 0;
};

const filterDataElement = (item) => {
  const {offer: prop} = item;
  if (checkFilterIsActive(filterType) && !checkItemPresence(prop, filterType)) {
    return false;
  }
  if (checkFilterIsActive(filterPrice) && !checkItemPriceValueInFilterRange(prop, filterPrice)) {
    return false;
  }
  if (checkFilterIsActive(filterRoomsCount) && !checkItemPresence(prop, filterRoomsCount)) {
    return false;
  }
  if (checkFilterIsActive(filterGuestsCount) && !checkItemPresence(prop, filterGuestsCount) ) {
    return false;
  }
  if (checkCheckboxesChecked(filterFeatureList)) {
    return checkItemFeatures(prop, filterFeatureList);
  }
  return true;
};

const filterData = (data) => data.filter((item) => filterDataElement(item));

export {filterData};
