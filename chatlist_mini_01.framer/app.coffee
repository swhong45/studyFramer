
#create layers
chatlist = new Layer
	image: "images/chatlist.png"
	width: Screen.width
	height: Screen.height

chatlist_item = new Layer
	image: "images/chatlist_item.png"
	width: Screen.width
	height: Screen.height
	x: 720
	y: 0

popup_mini = new Layer
	image: "images/popup_mini.png"
	width: Screen.width
	height: Screen.height
	x: Align.center
	y: Align.center
	opacity: 1
	scale: 0

ad_01 = new Layer
	image: "images/ad_01.png"
	width: Screen.width
	height: Screen.height
	x: Align.center(760)

ad_02 = new Layer
	image: "images/ad_02.png"
	width: Screen.width
	height: Screen.height
	x: Align.center(760)

ad_03 = new Layer
	image: "images/ad_03.png"
	width: Screen.width
	height: Screen.height
	x: Align.center(760)

back = new Layer
	superLayer: ad_01
	width:150
	height: 100
	y: 30
	opacity: 0
back02 = new Layer
	superLayer: ad_02
	width:150
	height: 100
	y: 30
	opacity: 0
back03 = new Layer
	superLayer: ad_03
	width:150
	height: 100
	y: 30
	opacity: 0

# define animation
chatlist_item_moveleft = new Animation
    layer: chatlist_item
    properties:
        x: Align.center(-600)
    curve: "ease-in-out"

popup_mini_show = new Animation
	layer: popup_mini
	properties: 
		scale: 1
	curve:  "spring(600, 50, 0)"

ad_01_show = new Animation
	layer: ad_01
	properties: 
		x: Align.center
	curve:  "spring(400, 50, 0)"

ad_02_show = new Animation
	layer: ad_02
	properties: 
		x: Align.center

ad_02_disappear = new Animation
	layer: ad_02
	properties: 
		x: Align.center(750)

ad_03_show = new Animation
	layer: ad_03
	properties: 
		x: Align.center

ad_03_disappear = new Animation
	layer: ad_03
	properties: 
		x: Align.center(750)

#ad_01...delay function
#ad_01_show_fun = ->
	#Utils.delay 0.8,->
		#ad_01_show.start()

chatlist_item_moveleft.on(Events.AnimationEnd, popup_mini_show.start)
#popup_mini_show.on(Events.AnimationEnd,ad_01_show_fun)

popup_mini.onClick ->
	ad_01_show.start()

chatlist_item.onSwipeLeft ->
	chatlist_item_moveleft.start()

ad_01.onSwipeLeft ->
	ad_02_show.start()

ad_02.onSwipeLeft ->
	ad_03_show.start()

ad_02.onSwipeRight -> 
	ad_02_disappear.start()

ad_03.onSwipeRight ->
	ad_03_disappear.start()

back.onClick ->
	ad_01.x = Align.center(750)
	popup_mini.scale = 0
	chatlist_item.x = 720

back02.onClick ->
	ad_01.x = Align.center(750)
	ad_02.x = Align.center(750)
	popup_mini.scale = 0
	chatlist_item.x = 720

back03.onClick ->
	ad_01.x = Align.center(750)
	ad_02.x = Align.center(750)
	ad_03.x = Align.center(750)
	popup_mini.scale = 0
	chatlist_item.x = 720






	
	

	
	

	
	
	





