require('dotenv/config')

const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const uuid = require('uuid/v4')

const app = express()
const port = 3000

const s3 = new AWS.S3({
    accessKeyId: 'AKIAUKXFWT56IZI7RBUR',
    secretAccessKey: '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',
    region: 'eu-central-1',
    httpOptions: {
        timeout: 900000,
    }
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

app.post('/upload',upload,(req, res) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    console.log(myFile)
    const params = {
        Bucket: 'yarininsuyu.com',
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})

app.listen(port, () => {
    console.log(`Server is up at ${port}`)
})