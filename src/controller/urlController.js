const validUrl = require('valid-url');
const shortid = require('shortid')
const urlModel = require('../model/UrlModel')


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
    if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const createurl = async function (req, res) {

    try {
        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide URL details' })
            return
        }
        if (!isValid(req.body.longUrl)) {
            return res.status(400).send({ status: false, message: ' Please provide LONG URL' })
        }

        const longUrl = req.body.longUrl.trim()

        if (!(validUrl.isUri(longUrl))) {
            return res.status(400).send({ status: false, msg: "longurl is not valid" })
        }

        const baseUrl = 'http://localhost:3000'

        //---GENERATE URLCODE
        let urlCode = shortid.generate().match(/[a-z\A-Z]/g).join("") //---this will give only Alphabet
       
        urlCode = urlCode.toLowerCase()  //lowercase 
        
        let url = await urlModel.findOne({ longUrl })

        if (url) {
            return res.status(200).send({ status: true, "data": url }) //---if already exist
        }
        //---GENERATE DATA BY LONG URL
        const shortUrl = baseUrl + '/' + urlCode
        const urlData = { urlCode, longUrl, shortUrl }//new url 

        const newurl = await urlModel.create(urlData);
        return res.status(201).send({ status: true, msg: `URL created successfully`, data: newurl });
    } catch (err) {
        console.log(err)
        res.status(500).send({  msg: err.message })
    }
}

const geturl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode.trim()
        if (!isValid(urlCode)) {
            res.status(400).send({ status: false, message: 'Please provide valid urlCode' })
        }



        const url = await urlModel.findOne({ urlCode: urlCode })     //check in Db

        if (!url) {
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }
        console.log(url)
        return res.status(302).redirect(url.longUrl)

    } catch (err) {

        res.status(500).send({ msg: err.message })
    }
}


module.exports.createurl = createurl
module.exports.geturl = geturl