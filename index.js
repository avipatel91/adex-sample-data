var argv = require('minimist')(process.argv.slice(2))



var CLICK_EV_RATIO = 0.05 // 5% of users will register a 'click' event
var LEAVE_EV_RATIO = 0.8 // 80% of users will register a 'leave' event

function getUserStayTime()
{
	// 2 seconds minimum stay
	// 3 minutes max stay
	// To the power of 2, to make it lean more towards the low values
	return 2 + Math.floor(Math.pow(Math.random(), 2) * 180)
}
