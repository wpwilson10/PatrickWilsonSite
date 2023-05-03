# Setup
## Building Project
1. Run "npm run dev" to build app in development mode or "npm run prd" to run in production mode.
2. Move files from /client/dist to /server/web. The server will be looking for files here to serve to users.

## Initial Project Setup
The client directory was created using npx create-react-app name-of-app --template typescript
[Reference](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)

The tsconfig.json file was edited to match more closely to the Airbnb style guide.

Webpack is used to compile the project instead of npm create react app for more visibility and configurability into the process. Setup based on [Webpack's Getting Started](https://webpack.js.org/guides/getting-started/) and [Webpack's Typescript](https://webpack.js.org/guides/typescript/) and [Webpack's Production](https://webpack.js.org/guides/production/).

# Configuration
The below items should be updated.
- webpack.common.js
    - title
- Index.html
    - Meta tages for Author and Description
- Favicons and site.webmanifest
    - Files live in /public
    - Examples created using [favicon.io](https://favicon.io/favicon-converter/)
- Profile image
    - Hard coded to /src/images/profile.jpg
- Contact Info
    - Links to various social medias and communication options
    - GITHUB_LINK, LINKEDIN_LINK, EMAIL_ADDRESS in .env files
- reCAPTCHA site key
    - Spam protection. [Sign up here](https://developers.google.com/recaptcha)
    - RECAPTCHA_SITE_KEY in .env files
The below items may be updated if desired.
- APIs
    - CONTACT_FORM_API, PRODUCT_API, ERROR_API, CHECKOUT_API in .env files
    - these should match the routes from the server file
