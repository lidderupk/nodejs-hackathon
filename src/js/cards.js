var createClassCard = function createClassCard(classes) {
  'use strict';
  var classListSection,
      i,
      resultCard,
      cardImg,
      cardDetail,
      classDetail,
      classTitle,
      classTime,
      gymDetail,
      gymTitle,
      classDuration,
      address,
      addressText,
      mapLink,
      divider,
      classDesc,
      reminderDiv,
      reminderLink;

  classListSection = document.querySelector('.class-list');

  for (i = 0; i < 20; i++) {
    // create class html
    resultCard = document.createElement('div');
    resultCard.className = 'result-card';

    cardImg = document.createElement('img');
    cardImg.className = 'card-img';
    cardImg.setAttribute('src', 'http://clubsolutionsmagazine.com/wp-content/uploads/2017/05/Southglenn-Gym-Centennial-Colorado.-620x400.png');
    resultCard.appendChild(cardImg);

    cardDetail = document.createElement('div');
    cardDetail.className = 'card-detail';

    classDetail = document.createElement('div');
    classDetail.className = 'card-flex';

    classTitle = document.createElement('h3');
    classTitle.className = 'class-title heading';
    classTitle.textContent = classes[i].Class.Name;
    classTitle.setAttribute('alt', classes[i].Class.Name);
    classDetail.appendChild(classTitle);

    classTime = document.createElement('div');
    classTime.className = 'class-time heading';
    classTime.textContent = new Date(classes[i].Class.StartTime).toLocaleTimeString();
    classDetail.appendChild(classTime);

    cardDetail.appendChild(classDetail);

    gymDetail = document.createElement('div');
    gymDetail.className = 'card-flex';

    gymTitle = document.createElement('h4');
    gymTitle.className = 'gym heading-2';
    gymTitle.textContent = classes[i].Location.Name;
    gymDetail.appendChild(gymTitle);

    classDuration = document.createElement('h4');
    classDuration.className = 'duration heading-2';
    classDuration.textContent = classes[i].Class.Duration + ' minutes';
    gymDetail.appendChild(classDuration);

    cardDetail.appendChild(gymDetail);

    address = document.createElement('div');
    address.className = 'card-flex';

    addressText = document.createElement('h4');
    addressText.className = 'address heading-2';
    addressText.innerHTML = classes[i].Location.Address.Street + '<br>' +
                            classes[i].Location.Address.City + ', ' +
                            classes[i].Location.Address.State + ' ' +
                            classes[i].Location.Address.Zip;
    address.appendChild(addressText);

    mapLink = document.createElement('a');
    mapLink.className = 'card-map-button w-button';
    mapLink.setAttribute('href', '#');
    mapLink.textContent = 'Map';
    address.appendChild(mapLink);

    cardDetail.appendChild(address);
    resultCard.appendChild(cardDetail);

    divider = document.createElement('div');
    divider.className = 'divider';
    resultCard.appendChild(divider);

    classDesc = document.createElement('p');
    classDesc.className = 'class-description';
    classDesc.textContent = classes[i].Class.Description;
    resultCard.appendChild(classDesc);

    reminderDiv = document.createElement('div');
    reminderDiv.className = 'card-button-flex';

    reminderLink = document.createElement('a');
    reminderLink.className = 'reminder w-button';
    reminderLink.setAttribute('href', '#');
    reminderLink.textContent = 'Set a Reminder';
    reminderDiv.appendChild(reminderLink);
    resultCard.appendChild(reminderDiv);

    classListSection.appendChild(resultCard);
  }
};
