#!/usr/bin/env node

let argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')

const BID_ID = 42
const ADUNIT_ID = 43

let click_ev_ratio = 0.05 // 5% of users will register a 'click' event
let leave_ev_ratio = 0.8 // 80% of users will register a 'leave' event
let filename = null;

let total_time = 30 * 60

function writeToFile(dataset) {

}

function getUserStayTime() {
    // 2 seconds minimum stay
    // 3 minutes max stay
    // To the power of 2, to make it lean more towards the low values
    let rand = Math.random()
    let maximum = 180
    let minimum = 2
    // power law distribution
    return Math.floor((Math.exp(rand*Math.log(maximum-minimum+1))+minimum) * 1000)
}

// test power law distribution
//for(var i=0; i!=100; i++)console.log(getUserStayTime())

let clicks = argv._[0]
if (isNaN(clicks)) {
    console.log('usage: ./genSample <num of clicks>'
            + ' [--totalTime=<total time in seconds>]'
            + ' [--clickChance=<floating point of chance to click>]'
            + ' [--filename=<name of file to write to>]')
    process.exit(1)
}

if (argv.totalTime) total_time = argv.totalTime
if (argv.clickChance) click_ev_ratio = parseFloat(argv.clickChance)
if (argv.filename) filename = argv.filename

let uid = 0
let dataset = []

for (uid = 0 ; true; uid++) {
    let udataset = []

    let stayTime = getUserStayTime()

    let willClick = Math.random() < click_ev_ratio
    let willRegLeave = Math.random() < leave_ev_ratio

    // we pray for uniform distribution.
    let whenStart = new Date(Date.now() + Math.floor( Math.random() * total_time*1000 ) )
    let whenLoad = new Date(whenStart.getTime() - Math.floor(300*Math.random()) )
    let whenClick = new Date(whenStart.getTime() + Math.floor(stayTime * Math.random()) ) // inaccurate, but let's roll with it
    let whenLeave = new Date(whenStart.getTime() + stayTime)

    // fill in the dataset
    //udataset.push({ time: whenLoad, type: 'load' })
    udataset.push({ time: whenStart, type: 'impression', uid: uid, adunit: ADUNIT_ID, bid: BID_ID })
    if (willClick) udataset.push({ time: whenClick, type: 'click', uid: uid, adunit: ADUNIT_ID, bid: BID_ID })
    if (willRegLeave) udataset.push({ time: whenLeave, type: 'leave', uid: uid, adunit: ADUNIT_ID, bid: BID_ID })

    // decrement the clicks we're looking for
    if (willClick) clicks--

    // merge with the global dataset
    dataset = dataset.concat(udataset)

    if (clicks === 0) break
}


dataset = dataset.sort((a,b) => a.time - b.time)
if (filename){
    fs.writeFile(filename, JSON.stringify(dataset, null, 4), e => {
        if (e) throw e;
    })
} else {
    console.log(JSON.stringify(dataset, null, 4))
}

