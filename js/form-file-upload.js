import { FILE_TYPES } from './enum-data.js';

const form = document.querySelector('.ad-form');
const userAvatarInput = form.querySelector('.ad-form-header__input');
const userAvatarContainer = form.querySelector('.ad-form-header__preview');
const lodgingPhotoInput = form.querySelector('.ad-form__input');
const lodgingPhotoContainer = form.querySelector('.ad-form__photo');

const createImageTag = (file) => {
  const picture = document.createElement('img');
  picture.style.width = '70px';
  picture.style.height = '70px';
  picture.style.borderRadius = '5px';
  picture.classList.add('remove_on_reset');
  picture.setAttribute('src', `${URL.createObjectURL(file)}`);
  return picture;
};

const fileUploadHandler = (fileUploader, previewContainer) => {

  const hasImgTag = previewContainer.children.length;

  fileUploader.addEventListener('change', () => {
    const file = fileUploader.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const imgTag = previewContainer.children;
      if (hasImgTag) {
        imgTag[0].hidden = true;
        previewContainer.style.padding = '0';
      }
      previewContainer.insertAdjacentElement('afterbegin',createImageTag(file));

      form.addEventListener('reset', () => {
        previewContainer.querySelector('.remove_on_reset').remove();
        fileUploader.value = '';
        if (hasImgTag) {
          imgTag[0].hidden = false;
          previewContainer.style.padding = '0 15px';
        }
      });
    }
  });
};

fileUploadHandler(userAvatarInput, userAvatarContainer);
fileUploadHandler(lodgingPhotoInput, lodgingPhotoContainer);
