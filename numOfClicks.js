#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var fs = require('fs')

var BID_ID = 42
var ADUNIT_ID = 43

var CLICK_EV_RATIO = 0.05 // 5% of users will register a 'click' event
var LEAVE_EV_RATIO = 0.8 // 80% of users will register a 'leave' event
var filename = null

var TOTAL_TIME = 30 * 60

function getUserStayTime()
{
	// 2 seconds minimum stay
	// 3 minutes max stay
	// To the power of 2, to make it lean more towards the low values
	var rand = Math.random()
	var maximum = 180
	var minimum = 2
	// power law distribution
	return Math.floor((Math.exp(rand*Math.log(maximum-minimum+1))+minimum) * 1000)
}

// test power law distribution
//for(var i=0; i!=100; i++)console.log(getUserStayTime())

var clicks = argv._[0]
if (isNaN(clicks)) {
	console.log('usage: ./genSample <num of clicks>'
		+ ' [--totalTime=<total time in seconds>]'
		+ ' [--clickChance=<floating point of chance to click>]'
		+ ' [--filename=<name of file to write to>]')
	process.exit(1)
}

if (argv.totalTime) TOTAL_TIME = argv.totalTime
if (argv.clickChance) CLICK_EV_RATIO = parseFloat(argv.clickChance)
if (argv.filename) filename = argv.filename

var uid = 0
var dataset = []

for (uid = 0 ; true; uid++) {
	var udataset = []

	var stayTime = getUserStayTime()

	var willClick = Math.random() < CLICK_EV_RATIO
	var willRegLeave = Math.random() < LEAVE_EV_RATIO

	// we pray for uniform distribution.
	var whenStart = new Date(Date.now() + Math.floor( Math.random() * TOTAL_TIME*1000 ) )
	var whenLoad = new Date(whenStart.getTime() - Math.floor(300*Math.random()) )
	var whenClick = new Date(whenStart.getTime() + Math.floor(stayTime * Math.random()) ) // inaccurate, but let's roll with it
	var whenLeave = new Date(whenStart.getTime() + stayTime)

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

dataset = dataset.sort(function(a,b) { return a.time - b.time })

if (filename) {
	fs.writeFile(filename, JSON.stringify(dataset, null, 4), e => {
		if (e) throw e
	})
} else {
	console.log(JSON.stringify(dataset, null, 4))
}
