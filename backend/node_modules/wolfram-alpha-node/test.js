const WolframAlphaAPI = require('./waApi');
const waApi = WolframAlphaAPI(process.argv[2].toString());
(async() => {
    try{
        console.log(await waApi.getFull('what is the parity of sine of x'))
        console.log(await waApi.getShort("who was the 16th president?"))
        console.log(await waApi.getSpoken("what is 2 plus 2"))
    }catch(e){
        console.log(e.message)
    }
})()

