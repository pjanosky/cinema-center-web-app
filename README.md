# Cinema Center

A web app for move fanatics and professional critics. This project was created as a part of CS4550 at Northeastern University.

Allows users to review and bookmark movies, and allows professionals to create curated lists of recommended movies. Implemented with React, Bootstrap, and Redux. The backend is RESTful API written in TypeScript and implemented with, Express, MongoDB, and Node.js. Implements responsive design to support desktop and mobile.

## Resources

See a live demo at [pjanosky-cinema-center.netlify.app](https://pjanosky-cinema-center.netlify.app)

The source code is available on at [github.com/pjanosky/cinema-center-web-app](https://github.com/pjanosky/cinema-center-web-app).

The backend repository can be found at [github.com/pjanosky/cinema-center-server](https://github.com/pjanosky/cinema-center-server)

## Features

### Accounts and Login

Users can register for an account and log into the site for personalized content. There are two types of users: watchers and editors, Watcher users can follower other users to stay up to date with their activity. The profile page shows all relevant information and allows users to edit their account details. Session information is preserved with a cookie.

### Search

Users can search for movies, other users, and lists. Selecting a movie result shows the detail page with in-depth information about the movie. The detail page also provides logged-in users with options to interact with the movie (see below).

### Reviews

Watchers can leave reviews for movies they seen including a rating, title, and description. They can like other user's reviews. A list of reviews and likes is visible on a user's profile page. Reviews from users they are following are visible on the home page.

### Lists

Editors can create curated watch lists for watchers. Lists can be created on the list page under the current user's profile. After a list is created, editors can add movies and descriptions from the details page. Recent lists show up on the home page for all users to provide timely recommendations for what movies to watch.

## Data Model

![UML Diagram](/images/cinema-center-uml-diagram.jpeg)

## Running the Project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
