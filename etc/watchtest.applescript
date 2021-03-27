#!/usr/bin/osascript

on run {eggbeatrPath}

	tell application "Terminal"
        activate

		set testTab to do script ("cd " & eggbeatrPath & "/src/app")
        set buildTab to do script ("cd " & eggbeatrPath & "/src/app")

        do script ("npm run build:watch -- --test") in buildTab
		do script ("npm run test:watch") in testTab
	end tell

	return eggbeatrPath
end run
