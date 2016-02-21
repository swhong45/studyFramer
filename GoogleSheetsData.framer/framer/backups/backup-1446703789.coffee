# Defaults
background = new BackgroundLayer({backgroundColor:"#F6F6F6"})

# Get data from public Google Sheet
data = JSON.parse Utils.domLoadDataSync "https://spreadsheets.google.com/feeds/list/1ihCio_6Rkz2350Zm6HefrcCuRZ6m7L-35_cj816G4Z4/od6/public/values?alt=json"

# Screen dimensions
screenWidth = (percent) ->
	Framer.Device.screen.width * (percent)
	
screenHeight = (percent) ->
	Framer.Device.screen.height * (percent)

# Placing all cells within a container
Container = new Layer backgroundColor: "transparent", width:screenWidth(1), height:screenHeight(1)
Container.center()
Container.scroll = true

n = 0

# Create the cells
for colNumber in [0...5]

	city = data.feed.entry[n]["gsx$city"]["$t"]
	state = data.feed.entry[n]["gsx$state"]["$t"]
	listingCount = data.feed.entry[n]["gsx$listingcount"]["$t"]
	imageURL = data.feed.entry[n]["gsx$image"]["$t"]

	cell = new Layer
	    width:screenWidth(1)
	    height:300
	    backgroundColor: "grey"
	    image: imageURL
	    y: (colNumber) * 302
  
	cell.shadowColor = "rgba(0, 0, 0, 0.25)"
	cell.superLayer = Container
	cell.style = {backgroundPosition:"center center"}
	cell.centerX()
  
	locationText = new Layer
		superLayer: cell
		backgroundColor: "transparent"
		height:60
		width:600
		y:90
		
	listingsText = new Layer
		superLayer: cell
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
  
	n = n + 1