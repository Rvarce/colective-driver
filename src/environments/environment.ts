// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  getConductor: 'https://southamerica-east1-colective-api.cloudfunctions.net/api/colectivos/getConductor/'
};

export const firebaseConfig = {
  apiKey: "AIzaSyBQJB6yhI9uQfxZ26tDnrJPku3CTik4ZrU",
  authDomain: "colective-api.firebaseapp.com",
  databaseURL: "https://colective-api.firebaseio.com",
  projectId: "colective-api",
  storageBucket: "colective-api.appspot.com",
  messagingSenderId: "867773192940",
  appId: "1:867773192940:web:fe5854a31f604e837623c9",
  measurementId: "G-QZT4R7NVN8"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
