# Get Home Safe

## About this project

GetHomeSafe is a comprehensive and user-friendly mobile app that helps individuals arrive at their destination safely. Built using React-Native, Express and MongoDB, this app offers a wide range of features to ensure a safe journey.

Users can easily sign up and log in to access the app's features, including adding and deleting emergency contacts, receiving push notifications, and getting in touch with emergency contacts directly from the app. The app uses Google Maps API to calculate journey times, which dictate the timer that runs in the background. If a user encounters any problems along the way, they can easily trigger the SOS button, sending a notification to their emergency contacts with their location and phone number.

Once the user arrives safely at their destination, they can click the "Home" button to notify their emergency contacts. In case the user fails to reach their destination within the expected time, they will receive a push notification reminding them to click the "Home Safe" button and if that isn't clicked within 1 minute their emergency contacts will be notified that they did not get home safely, they will then recieve a notification with the users current location and phone number.

For added convenience, users can also adjust their walking speed and change their password or delete their account. GetHomeSafe was built from scratch in just one week and a half as the final project of the Makers Bootcamp.

## Learnings from this project
Through creating this app in a group environment, I improved my ability to:
- Work and communicate effectively within a software development team
- Break down projects into tasks and assign them to pairs
- Use agile ceremonies to organise work into sprints and improve processes
- Use a developer workflow to plan, implement and peer-review features
- Build fullstack web applications using React-Native and Express
- Implement user authentication using bcrypt
- Set up push notifications with native-notify
- Learned to integrate and use Google Maps APIs

## Installation
- Clone this repository to your local machine
- Navigate to both the api folder and frontend folder with ``cd api`` and ``cd frontend`` and run ``npm install`` in both.

## How to run
- You will need to create a .env file in the api folder and populate it with:
```
MONGO_URI= [link to mongo db here]
TEST= [link to test db here]
PORT=8080
JWT_SECRET=SUPER_SECRET
```
- Navigate to both the api folder and frontend folder with ``cd api`` and ``cd frontend`` and run ``npm start`` in both.
- If you'd like to run the app on your phone you must download Expo Go and scan the QR code in the frontend terminal - you would also have to change any localhost within fetch requests to your IP address.
- ``Jest`` in the api folder to run the backend tests

## Video Demo

https://user-images.githubusercontent.com/106770545/218480451-755731f2-e6ce-4dc0-b4d0-755ef936bf3d.mp4


