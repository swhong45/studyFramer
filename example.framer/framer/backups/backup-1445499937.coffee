sketch = Framer.Importer.load "imported/project"
ViewController = require 'ViewController'

Views = new ViewController
	initialView: sketch.settings
	
sketch.btn_general.on Events.Click, -> 
	Views.pushIn sketch.general
	
sketch.btn_siri.on Events.Click, -> 
	Views.pushIn sketch.siri
	
sketch.back_general.on Events.Click, -> Views.back()
sketch.back_settings.on Events.Click, -> Views.back()