Since we are currently supporting only IOS version of the app, this document will guide you to run demo on MacOS. If you are developing on a windows machine, please use virtual machine for MacOS instead.

## Install Node.js
Make sure you have node 10+ installed. If not, see the following instructions: 


#### Install nvm
NVM (Node Version Manager) allows you to install Node without root permissions and also allows you to install many versions of Node.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

#### Verify nvm installation
To verify that nvm has been installed, run:
```
command -v nvm
``` 
which should output 'nvm' if the installation was successful. 

#### Install Node.js via NVM
```
nvm install node
```

#### Verify Node and npm installation
npm is a tool installed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer.
```
node -v
npm -v
```
which should output the version of node and npm on your mac if the installation was successful. 


## Intall Expo CLI
Expo CLI is a local development tool for developing React Native apps with Expo SDK. The Expo SDK is a set of libraries written natively for each platform which provides access to the device's system functionality (things like the camera, push notifications, contacts, local storage, and other hardware and operating system APIs) from JavaScript. <br>
You can install Expo CLI by running:
```
npm install -g expo-cli
```

## Install Xcode
We will be using the latest version of Apple’s **Xcode 10** to run our demo in Xcode’s built in iOS simulator. <br>
Xcode is an Integrated Development Environment (IDE) developed by Apple and the vast majority of iOS developers rely on it for making iPhone or iPad applications. Xcode 10 can only be installed on a Mac running **macOS 10.13.4 (High Sierra)** or above.

#### Check OS version
To check your current OS version, go to the apple icon at the top left of your Mac → About This Mac. <br>
Check that your OS is either **High Sierra 10.13.4** or above or **Mojave 10.14.x** If your version is lower than this, you will need to update your operating system. Have a look on Apple’s website for instructions on how to do so.

#### Install Xcode in App Store
Once you’re sure you are running the correct version of the mac operating system, you can get started with downloading Xcode 10 through the Mac App Store. <br>
Open the **App Store** on your Mac and then search for **Xcode**. Then just click the “Get” or “Download” button and start the installation process.

## Download Expo Mobile Client for IOS
Another way to run the demo is to use the Expo client app on your iOS device. <br>
Click [here](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8) to download the latest Expo client app to your iOS device.

## Run our demo
Now navigate to the demo folder that must be contain package.json file and run the demo:
```
cd demo
expo start
```
You should see a QR code generated in the web browser, then there are two ways to simulate the app:

#### Using IOS simulator
Click **run on ios simulator** shown on the prompted web browswer, then the Xcode’s built in iOS simulator will be running the demo on your Mac.

#### Using Expo client app
With iOS 11 or above, open up your camera app, then scan the QR code in our terminal until a notification badge pops on top telling us that we can open it in Expo client.<br>

However, if you’re not in iOS 11, there’s still an alternative way but not with scanning:
— Open your Expo client app and sign up/login.
— Open another new tab in your terminal and navigate to your react-native project directory and run.
```
cd demo
expo send -s emailyou@usedinexpo.com
```
This will send an email to you with the link, clicking this link will open the app in expo. Then it’ll have your project up and running on your iPhone.
