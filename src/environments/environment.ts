// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  localStorage: 'rtl',
  server: 'UAT',
  apiUrl: 'http://test.rtl.com.au:8080',
  socketApiUrl: 'http://test.rtl.com.au:8081',
  fileBaseUrl: 'http://localhost:8080/',
  imageUrl: 'http://localhost:8080/uploads/',
  orgId: "ab905406-79a3-4e54-8244-d79fc0e60937"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
