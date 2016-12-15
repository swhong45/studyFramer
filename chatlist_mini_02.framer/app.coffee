
#create layers
ad_frame = new Layer
	size: Screen.size

ad_header = new Layer
	image: "images/ad_01.png"
	width: Screen.width
	height: 150
	backgroundColor: "red"
	parent: ad_frame

back_btn = new Layer
	parent: ad_header
	height: ad_header.height

ad_page = new PageComponent
	width: Screen.width
	height: Screen.height - ad_header.height
	y: Align.top(ad_header.height)
	scrollVertical: false
	parent: ad_frame

ad_01 = new Layer
	size: ad_page.size
	backgroundColor: "yellow"

ad_02 = new Layer
	size: ad_page.size
	backgroundColor: "green"

ad_03 = new Layer
	size: ad_page.size
	backgroundColor: "blue"

ad_page.addPage(ad_01)
ad_page.addPage(ad_02, "right")
ad_page.addPage(ad_03, "right")










	
	

	
	

	
	
	





