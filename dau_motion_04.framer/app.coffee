# Welcome to Framer
# Global Background Layer
bg = new BackgroundLayer backgroundColor: Utils.randomColor()

Framer.Defaults.Animation = {
    curve: "spring(800,100,0)"
}

# Define Container - superLayers
today = new Layer x:0, y:120, width:1280, height:600, backgroundColor:"transparent"
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
widget1.states.add
	up: {x:boundary_x, y:boundary_y}
	down: {x:-1280}
widget2.states.add
	up: {x: boundary_x + w_padding + widget1.width, y: boundary_y}
	down: {x:2000}
widget3.states.add
	up: {x: boundary_x, y: boundary_y + w_padding + w_height}
	down: {x:-1280, y:1000}
widget4.states.add
	up: {x: boundary_x + w_padding + (today.width - boundary_x*2 - w_padding*2)/3, y: boundary_y + w_padding + w_height}
	down: {y:2000}
widget5.states.add
	up: {x: today.width - boundary_x - (today.width - boundary_x*2 - w_padding*2)/3, y: boundary_y + w_padding + w_height}
	down: {x:2000, y:900}

widget6 = new Layer x: boundary_x, y: boundary_y + 720, width: yesterday.width * 0.7, height: yesterday.height - boundary_y, backgroundColor:w_color, borderRadius:5
widget7 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 720, width: yesterday.width * 0.26, height: 350, backgroundColor:"#FF7043", borderRadius:5
widget8 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 845, width: yesterday.width * 0.26, height: 125, backgroundColor:"#FFD54F", borderRadius:5
widget9 = new Layer x: widget6.maxX + w_padding, y: boundary_y + 970, width: yesterday.width * 0.26, height: 125, backgroundColor:"#CDDC39", borderRadius:5

yesterday_w = [widget6, widget7, widget8, widget9]
widget6.states.add
	down: {y:boundary_y + 720, height: yesterday.height - boundary_y}
widget7.states.add
	down: {y:boundary_y + 720, height: 350}
widget8.states.add
	down: {y:boundary_y + 845, height: 125}
widget9.states.add
	down: {y:boundary_y + 970, height: 125}

flag = 0
# Utils.interval 10, ->
bg.on Events.Click, ->
	bg.backgroundColor= Utils.randomColor()
	if flag is 0
		for i in [0..4]
			today_w[i].states.switch("down")
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
		flag = 1
	else		
		Utils.delay 0.1, ->
			widget1.states.switch("up")
			widget2.states.switch("up")
		Utils.delay 0.2, ->
			widget3.states.switch("up")			
			widget5.states.switch("up")
			widget4.states.switch("up")
		for i in [0..3]
			yesterday_w[i].states.switch("down")
		flag = 0		
 					
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
	
		
		

