Agar.io Reverse Engineering
========

**Author:**
 * DnAp

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

### To start ###

#### Without php ####
Copy files to your server and open their as http://localhost/ or http://agar.io/

#### code logic ####
Websocket API
### send data format ###
[termnology: B=Byte, I=int, U=uint, F=float]
send these commands to server
 * send 5 bytes(1st byte=255, 4 bytes=1) when opened connection
 * send name: 0(1byte) + characters ascii(16 byte each, to support other languages)
 * send actions: 1 byte number(command)
	- 1 : spectate
 	- 17: space key(split)
	- 18: Q key
	- 19: Q keyup, close game
	- 21: W key(eject mass)
 * send normalized location: 21 bytes
	- 16(1BI)+xPos(8BF)+yPos(8BF)+0(4BI)

### receive data format ###
received in data buffer with first byte is command, as follows
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
 * 32: creates new bucket
	- probably your own id for bucket. called for first time only when started
 * 48: elements with name.
	- probably old leaderboard method.  also doesnt come here
 * 49: leaderboard
	- name and ids list sorted by rank (top 10)
 * 64: size of canvas
	- comes when select region. fixed for all regions

###tasks to do on server###
 1. generate user at random location
 2. generate seeds at random location
 3. split into multiple parts if collides with splitter.
 4. handle commands to split, eject
 5. logic to eat others given some constraints.
 6. if user have several parts, keep them together.