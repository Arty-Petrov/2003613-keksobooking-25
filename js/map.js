import { getData } from './api.js';
import { createAddressString, enableElements, disableElements, showAlert, debounce} from './util.js';
import { createBalloonContent } from './map-balloon.js';

const MAP_ZOOM = 13;
const MAP_TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_ATRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ICON_URL = './img/main-pin.svg';

const initCoordinate = {
  lat: 35.683792,
  lng: 139.749698,
};

const mapContainer = document.querySelector('.map__canvas');
const mapFilters = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');
const address = adForm.querySelector('#address');

disableElements(adForm, mapFilters);

const map = L.map('map-canvas').setView({
  lat: initCoordinate.lat,
  lng: initCoordinate.lng,
}, MAP_ZOOM);

const mainPinIcon = L.icon({
  iconUrl: ICON_URL,
  iconSize: [52, 52],
  iconAnchor: [26, 0],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94]
});

const mainPin = L.marker(
  {
    lat: initCoordinate.lat,
    lng: initCoordinate.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPin.addTo(map).on('load', enableElements(adForm));

mainPin.on('moveend', (evt) => {
  const lat = Number(evt.target.getLatLng().lat);
  const lng = Number(evt.target.getLatLng().lng);
  address.setAttribute('value', createAddressString(lat, lng));
});

L.tileLayer(
  MAP_TILES_URL,
  {
    attribution: MAP_ATRIBUTION,
  },
).addTo(map).on('tileerror', () => {disableElements(adForm);});

const offerPinGroup = L.layerGroup();
offerPinGroup.addTo(map);

const offerPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 0],
  popupAnchor: [0, 18],
});

const createOfferPin = (offer) => {
  const lat = offer.location.lat;
  const lng = offer.location.lng;
  const offerPin = L.marker({
    lat,
    lng,
  },
  {
    icon: offerPinIcon,
  },
  );
  offerPin
    .addTo(offerPinGroup)
    .bindPopup(createBalloonContent(offer));
};

const putPinsToMap = () => {
  getData((dataSet) => {
    dataSet.forEach((offer) => {
      enableElements(mapFilters);
      createOfferPin(offer);
    });
  },
  (allertMessage) => {showAlert(allertMessage, mapContainer, mapFilters);}
  );
};

putPinsToMap();

const resetOffersPinsLayer = () => {
  offerPinGroup.clearLayers();
  putPinsToMap();
};

const setMapDefault = () => {
  const defaultLat = initCoordinate.lat;
  const defaulLng = initCoordinate.lng;
  map.closePopup();
  map.setView({
    lat: defaultLat,
    lng: defaulLng,
  });
  mainPin.setLatLng([defaultLat,defaulLng]);
  resetOffersPinsLayer();
};

mapFilters.addEventListener('change', debounce(() => {resetOffersPinsLayer();}));

export { initCoordinate, setMapDefault };
