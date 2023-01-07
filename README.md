## To build APK:
`eas build -p android --profile preview`
## API url for development
In order to use `http://localhost:8080` as API url, we must run `adb -s <device-name> reverse tcp:8080 tcp:8080`, and our API must be on port **`8080`**. For more info, check this question: [React Native Android Fetch failing on connection to local API](https://stackoverflow.com/questions/33704130/react-native-android-fetch-failing-on-connection-to-local-api).

Right now, we can't reverse port **80**, so use port **8080**.

We can either use default `http://localhost:8080`, which is set on `app.config.js` when no `process.env.API_URL` is found
, or set a custom url `API_URL` on `.env` file. However, setting any values in `.env` file won't be applied on EAS build, meaning every time we build with EAS and a `APP_ENV` set as *`development`*, `API_URL` will be `http://localhost:8080`.