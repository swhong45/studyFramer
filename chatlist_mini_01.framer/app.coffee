
#create layers
body_scroll = new ScrollComponent
    width: Screen.width
    backgroundColor: "white"
   	height: 1280
body_scroll.scrollVertical = true
body_scroll.scrollHorizontal = false

chatlist_header = new Layer
	image: "images/header.png"
	width: Screen.width
	height: 127

chatlist_body = new Layer
	image: "images/chatlist_body.png"
	width: Screen.width
	height: 2100
	y: 127
	superLayer: body_scroll.content
	
chatlist_footer = new Layer
	image: 'images/footer.png'
	width: Screen.width
	height:100
	y: Align.bottom

chatlist_item = new Layer
	image: "images/chatlist_item.png"
	width: Screen.width
	height: Screen.height
	scaleY: 1.08
	x: 730
	y: -116
	parent: chatlist_body

popup_mini = new Layer
	image: "images/popup_mini.png"
	width: Screen.width
	height: Screen.height
	x: Align.center
	y: Align.center
	opacity: 1
	scale: 0

inapp_page = new Layer
	x:750
	size: Screen.size
	backgroundColor: "white"

inapp_header = new Layer
	parent: inapp_page
	image: "images/inapp_header.png"
	width: Screen.width
	height: 130

inapp_scroll = new ScrollComponent
	width: Screen.width
	height: Screen.height - inapp_header.height
	parent: inapp_page
	y:inapp_header.height

inapp_body = new Layer
	image: "images/inapp_body.png"
	width: Screen.width
	height: 2728
	superLayer: inapp_scroll.content

inapp_scroll.scrollVertical = true
inapp_scroll.scrollHorizontal = false

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

back04 =new Layer
	width: 130
	height: 130
	parent: inapp_page
	opacity: 0

action_btn = new Layer
	parent: chatlist_body
	width: 121
	height: 47
	x: 612
	y: 1426
	opacity: 0.2
	backgroundColor: "green"
	borderRadius: 12

# define animation
chatlist_item_moveleft = new Animation
    layer: chatlist_item
    properties:
        x: Align.center(-800)
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

inapp_page_show = new Animation
	layer: inapp_page
	properties: 
		x: Align.left (-1)

chatlist_item_moveleft.on(Events.AnimationEnd, popup_mini_show.start)

popup_mini.onClick ->
	ad_01_show.start()

action_btn.onClick ->
	inapp_page_show.start()

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
	chatlist_item.x = 730


back02.onClick ->
	ad_01.x = Align.center(750)
	ad_02.x = Align.center(750)
	popup_mini.scale = 0
	chatlist_item.x = 730

back03.onClick ->
	ad_01.x = Align.center(750)
	ad_02.x = Align.center(750)
	ad_03.x = Align.center(750)
	popup_mini.scale = 0
	chatlist_item.x = 730

back04.onClick ->
	inapp_page.x = 750




	
	

	
	

	
	
	





