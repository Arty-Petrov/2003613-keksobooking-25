const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const LodgingProperties = {
  bungalow: {
    fieldText: 'Бунгало',
    priceRange: {
      min: 0,
      max: 100000,
    }
  },
  flat: {
    fieldText: 'Квартира',
    priceRange: {
      min: 1000,
      max: 100000,
    },
  },
  hotel: {
    fieldText: 'Отель',
    priceRange: {
      min: 3000,
      max: 100000,
    },
  },
  house: {
    fieldText: 'Дом',
    priceRange: {
      min: 5000,
      max: 100000,
    },
  },
  palace:{
    fieldText: 'Дворец',
    priceRange: {
      min: 10000,
      max: 100000,
    },
  },
};

const lodgingTypesMinPrice = Object.fromEntries(Object.entries(LodgingProperties).map(([ key, val ]) => [ key, val.priceRange.min]));
const lodgingTypesMaxPrice = Object.fromEntries(Object.entries(LodgingProperties).map(([ key, val ]) => [ key, val.priceRange.max]));

const HousingClassPrice = {
  low: {
    min: 0,
    max: 10000,
  },
  middle: {
    min: 10000,
    max: 50000,
  },
  high: {
    min: 50000,
    max: 100000,
  },
};

export {
  FILE_TYPES,
  LodgingProperties,
  lodgingTypesMaxPrice,
  lodgingTypesMinPrice,
  HousingClassPrice,
};
