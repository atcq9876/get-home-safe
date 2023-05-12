# Get Home Safe

## About this project

GetHomeSafe is a comprehensive and user-friendly mobile app that helps people to arrive at their destination safely. It was built using React Native, Node, Express and MongoDB.

Users can easily sign up and log in to access the app's features, including adding and deleting emergency contacts, receiving push notifications, and getting in touch with emergency contacts directly from the app. The app uses the Google Maps API to calculate journey times, connecting to the timer that runs in the background. If a user encounters any problems during their journey, they can easily trigger the SOS button, sending a notification to their emergency contacts with their location and phone number.

Once the user arrives safely at their destination, they can click the "Home" button to notify their emergency contacts. In case the user fails to reach their destination within the expected time, they will receive a push notification reminding them to click the "Home Safe" button and if that isn't clicked within 1 minute, their emergency contacts will be notified that they did not get home safely including the user's current location and phone number.

Users can also adjust their walking speed, change their password and delete their account. GetHomeSafe was built from scratch in just 8 working days as the final project of the Makers Software Engineering Bootcamp.

## Learnings from this project
Through creating this app in a group environment, I improved my ability to:
- Work and communicate effectively within a software development team
- Break down projects into tasks and assign them to pairs
- Use agile ceremonies to organise work into sprints and improve processes
- Use a developer workflow to plan, implement and peer-review features
- Build fullstack web applications using React Native, Node, Express and MongoDB
- Implement user authentication using bcrypt
- Set up push notifications with native-notify
- Integrate and use the Google Maps APIs

## Installation
- Clone this repository to your local machine
- Navigate to both the api folder and frontend folder with ``cd api`` and ``cd frontend`` and run ``npm install`` in both.

## How to run
- You will need to need to set up a development database with MongoDB Atlas and a local test database, then create a .env file in the api folder and populate it with:
```
MONGO_URI=[link to mongo db here]
TEST=[link to test db here]
PORT=8080
JWT_SECRET=SUPER_SECRET
```
- Navigate to both the api folder and frontend folder with ``cd api`` and ``cd frontend`` and run ``npm start`` in both to run the servers.
- If you'd like to run the app on your phone you'll need to download Expo Go and scan the QR code in the frontend terminal - you would also have to change any localhost within fetch requests to your IP address.
- Enter ``jest`` in the api folder to run the backend tests.

## Video Demo

https://user-images.githubusercontent.com/106770545/218480451-755731f2-e6ce-4dc0-b4d0-755ef936bf3d.mp4


