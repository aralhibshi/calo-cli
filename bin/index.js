#!/usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require("yargs")
const axios = require('axios')

const options = yargs
    .usage("Usage: -topics <name>")
    .option("t", { alias: "topics", describe: "Topic for API", type: "string", demandOption: true })
    .option('o', {alias: 'orientation', describe: "Orientation for API", type: 'string', demandOption: true})
    .argv

const greeting = chalk.white.bold('Fetching ')

const boxenOptions = {
    borderStyle: "round",
    borderColor: "red",
}

const message = boxen(greeting + options.orientation + options.topics, boxenOptions)

// Unsplash API
axios({
    method: 'get',
    url: `https://api.unsplash.com/photos/random?client_id=37D9BsnU_1ahCimTYclz0avae5YYabiQaORYheTC4wU&client_secret=_EDr8nUS2Z96_nf--bFj_HSEWMwSbpiu7hDF2Rg4nLM&count=1&topics=${options.topics}&orientation=${options.orientation}`
})
.then(res => {
    console.log(res.data[0].urls.full)

    async function saveImage(src, name) {
        const imgSrc = await fetch(src)
        const blob = await imgSrc.blob()
    }

    saveImage(res.data[0].urls.full, 'image.png')
})
.catch(err => {
    console.log(err)
    console.log('Error Fetching API Data')
})

console.log(message);