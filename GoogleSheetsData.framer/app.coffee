# Defaults
background = new BackgroundLayer({backgroundColor:"#F6F6F6"})

# Get data from public Google Sheet
data = JSON.parse Utils.domLoadDataSync "https://spreadsheets.google.com/feeds/list/1weDuvsQDj4BWQvpHxEONOHCvNFI6joaorojet8fRs1Y/od6/public/values?alt=json"

# Screen dimensions
screenWidth = (percent) ->
	Framer.Device.screen.width * (percent)
	
screenHeight = (percent) ->
	Framer.Device.screen.height * (percent)

# Placing all cells within a container
Container = new Layer backgroundColor: "transparent", width:screenWidth(1), height:screenHeight(1)
Container.center()
Container.scroll = true

cell = [0..1]
 
# Create the cells
for n in [0...20]

	city = data.feed.entry[n]["gsx$city"]["$t"]
	state = data.feed.entry[n]["gsx$state"]["$t"]
	listingCount = data.feed.entry[n]["gsx$listingcount"]["$t"]
	imageURL = data.feed.entry[n]["gsx$image"]["$t"]

	cell[n] = new Layer
	    width:screenWidth(1)
	    height:300
	    backgroundColor: "grey"
	    image: imageURL
	    name: n
	    y: (n) * 302
	
	# print cell[n].y
	    
	cell[n].shadowColor = "rgba(0, 0, 0, 0.25)"
	cell[n].superLayer = Container
	cell[n].style = {backgroundPosition:"center center"}
	cell[n].centerX()
  
	cell[n].on Events.Click, ->
		print this.y, this.name
	
	locationText = new Layer
		superLayer: cell[n]
		backgroundColor: "transparent"
		height:60
		width:600
		y:90
		
	listingsText = new Layer
		superLayer: cell[n]
		backgroundColor: "tan"
		height:50
		width:160
		y: 180
  	
	locationText.centerX()	
	locationText.html = city + ", " + state
	locationText.style = {color:"#FFF",fontSize:"40px",textTransform:"capitalize",textAlign:"center",lineHeight:"50px",fontWeight:"bold"}
	
	listingsText.centerX()	
	listingsText.html = listingCount + " listings"
	listingsText.style = {color:"#FFF",fontSize:"22px",textTransform:"lowercase",textAlign:"center",lineHeight:"50px"}




	 