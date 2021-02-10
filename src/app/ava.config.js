export default ({projectDir}) => {
	// /Users/isaacstreight/Documents/lesson_calendar/eggbeatr/src/app

	return {
		"files": [
			"test/**/*",
			"!test/loaders"
		],
		"environmentVariables": {},
		"verbose": true,
		"require": ["@babel/register", "./test/loaders/_register.cjs"]
	}
}
