var getLocation, findNearbyClasses;

getLocation = function (delegate) {
  'use strict';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(delegate);
  }
};

findNearbyClasses = function (/* lat, long, radius */) {
  'use strict';

  // return array of classes
};
