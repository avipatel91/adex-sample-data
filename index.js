var argv = require('minimist')(process.argv.slice(2))



var CLICK_EV_RATIO = 0.05 // 5% of users will register a 'click' event
var LEAVE_EV_RATIO = 0.8 // 80% of users will register a 'leave' event

function getUserStayTime()
{
	// 2 seconds minimum stay
	// 3 minutes max stay
	// To the power of 2, to make it lean more towards the low values
	var rand = Math.random()
	var maximum = 180
	var minimum = 2
	// power law distribution
	return Math.floor(Math.exp(rand*Math.log(maximum-minimum+1)))+minimum
}

// test power law distribution
//for(var i=0; i!=100; i++)console.log(getUserStayTime())
