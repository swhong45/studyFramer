# Welcome to Framer
# Global Background Layer
bg = new BackgroundLayer backgroundColor: "#2196F3"

Framer.Defaults.Animation = {
    curve: "spring(800,100,0)"
}

# Define Container - superLayers
today = new Layer x:0, y:0, width:1280, height:720, backgroundColor:"transparent"
yesterday = new Layer x:0, y:720, width:1280, height:720, backgroundColor:"transparent"

boundary_x = 20
boundary_y = 120
w_padding = 10
w_height = 300
w_color = "white"

widget1 = new Layer x: boundary_x, y: boundary_y, width: today.width * 0.7, height: w_height, backgroundColor:w_color, borderRadius:5
widget2 = new Layer x: boundary_x + w_padding + widget1.width, y: boundary_y, width: today.width - widget1.width - boundary_x*2 - w_padding, height: w_height, backgroundColor:w_color, borderRadius:5
widget3 = new Layer x: boundary_x, y: boundary_y + w_padding + w_height, width: (today.width - boundary_x*2 - w_padding*2)/3, height: w_height, backgroundColor:w_color, borderRadius:5
widget4 = new Layer x: boundary_x + w_padding + (today.width - boundary_x*2 - w_padding*2)/3, y: boundary_y + w_padding + w_height, width: (today.width - boundary_x*2 - w_padding*2)/3, height: w_height, backgroundColor:w_color, borderRadius:5
widget5 = new Layer x: today.width - boundary_x - (today.width - boundary_x*2 - w_padding*2)/3, y: boundary_y + w_padding + w_height, width: (today.width - boundary_x*2 - w_padding*2)/3, height: w_height, backgroundColor:w_color, borderRadius:5

today_w = [widget1, widget2, widget3, widget4, widget5]
for layers in today_w
	layers.superLayer = today


widget6 = new Layer x: boundary_x, y: boundary_y, width: yesterday.width * 0.7, height: yesterday.height - boundary_y, backgroundColor:w_color, borderRadius:5
widget7 = new Layer x: widget6.maxX + w_padding, y: boundary_y, width: yesterday.width * 0.26, height: 350, backgroundColor:"#FF7043", borderRadius:5
widget8 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 125, width: yesterday.width * 0.26, height: 350, backgroundColor:"#FFD54F", borderRadius:5
widget9 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 250, width: yesterday.width * 0.26, height: 350, backgroundColor:"#CDDC39", borderRadius:5

yesterday_w = [widget6, widget7, widget8, widget9]
for layers in yesterday_w
	layers.superLayer = yesterday

widget8.bringToFront()
widget9.bringToFront()
			
today.on Events.Click, ->
	today.animate({
		properties: {y:-720}
	})
	yesterday.animate({
		properties: {y:0}
	})
	
widget6.on Events.Click, ->
	today.animate({
		properties: {y:0}
	})
	yesterday.animate({
		properties: {y:720}
	})

widget7.on Events.Click, ->
	this.animate({
		properties: {y:boundary_y}
	})
	widget8.animate({
		properties: {y:boundary_y + 350}
	})
	widget9.animate({
		properties: {y:boundary_y + 475}
	})
	
widget8.on Events.Click, ->
	widget7.animate({
		properties: {y:boundary_y}
	})
	this.animate({
		properties: {y:boundary_y + 125}
	})
	widget9.animate({
		properties: {y:boundary_y + 475}
	})

widget9.on Events.Click, ->
	widget7.animate({
		properties: {y:boundary_y}
	})
	widget8.animate({
		properties: {y:boundary_y + 125}
	})
	this.animate({
		properties: {y:boundary_y + 250}
	})
	
		
		

