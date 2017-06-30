/* global getLocation findNearbyClasses createClassCard */

(function app() {
  'use strict';
  var fetch24HoursFitnessClass, formatClassObject, availableClubs, getClubMeta, constructClassesObject, allClassesDetails = [], promiseUtilityMethod, millisToMinutesAndSeconds, userLocation, bindEvents, listClassesForZip, classesLoadedEvent, classListSection;
  const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

  fetch24HoursFitnessClass = function (zipCode) {
    const url = 'https://www.24hourfitness.com/ClubInformation/rest/v1/Gyms?location=' + zipCode;
    var clubClasses = [];

    fetch(corsApiUrl + url,
      { method: 'get' }).then(function (response) {
        return response.json();
      }).then(function (data) {
        availableClubs = data.groupClubs[0].clubs;
        availableClubs.forEach(function (club) {
          clubClasses.push(getClubMeta(club));
        });

        return clubClasses;
      })
      .then(function (clubs) {
        clubs.forEach(function (clubObj) {
          fetch(corsApiUrl + 'https://schedule.24hourfitness.com/_services/Calendar/getClasses?clubid=' + clubObj.ClubNumber + '&startdate=' + '6/30/2017', { method: 'get' }).then(function (response) {
            return constructClassesObject(response.json(), clubObj);
          });
        });
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
  };

  listClassesForZip = function () {
    console.log(allClassesDetails);
    createClassCard(allClassesDetails);
    classListSection.removeEventListener('classesLoaded', listClassesForZip, false);
  };

  promiseUtilityMethod = function (clubObj, data) {
    var today = new Date().getDay();
    data.forEach(function (classInfo) {
      var parsedClassObj = formatClassObject(classInfo, clubObj);
      if (today === new Date(parsedClassObj.Class.StartTime).getDay()) {
        allClassesDetails.push(parsedClassObj);
      }
    });
    classListSection.dispatchEvent(classesLoadedEvent);
  };

  constructClassesObject = function (classesPromise, clubObj) {
    classesPromise.then(promiseUtilityMethod.bind(null, clubObj));
  };

  getClubMeta = function (club) {
    return {
      'Name': club.clubName,
      'Street': club.clubAddressStreet,
      'City': club.clubAddressCity,
      'State': club.clubAddressState,
      'Zip': club.clubAddressZip,
      'Phone': club.clubPhoneNumber,
      'Latitude': club.clubAddressLatitude,
      'Longitude': club.clubAddressLongitude,
      'ClubNumber': club.clubNumber,
    };
  };

  formatClassObject = function (data, clubObj) {
    return {
      'Location': {
        'Name': clubObj.Name,
        'Address': {
          'Street': clubObj.Street,
          'City': clubObj.City,
          'State': clubObj.State,
          'Zip': clubObj.Zip,
          'Phone': clubObj.Phone,
          'Latitude': clubObj.Latitude,
          'Longitude': clubObj.Longitude,
        },
      },
      'Class': {
        'Name': data.ClassName,
        'StartTime': data.StartTime,
        'Duration': millisToMinutesAndSeconds(new Date(data.EndTime) - new Date(data.StartTime)),
        'Description': data.Description,
        'Type': data.Category,
      },
    };
  };

  millisToMinutesAndSeconds = function (millis) {
    var minutes = Math.floor(millis / 60000);

    return minutes;
  };

  bindEvents = function () {
    var searchInput = document.querySelector('.search-field'),
        mapButton = document.querySelector('.button--map'),
        listButton = document.querySelector('.button--list');

    searchInput.addEventListener('keypress', function (e) {
      var zipcode;
      if (event.keyCode === 13) {
        zipcode = e.target.value;

        // add validation
        fetch24HoursFitnessClass(zipcode);
      }
    });

    mapButton.addEventListener('click', function () {
      var zipcode = searchInput.value;
      console.log('Loading map for zip: ' + zipcode);
    });

    listButton.addEventListener('click', function () {
      var zipcode = searchInput.value;
      fetch24HoursFitnessClass(zipcode);
    });

    classesLoadedEvent = new Event('classesLoaded');
    classListSection = document.querySelector('.class-list');
    classListSection.addEventListener('classesLoaded', listClassesForZip);
  };

  window.addEventListener('DOMContentLoaded', function appDCL() {
    // add some kind of loading animation? it takes a few seconds to grab the location
    bindEvents();

    getLocation(function (location) {
      var searchInput = document.querySelector('.search-field'),
          googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

      if (location) {
        userLocation = {
          'latitude': location.coords.latitude,
          'longitude': location.coords.longitude,
        };

        fetch(corsApiUrl + googleUrl + userLocation.latitude + ',' + userLocation.longitude).then(function (response) {
          return response.json();
        }).then(function (browserLoc) {
          if (browserLoc.results.length > 0) {
            browserLoc.results[0].address_components.forEach(function (addressField) {
              if (addressField.types[0] === 'postal_code') {
                console.log(addressField.long_name);    // this will log the zipcode.
                searchInput.value = addressField.long_name;
                fetch24HoursFitnessClass(addressField.long_name);
              }
            });
          }
        });
      }
      else {

        // show empty homepage, default focus to search bar for zipcode

      }
    });
  });
}());
