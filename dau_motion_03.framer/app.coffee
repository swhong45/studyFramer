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


widget6 = new Layer x: boundary_x, y: boundary_y + 720, width: yesterday.width * 0.7, height: yesterday.height - boundary_y, backgroundColor:w_color, borderRadius:5
widget7 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 720, width: yesterday.width * 0.26, height: 350, backgroundColor:"#FF7043", borderRadius:5
widget8 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 845, width: yesterday.width * 0.26, height: 125, backgroundColor:"#FFD54F", borderRadius:5
widget9 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 970, width: yesterday.width * 0.26, height: 125, backgroundColor:"#CDDC39", borderRadius:5

yesterday_w = [widget6, widget7, widget8, widget9]
for cnt in [0..3]
		yesterday_w[cnt].states.add
			one: {y:900}
			
			
today.on Events.Click, ->
	today.animate({
		properties: {y:-720}
	})
	
	Utils.delay 0.1, -> 
		widget6.animate({
			properties: {y: boundary_y}
		})
	Utils.delay 0.3, -> 
		widget7.animate({
			properties: {y: boundary_y}
		})
	Utils.delay 0.4, -> 
		widget8.animate({
			properties: { y : boundary_y + 350}
		})
	Utils.delay 0.5, -> 
		widget9.animate({
			properties: { y : boundary_y + 475}
		})
	
	
widget6.on Events.Click, ->
	today.animate({
		properties: {y:0}
	})
	for cnt in [0..3]
		yesterday_w[cnt].states.switch ("one")
	widget7.height = 350
	widget8.height = 125
	widget9.height = 125	
	
widget7.on Events.Click, ->
	this.animate({
		properties: {y:boundary_y, height:350}
	})
	widget8.animate({
		properties: {y:boundary_y + 350, height:125}
	})
	widget9.animate({
		properties: {y:boundary_y + 475, height:125}
	})
	
widget8.on Events.Click, ->
	widget7.animate({
		properties: {y:boundary_y, height:125}
	})
	this.animate({
		properties: {y:boundary_y + 125, height:350}
	})
	widget9.animate({
		properties: {y:boundary_y + 475, height:125}
	})

widget9.on Events.Click, ->
	widget7.animate({
		properties: {y:boundary_y, height:125}
	})
	widget8.animate({
		properties: {y:boundary_y + 125, height:125}
	})
	this.animate({
		properties: {y:boundary_y + 250, height:350}
	})
	
		
		

