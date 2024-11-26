WallCal: Raspberry Pi Digital Wall Calendar

This guide will walk you through setting up a digital wall calendar using a Raspberry Pi Zero and a touch display. This step-by-step guide is designed for complete beginners.

Table of Contents

	1.	Overview
	2.	Hardware Requirements
	3.	Software Requirements
	4.	Setup Instructions
	•	Step 1: Setting up the Raspberry Pi
	•	Step 2: Installing WallCal
	•	Step 3: Configuring the Calendar
	5.	Connecting Your iCal Calendar
	6.	Starting WallCal
	7.	Troubleshooting
	8.	Optional Enhancements
	9.	Contributing
	10.	License

Overview

WallCal is a digital calendar dashboard that displays events from your iCal calendar. With a Raspberry Pi Zero and a touch display, you can create an intuitive wall-mounted digital calendar.

Hardware Requirements

To build this project, you’ll need:
	•	Raspberry Pi Zero WH (or similar)
	•	MicroSD card (8GB or larger)
	•	5V power supply for the Raspberry Pi
	•	Touch Display (e.g., Waveshare 2.8-inch Capacitive Touchscreen)
	•	HDMI cable (if applicable for your display)
	•	Keyboard and mouse (for initial setup)
	•	Wi-Fi or Ethernet connection
	•	Case or mount (optional, for a clean wall-mounted look)

Software Requirements

	•	Raspberry Pi OS (32-bit, Legacy): Download here
	•	Node.js and npm (for running the application)
	•	Git (for cloning the repository)
	•	WallCal repository files: GitHub link

Setup Instructions

Step 1: Setting up the Raspberry Pi

	1.	Install Raspberry Pi OS:
	•	Use Raspberry Pi Imager to write Raspberry Pi OS to your MicroSD card.
	•	Insert the MicroSD card into the Raspberry Pi and power it on.
	2.	Connect the Display:
	•	Follow the instructions provided with your touchscreen display.
	•	Ensure the Raspberry Pi recognizes the display during boot.
	3.	Set up Wi-Fi and SSH:
	•	During the initial Raspberry Pi setup, connect to Wi-Fi.
	•	Enable SSH by running:

sudo raspi-config

Navigate to Interfacing Options > SSH and enable it.

	4.	Update the Raspberry Pi:
Run these commands:

sudo apt-get update
sudo apt-get upgrade

Step 2: Installing WallCal

1. Install Git:

	sudo apt-get install git


	2.	Install Node.js and npm:

sudo apt-get install nodejs npm


	3.	Clone the WallCal Repository:

git clone https://github.com/zashouri91/wallcal.git
cd wallcal


	4.	Install Dependencies:

npm install

Step 3: Configuring the Calendar

	1.	Locate the Configuration File:
Inside the wallcal directory, open the config.json file:

nano config.json


	2.	Edit Configuration Settings:
Modify these fields:
	•	calendarUrl: Add your iCal URL (see below for setup instructions).
	•	timezone: Set your timezone, e.g., "America/New_York".
	•	refreshInterval: Set how often (in minutes) the calendar refreshes.
Example config.json:

{
  "calendarUrl": "https://calendar.google.com/calendar/ical/your_calendar_url.ics",
  "timezone": "America/New_York",
  "refreshInterval": 15
}


	3.	Save and close the file: Press CTRL + O, then CTRL + X.

Connecting Your iCal Calendar

To link your calendar to WallCal:
	1.	Export iCal Link:
	•	If using Google Calendar:
	•	Go to Google Calendar.
	•	Click on the gear icon → Settings.
	•	Select your calendar from the left menu.
	•	Scroll to Integrate calendar and copy the Secret address in iCal format.
	•	If using Apple Calendar:
	•	Open your calendar on a Mac.
	•	Right-click your calendar → Share Settings.
	•	Enable Public Calendar and copy the URL.
	2.	Add the Link to config.json:
Paste the iCal link under the calendarUrl field.

Starting WallCal

	1.	Run the Application:

node index.js


	2.	Autostart WallCal on Boot (Optional):
To ensure WallCal runs automatically:
	•	Edit the autostart file:

nano ~/.config/lxsession/LXDE-pi/autostart


	•	Add this line:

@/usr/bin/node /home/pi/wallcal/index.js


	•	Save and reboot your Pi.

Troubleshooting

	1.	No Display Output:
	•	Ensure the display is properly connected and powered.
	•	Verify display settings:

sudo raspi-config

Check Display Options.

	2.	Calendar Not Loading:
	•	Double-check the calendarUrl in config.json.
	•	Ensure the iCal URL is publicly accessible.
	3.	Application Errors:
	•	Look for errors in the terminal output.
	•	Run:

npm install

to ensure dependencies are installed.

	4.	Touchscreen Not Working:
	•	Verify the touchscreen is compatible with Raspberry Pi OS.
	•	Install touchscreen drivers if required (check your display’s manual).

Optional Enhancements

	•	Style Customization: Modify the index.css file for a personalized look.
	•	Wall Mount: Use a case and mounting bracket for a professional finish.
	•	Power Button: Add a physical button to turn the screen on/off while keeping the Raspberry Pi running.

Contributing

	1.	Fork the repository.
	2.	Create a new branch (feature/your-feature-name).
	3.	Commit your changes.
	4.	Push the branch and open a pull request.

License

This project is licensed under the MIT License. See LICENSE for details.

This updated README ensures that even a complete beginner can set up and troubleshoot their digital wall calendar effectively. Let me know if you need further tweaks!
