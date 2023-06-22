#!/usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require("yargs")
const axios = require('axios')
const request = require('request')
const fs = require('fs')

const options = yargs
    .usage("Usage: -topics <name>")
    .option("t", { alias: "topics", describe: "Topic for API", type: "string", demandOption: true })
    .option('o', {alias: 'orientation', describe: "Orientation for API", type: 'string', demandOption: true})
    .argv

const boxenOptions = {
    borderStyle: "round",
    borderColor: "red",
}

const greeting = chalk.white.bold('Fetching Image with ')
const msg = {
    topics: `Topic(s) = ${options.topics}, `,
    orientation: `Orientation = ${options.orientation}`,
}

const message = boxen(greeting + msg.topics + msg.orientation, boxenOptions)
console.log(message)

// Unsplash API
axios({
    method: 'get',
    url: `https://api.unsplash.com/photos/random?client_id=37D9BsnU_1ahCimTYclz0avae5YYabiQaORYheTC4wU&client_secret=_EDr8nUS2Z96_nf--bFj_HSEWMwSbpiu7hDF2Rg4nLM&count=1&topics=${options.topics}&orientation=${options.orientation}`
})
.then(res => {
    const imageURL = res.data[0].urls.full
    console.log('Response: ', imageURL)

    const outputFolder = 'images'
    let counter = 0

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder)
    } else {

    // Get List of Files in Folder and Find Highest Counter Number
    const files = fs.readdirSync(outputFolder)

    files.forEach(file => {
        const fileName = file.split('.')[0]
        const fileCounter = fileName.split('-').pop()
        if (!isNaN(fileCounter)) {
        if (Number(fileCounter) >= counter) {
            counter = Number(fileCounter) + 1
        }
        }
    })
    }

    // Download Image
    request.get(imageURL, {encoding: 'binary'}, (error, res, body) => {
        if (!error && res.statusCode == 200) {

            // Extract Fle Extension from 'Content-Type' Header
            const contentType = res.headers['content-type']
            const fileExtension = contentType.split('/').pop()

            // Save Image with Unique Name
            let outputFilename = `image-${counter}.${fileExtension}`

            while (fs.existsSync(`${outputFolder}/${outputFilename}`)) {
                counter++
                outputFilename = `your-image-${counter}.${fileExtension}`
            }
            fs.writeFile(`${outputFolder}/${outputFilename}`, body, 'binary', (err) => {  
                if (err) throw err
                console.log(`Image saved as ${outputFilename}`)
            })
        }
    })
})
.catch(err => {
    console.log(err)
})