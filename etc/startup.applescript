#!/usr/bin/osascript

on run {eggbeatrPath}

	tell application "System Events" to set pathType to (get class of item (POSIX file eggbeatrPath as text))

	if ((pathType as string) is equal to "folder") then
		set loadingNotification to "eggbeatr project loading from root " & return & eggbeatrPath
		display notification loadingNotification with title "Eggbeatr" subtitle "Loading Development Environment"
	else
		-- Display error and exit if no directory is found.
		set errorTitle to "Error: Project Root Not Found"
		set errorContent to "Please pass the eggbeatr project root as a paramter to this script." & return & return & "Recieved: " & eggbeatrPath

		display dialog errorContent buttons {"Cancel"} with icon stop with title errorTitle
	end if

	-- Confirmation to run.
	set runConfirmation to "Press 'OK' to set up the eggbeatr development environment." & return & return & "Project found in " & eggbeatrPath
	display dialog runConfirmation with icon note

	tell application "Terminal"
		launch

		set setupTab to do script ("cd " & eggbeatrPath)
		activate -- Bring list of packages with upgrades to foreground.

		-- If connected to the internet, clean, download, and update (with confirmation) the NPM packages.
		try
			do shell script "networksetup -getairportnetwork en0 | grep \"You are not associated with an AirPort network.\""

			-- Not connected to Wi-Fi. Skip fresh package install.
		on error err
			-- Connected to Wi-Fi.

			do script ("npm run packages:fresh") in setupTab
			my wait(setupTab)
			do script ("npm run packages:upgrade -- --dryrun") in setupTab
			my wait(setupTab)

			-- Package update confimation.
			set theDialogText to "Would you like to upgrade eggbeatr's npm packages to the latest version?" & return & return & "This will overwrite the current package version."
			set answer to the button returned of (display dialog theDialogText buttons {"No", "Yes"} default button "No" with icon caution with title "Warning: Dependency Overwrite")

			if answer is "Yes" then
				do script ("npm run packages:upgrade -- --upgrade") in setupTab
				my wait(setupTab)
                do script ("npm run packages:install") in setupTab
			end if

			my wait(setupTab)
		end try

		do script ("npm run db:init") in setupTab
		my wait(setupTab)

		set appTab to do script ("cd " & eggbeatrPath & "/src/app")
		set serverTab to do script ("cd " & eggbeatrPath & "/src/server")

		do script ("npm run start") in appTab
		do script ("npm run start") in serverTab
	end tell

	return eggbeatrPath
end run


on wait(process)
	tell application "Terminal"
		repeat
			-- Wait until complete...
			delay 0.1
			if not (busy of process) then exit repeat
		end repeat
	end tell
end wait
