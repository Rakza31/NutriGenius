# wolfram-alpha-node
A JavaScript library for interfacing with the Wolfram Alpha API
<br>
Email me at gpsanant@gmail.com if you have questions.

# Installation
```js script
npm i wolfram-alpha-node
```

# Example Usage
```js script
const WolframAlphaAPI = require('wolfram-alpha-node');
const waApi = WolframAlphaAPI("your app id");
(async() => {
    try{
        console.log(await waApi.getFull('what is the parity of sine of x'))
        console.log(await waApi.getShort("who was the 16th president?"))
        console.log(await waApi.getSpoken("what is 2 plus 2"))
    }catch(e){
        console.log(e.message)
    }
})()
```
# Test
```js script
npm test "your app id"
```
