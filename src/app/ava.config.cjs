const path = require("path");


module.exports = ({projectDir}) => {
	return {
		"files": [
			"./test/dist/**/*"
		],
		"environmentVariables": {},
		"verbose": true,
        "require": [
			"./test/loaders/_setup-browser-env.js"
		]
	}
}
