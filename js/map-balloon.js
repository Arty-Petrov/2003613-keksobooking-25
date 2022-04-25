import { LodgingProperties } from './enum-data.js';

const lodgingTypesText = Object.fromEntries(Object.entries(LodgingProperties).map(([ key, val ]) => [ key, val.fieldText]));

const hasDefinedProperty = (obj, objProp) => (objProp in obj) || (obj[objProp] === !undefined);

const cbAddTextContent = (element, value, appendix) => {
  element.innerHTML = (appendix) ? `${value} ${appendix}` : value;
};

const cbSetAttribute = (element, value, atr) => {
  element.setAttribute(atr, value);
};

const cbSetOfferType = (element, value, enumTypes) => {
  const typeValue =  value;
  for (const key in enumTypes) {
    if (key === typeValue){
      element.innerHTML = enumTypes[key];
    }
  }
};

const cbSetFeatures  = (element, propsArray, features) => {
  const classString = 'popup__feature--';
  const propsClassList = [];
  for (const propIndex in propsArray){
    propsClassList.push(classString + propsArray[propIndex]);
  }
  features.forEach((featureItem) => {
    const featureItemClass = featureItem.classList[1];
    if (!propsClassList.includes(featureItemClass)) {
      featureItem.remove();
    }
  });
};

const cbSetPhotos  = (element, propsArray, photoElement) => {
  const fragmet = document.createDocumentFragment();
  for (const item of propsArray){
    const newImg = photoElement.cloneNode(true);
    newImg.src = item;
    fragmet.appendChild(newImg);
  }
  element.innerHTML='';
  element.appendChild(fragmet);
};

const cardItemHandler = (element, obj, objProp, cbOnObjPropExist, appendix = null) => {
  if (!hasDefinedProperty(obj, objProp)){
    element.classList.add('visually-hidden');
  } else if (appendix){
    cbOnObjPropExist(element, obj[objProp], appendix);
  } else {
    cbOnObjPropExist(element, obj[objProp]);
  }
};

const roomStr = (value) => {
  if (value === 1) {
    return 'комната';
  } else if (value < 5){
    return 'комнаты';
  } else {
    return 'комнат';
  }
};

const guestStr = (value) => {
  if (value === 1) {
    return 'гостя';
  } else {
    return 'гостей';
  }
};

const cardItemStringHandler = (element, obj, ...objProps) => {
  let str = '';
  for (const el in objProps){
    const prop = objProps[el];
    if (!hasDefinedProperty(obj, prop)){
      element.classList.add('visually-hidden');
      break;
    }
    switch (prop) {
      case 'guests':
        str += (obj[prop] === 0) ? ' не для гостей':  ` для ${obj[prop]} ${guestStr(obj[prop])}`;
        break;
      case 'rooms':
        str = `${obj[prop]} ${roomStr(obj[prop])}${str}`;
        break;
      case 'checkin':
        str = `Заезд после ${obj[prop]}${str}`;
        break;
      case 'checkout':
        str += `, выезд до ${obj[prop]}`;
        break;
    }
  }
  element.innerHTML = str;
};

const createBalloonContent = ({author, offer}) => {

  const template = document.querySelector('#card').cloneNode(true).content;
  const card = template.querySelector('.popup');

  const avatar = card.querySelector('.popup__avatar');
  const title = card.querySelector('.popup__title');
  const address = card.querySelector('.popup__text--address');
  const price = card.querySelector('.popup__text--price');
  const type = card.querySelector('.popup__type');
  const capacity = card.querySelector('.popup__text--capacity');
  const time = card.querySelector('.popup__text--time');
  const featuresContainer = card.querySelector('.popup__features');
  const features = featuresContainer.querySelectorAll('.popup__feature');
  const description = card.querySelector('.popup__description');
  const photosContainer = card.querySelector('.popup__photos');
  const photoItem = photosContainer.querySelector('.popup__photo').cloneNode(true);

  cardItemHandler(avatar, author, 'avatar', cbSetAttribute, 'src');
  cardItemHandler(title, offer, 'title', cbAddTextContent);
  cardItemHandler(address, offer, 'address', cbAddTextContent);
  cardItemHandler(price, offer, 'price', cbAddTextContent, '<span>₽/ночь</span>');
  cardItemHandler(type, offer, 'type', cbSetOfferType, lodgingTypesText);
  cardItemStringHandler(capacity, offer, 'guests', 'rooms');
  cardItemStringHandler(time, offer, 'checkin', 'checkout');
  cardItemHandler(featuresContainer, offer, 'features', cbSetFeatures, features);
  cardItemHandler(description, offer, 'description', cbAddTextContent);
  cardItemHandler(photosContainer, offer, 'photos', cbSetPhotos, photoItem);

  return card;
};

export {createBalloonContent};
