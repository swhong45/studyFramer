syrup_order = Framer.Importer.load "imported/syrup_order_test"

ViewController = require 'ViewController'

Views = new ViewController
	initialView: syrup_order.intro


##########################
# Button Layer
##########################
btnChangeLoc = new Layer
	x:220
	y: 30
	width: 220
	opacity: 0
	superLayer: syrup_order.storelist

btnSelectPohang = new Layer
	x: 320
	y: 340
	width: 310
	opacity: 0
	superLayer: syrup_order.location

btnSelectStore = new Layer
	y: 640
	width:syrup_order.pohang.width
	height: 300
	opacity: 0
	superLayer: syrup_order.pohang
	
btnBackStore = new Layer
	y: 30
	height: 120
	width: 120
	opacity: 0
	superLayer: syrup_order.menu

btnRefresh =  new Layer
	width: syrup_order.pohang.width
	height: 30
	opacity: 0
	superLayer: syrup_order.pohang
			
############
# Navigation
############
syrup_order.intro.on Events.Click, -> 
	Views.switchInstant syrup_order.storelist

#syrup_order.storelist.on Events.Click, -> 
	#Views.moveInUp syrup_order.location	
btnChangeLoc.on Events.Click, ->
	Views.moveInUp syrup_order.location
	
#syrup_order.location.on Events.Click, -> 
	#Views.moveInDown syrup_order.pohang
btnSelectPohang.on Events.Click, ->
	Views.moveInDown syrup_order.pohang


#syrup_order.pohang.on Events.Click, -> 
	#Views.pushIn syrup_order.menu
btnSelectStore.on Events.Click, ->
	Views.pushIn syrup_order.menu
	
#syrup_order.menu.on Events.Click, -> 
	#Views.moveInLeft syrup_order.pohang
btnBackStore.on Events.Click, ->
	Views.moveInLeft syrup_order.pohang
	
btnRefresh.on Events.Click, ->
	Views.switchInstant syrup_order.intro
	
	