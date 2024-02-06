![sportlinq Logo](/mobile/assets/github/logoGithub.png)

![Static Badge](https://img.shields.io/badge/React-%237D8DF6?style=flat-square&logo=react&logoColor=white)
![Static Badge](https://img.shields.io/badge/Typescript-%237D8DF6?style=flat-square&logo=Typescript&logoColor=white)
![Static Badge](https://img.shields.io/badge/Expo-%237D8DF6?style=flat-square&logo=expo&logoColor=white)
![Static Badge](https://img.shields.io/badge/Node.js-%237D8DF6?style=flat-square&logo=Node.js&logoColor=white)
![Static Badge](https://img.shields.io/badge/MySQL-%237D8DF6?style=flat-square&logo=mysql&logoColor=white)





# sportlinqApp

### App Objective
Arranging a meeting with someone may not always proceed smoothly. Additionally, as an athlete, you might want to explore new places to stay motivated. To address this issue, the Sportlinq application was created to function as a **sports planning app**. This app is designed to facilitate easier coordination between people, offering a variety of locations to choose from, with the primary goal of encouraging people to move more!

The following functionalities are included in the app:
* Personal account
* Tracking of sports sessions
* Sending invitations
* Selection of various locations
* Google Maps display
* Adding new friends
* Friends' activity
* Write reviews

### App images
![app screenshot](/mobile/assets/github/screenshot1.png)

![app screenshot](/mobile/assets/github/screenshot2.png)

### How To Use
To clone and run this application, you'll need to have Node.js (npm) installed on your computer.  
From your command line:

```
# Clone this repository
$ git clone https://github.com/luisavelino8/sportlinqApp

# Install dependencies - server file
$ cd sportlinqApp/server
$ npm install

# Install dependencies - mobile file
$ cd sportlinqApp/mobile
$ npm install

# Install the Expo Go app on your mobile device

# Run the app (both files)
$ cd sportlinqApp/server
$ npm start
-
$ cd sportlinqApp/mobile
$ npx expo start

# Scan the QR code displayed inside the terminal using your mobile device to open the app with Expo Go.  
(Reminder: Ensure that both the mobile device and computer are connected to the same Wi-Fi network.)
```

### Developer instructions
```
# Clone this repository
$ git clone https://github.com/luisavelino8/sportlinqApp

# Install dependencies - server file
$ cd sportlinqApp/server
$ npm install

# Install dependencies - mobile file
$ cd sportlinqApp/mobile
$ npm install

# (Optional) Download Xcode IDE (or Android Studio) and add a simulator device 

# Set up your own local database using the server/models folder as a reference

# Modify the database connection inside server/utils/database.js

# Run the app (both files)
$ cd sportlinqApp/server
$ npm start
-
$ cd sportlinqApp/mobile
$ npx expo start

# You have the option to open the app using Expo Go, a simulator or the web version
```

### Known issues
| Issue | Explanation |
| --------------------- | --------------------- |
| Invitations in the web version | The utilized Datepick components are not supported in the web version.|
| Maps function in the web version | The utilized Maps function is not supported in the web version and causes the app to crash. |

