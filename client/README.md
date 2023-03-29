WPW

-   client folder created using npx create-react-app name-of-app --template typescript
    -- https://react-typescript-cheatsheet.netlify.app/docs/basic/setup

-   tsconfig.json was edited to match more closely to the Airbnb style guide

-   Webpack used to compile the project instead of npm create react app stuff
    -- https://webpack.js.org/guides/getting-started/ and https://webpack.js.org/guides/typescript/ and https://webpack.js.org/guides/production/
    -- use "npm run dev" to build app in development mode and "npm run prd" to run in production mode.

Configuration

-   Profile image
    -- Hard coded to /src/images/profile.jpg
-   Contact Info
    -- email, github, linkedin, etc
    -- GITHUB_LINK, LINKEDIN_LINK, EMAIL_ADDRESS
-   reCAPTCHA site key
    -- used in contactFormRecaptcha
    -- configured in .env
    -- RECAPTCHA_SITE_KEY
-   Contact Form API
    -- used in contactFormService.tsx
    -- configured in .env
    -- CONTACT_FORM_API
-   Project name
    -- webpack.config.js
