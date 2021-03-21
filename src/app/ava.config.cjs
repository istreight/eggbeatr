const path = require("path");


module.exports = ({projectDir}) => {
	// /Users/isaacstreight/Documents/lesson_calendar/eggbeatr/src/test

	return {
		"files": [
			"./test/dist/**/*"
		],
		"environmentVariables": {},
		"verbose": true
	}
}
