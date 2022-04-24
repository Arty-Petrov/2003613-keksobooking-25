import { getData } from './api.js';
import { enableElements, showAlert, debounce} from './util.js';
import { createBalloonContent } from './map-balloon.js';

const initMapCoordinate = {
  lat: 35.683792,
  lng: 139.749698,
};

const initPinCoordinate = {
  lat: 35.683792,
  lng: 139.749698,
};

const mapContainer = document.querySelector('.map__canvas');
const mapFilters = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');
const address = adForm.querySelector('#address');

const cbMapOnLoadHandler = () => {
  enableElements(adForm, mapFilters);
};

const mapTileLayer = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 0],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94]
});

const mainPin = L.marker(
  {
    lat: initPinCoordinate.lat,
    lng: initPinCoordinate.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const offerPinGroup = L.layerGroup();

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
      createOfferPin(offer);
    });
  },
  (allertMessage) => {showAlert(allertMessage, mapContainer);}
  );
};

const resetOffersPinsLayer = () => {
  offerPinGroup.clearLayers();
  putPinsToMap();
};

const initMap = () => {
  const leafletObj = L.map('map-canvas');
  leafletObj.setView({
    lat: initMapCoordinate.lat,
    lng: initMapCoordinate.lng,
  }, 13);
  leafletObj.whenReady(cbMapOnLoadHandler);

  mapTileLayer.addTo(leafletObj);
  mainPin.addTo(leafletObj);
  offerPinGroup.addTo(leafletObj);
  leafletObj.whenReady(putPinsToMap);
  return leafletObj;
};

const map = initMap();

const setMapDefault = () => {
  const defaultLat = initMapCoordinate.lat;
  const defaulLng = initMapCoordinate.lng;
  map.closePopup();
  map.setView({
    lat: defaultLat,
    lng: defaulLng,
  });
  mainPin.setLatLng([defaultLat,defaulLng]);
  resetOffersPinsLayer();
};

mainPin.on('moveend', (evt) => {
  address.setAttribute('value', `широта: ${Number(evt.target.getLatLng().lat).toFixed(6)}, долгота: ${Number(evt.target.getLatLng().lng).toFixed(6)}`);
});

mapFilters.addEventListener('change', debounce(() => {resetOffersPinsLayer();}));

export { initPinCoordinate, resetOffersPinsLayer, setMapDefault };
