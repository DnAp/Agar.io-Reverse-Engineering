Agar.io Reverse Engineering
========

## Support discontinued, it is not working now ##


**Author:**
 * DnAp
 * TheZero

## Feature ##
 * Reverse engineering main_out.js with user frendly variables names
 * Greater field of view - zoom rate from 10 to 10.35
 * Depict circle around big points
 * Show mass for all points
 * Color enemy

## Color enemy ##
 * Green - small food
 * Sea green - food
 * Blue - friend, safe mass
 * Red - predator

## To start ##
Copy files to your server and open http://localhost/index.html

## Code Logic - Websocket API ##
[termnology: B=Byte, I=int, U=uint, F=float]

#### Data sended ####

 * send 5B (1B=255 + 4B=1) when opened connection
 * send name: 0(1B) + characters ascii(2B each, to support other languages)
 * send actions: 1B number(command)
	- 1 : spectate
 	- 17: space key (split)
	- 18: Q key _(apparently don't work)_
	- 19: Q keyup, close game _(apparently don't work)_
	- 21: W key (eject mass)
 * send normalized location: 21B
	- 16(1BI) + xPos(8BF) + yPos(8BF) + 0(4BI)

#### Data Received ####
 * 16: main loop which called very often with updated locations of everyone. following data format.
	- 2BU: number points to destroy. probably first eating second.
	- info of above points: id of first(4BU) + id of 2nd(4BU)
	- id of a point(4BU)+x(4BF)+y(4BF)+size(4BF)+color[R(1BU)+G(1BU)+B(1BU)]+
	- isVirus(1BU)+[padding=f(isVirus)]+name(2BU,till 0)+2B unused+
	- numUpdateCodes(4BU)+list of ids(4BU) probably to destroy

 * 17: returns normalization params, px, py and ratio
	- this message never came
 * 20: resets points.
	- this message never came
 * 32: informs the client which cell belongs to the player.
	- sent every time you split or respawn.
 * 48: elements with name.
	- probably old leaderboard method.  also doesnt come here
 * 49: leaderboard
	- name and ids list sorted by rank (top 10)
 * 64: size of canvas
	- comes when select region. fixed for all regions
