sketch = Framer.Importer.load "imported/project"

ViewController = require 'ViewController'

Views = new ViewController

customLayer = new Layer
	width: Screen.width
	height: Screen.height
	superLayer: Views
	name: 'initialView'
	backgroundColor: 'red'

customLayer = new Layer
	width: Screen.width
	height: Screen.height
	superLayer: Views
	backgroundColor: 'yellow'
	
#Views.addSubLayer sketch.third

# Add views to the view controller
#Views.add view for view in [view1,view2]
# Switch view to set the initial state
#Views.switchInstant view1
# Set up transition on click
#view1.on Events.Click, -> Views.fadeIn view2

sketch.start.on Events.Click, -> 
	Views.magicMove sketch.second, time: 1

sketch.second.on Events.Click, -> Views.back()

# Go back in history and reverse the previous animation
#view2.on Events.Click, -> Views.back()
### Transitions
.switchInstant
.pushIn
.pushInRight
.pushInLeft
.slideIn
.slideInDown
.slideInUp
.slideInRight
.slideInLeft
.fadeIn
.crossDissolve
.zoomIn
.zoomedIn
.spinIn
.moveIn
.moveInDown
.moveInUp
.moveInRight
.moveInLeft
.magicMove
###