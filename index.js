const request = require("request");
const cheerio = require('cheerio');
const process = require('process');
const mpvPlay = require('mpv-play')
//require puppeteer
const puppeteer = require('puppeteer');

const searchInvidious = async (searchTerm) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let st = searchTerm.replaceAll(' ', "+");
    await page.goto(`https://vid.puffyan.us/search?q=${st}`);
    await new Promise(r => setTimeout(r, 2000));
    let result = await page.evaluate(searchTerm => {
        var parent = document.getElementsByClassName('h-box')[2]
        var childs = parent.childNodes;
        return childs[1].href;
    }, searchTerm);
    result = await result.replaceAll('https://vid.puffyan.us', 'https://youtube.com')
    await browser.close();
    return result;
}

//let the user input a search term
async function searchInput() {
let searchTerm = String(process.argv[2]);
if (searchTerm == "undefined" || searchTerm == "" || searchTerm == " ") {
    console.log("Please enter a search term");
} else {
    console.log("OK, searching for: " + searchTerm);
    let url = await searchInvidious(searchTerm);
    console.log(url)
    mpvPlay(url)
}
}
searchInput()
