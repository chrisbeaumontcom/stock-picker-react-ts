## Stock picking web app for an apparel wholesaler

[![Image of app](https://res.cloudinary.com/web-school/image/upload/w_600,q_auto:best/dev/App-React-screen-sm_yztp5p.jpg)](https://example-stock-picker.chrisbeaumont.com/)

This version is Vite / React + Typescript but was originally written as a simple in-page Vue JS script to add to a legacy ASP.NET C# / Razor wholesale catalogue site.

The previous version was plain React Javascript.

When a particular product page loads, the script picks up the style id and calls a rest api to load the current stock levels and account details of the logged in user reseller.

Session storage saves an array of lineitems accumulated across product pages.

The checkout page is not added to this repo yet. It reads the stored order list and displays user data for the user to save a purchase order to the server.

Here's an [example demo page](https://example-stock-picker.chrisbeaumont.com/).

Next step: write for Preact to reduce bundle size.
