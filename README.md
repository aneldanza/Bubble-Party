# Bubble-Party

This is a game that engages user to "shoot" bubbles to gain score points. Game starts off with a single player. Bubbles of different color start continuously growing from the top of the game area. Player needs to hit bubbles that are adjacent to 2 or more bubbles of the same color.

I'm planning to build the game using such technologies as JavaScript, Canvas, HTML5, CSS3.

Here are the **MVPs**:
* Start, quit game at any time
* Be able to shoot bubbles
* Have accumulative score system
* Three or more adjacent bubbles of the same color create a cluster and drop if one of them is shot
* Game is over when main mass of bubbles reaches the bottom of the game area
* Have a production ReadMe file

### Wireframes
[[images/main_view.png]]

### Timeline
**Day1:**
* Create a Main Layout design
* Add buttons functionality

**Day2:**
* Create the bubbles growth and color feature
* Add styling

**Day3:** 
* Create player feature
* Create smooth interaction between player and bubbles
* Style the spec effects

**Day4:**
* Finish styling
* Clean up/refactor code if needed

Additional feature for the future development:

### Backend
There will be a Users table with following columns: id, username, score. I will use Rails and Active Record

