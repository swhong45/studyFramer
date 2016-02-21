require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = (function(superClass) {
  extend(exports, superClass);

  function exports(options) {
    if (options == null) {
      options = {};
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.height == null) {
      options.height = Screen.height;
    }
    if (options.clip == null) {
      options.clip = true;
    }
    if (options.initialViewName == null) {
      options.initialViewName = 'initialView';
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "cubic-bezier(0.19, 1, 0.22, 1)",
        time: .7
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "black";
    }
    exports.__super__.constructor.call(this, options);
    this.history = [];
    if (options.initialView != null) {
      this.switchInstant(options.initialView);
    }
    this.on("change:subLayers", function(changeList) {
      var view;
      view = changeList.added[0];
      view.on(Events.Click, function() {});
      if (view.name !== options.initialViewName) {
        return view.visible = false;
      }
    });
  }

  exports.prototype.add = function(view) {
    return view.superLayer = this;
  };

  exports.prototype.saveCurrentToHistory = function(incomingAnimation, outgoingAnimation) {
    return this.history.unshift({
      view: this.current,
      incomingAnimation: incomingAnimation,
      outgoingAnimation: outgoingAnimation
    });
  };

  exports.prototype.back = function() {
    var backIn, moveOut, previous;
    previous = this.history[0];
    if (previous.view != null) {
      if (previous.incomingAnimation.name === 'magicMove') {
        return this.magicMove(previous.view, previous.incomingAnimation.animationOptions);
      } else {
        backIn = previous.outgoingAnimation.reverse();
        moveOut = previous.incomingAnimation.reverse();
        backIn.start();
        moveOut.start();
        this.current = previous.view;
        this.history.shift();
        return moveOut.on(Events.AnimationEnd, (function(_this) {
          return function() {
            return _this.current.bringToFront();
          };
        })(this));
      }
    }
  };

  exports.prototype.applyAnimation = function(newView, incoming, animationOptions, outgoing) {
    var incomingAnimation, incomingAnimationObject, outgoingAnimation, outgoingAnimationObject, ref;
    if (outgoing == null) {
      outgoing = {};
    }
    if (newView !== this.current) {
      newView.animateStop();
      if ((ref = this.current) != null) {
        ref.propsBeforeAnimation = this.current.props;
      }
      newView.props = newView.propsBeforeAnimation;
      if (this.subLayers.indexOf(newView) === -1) {
        this.addSubLayer(newView);
      }
      newView.visible = true;
      newView.point = {
        x: 0,
        y: 0
      };
      _.extend(this.current, outgoing.start);
      outgoingAnimationObject = {
        layer: this.current,
        properties: {}
      };
      _.extend(outgoingAnimationObject.properties, outgoing.end);
      _.extend(outgoingAnimationObject, animationOptions);
      outgoingAnimation = new Animation(outgoingAnimationObject);
      outgoingAnimation.start();
      _.extend(newView, incoming.start);
      incomingAnimationObject = {
        layer: newView,
        properties: {}
      };
      _.extend(incomingAnimationObject.properties, incoming.end);
      _.extend(incomingAnimationObject, animationOptions);
      incomingAnimation = new Animation(incomingAnimationObject);
      incomingAnimation.start();
      this.saveCurrentToHistory(incomingAnimation, outgoingAnimation);
      this.current = newView;
      return this.current.bringToFront();
    }
  };


  /* ANIMATIONS */

  exports.prototype.switchInstant = function(newView) {
    return this.fadeIn(newView, {
      time: 0
    });
  };

  exports.prototype.slideIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.slideInRight(newView, animationOptions);
  };

  exports.prototype.slideInLeft = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.slideInRight = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.slideInDown = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: -this.height,
        x: 0
      },
      end: {
        y: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.slideInUp = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: this.height,
        x: 0
      },
      end: {
        y: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.fadeIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        opacity: 0
      },
      end: {
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.crossDissolve = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.fadeIn(newView, animationOptions);
  };

  exports.prototype.zoomIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.zoomedIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        scale: 1.5,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.spinIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        rotation: 180,
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1,
        rotation: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  exports.prototype.pushIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.pushInRight(newView, animationOptions);
  };

  exports.prototype.pushInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        x: 0
      },
      end: {
        x: -(this.width / 5),
        brightness: 80
      }
    };
    incoming = {
      start: {
        brightness: 100,
        x: this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.pushInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: +(this.width / 5),
        brightness: 90
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.moveIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.moveInRight(newView, animationOptions);
  };

  exports.prototype.moveInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        x: 0
      },
      end: {
        x: -this.width
      }
    };
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.moveInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        x: 0
      },
      end: {
        x: this.width
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.moveInUp = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        y: 0
      },
      end: {
        y: -this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.moveInDown = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        y: 0
      },
      end: {
        y: this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: -this.height
      },
      end: {
        y: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  exports.prototype.magicMove = function(newView, animationOptions) {
    var animationObj, existingLayers, fadeOut, i, j, layer, len, len1, match, newLayer, prevFrame, ref, ref1, ref2, remainingLayer, results, simulatedProps, sub, tempCopy, traverseSubLayers;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if ((ref = this.current) != null) {
      ref.propsBeforeAnimation = this.current.props;
    }
    newView.props = newView.propsBeforeAnimation;
    traverseSubLayers = function(layer) {
      var arr, findSubLayer;
      arr = [];
      findSubLayer = function(layer) {
        var i, len, ref1, subLayer;
        ref1 = layer.subLayers;
        for (i = 0, len = ref1.length; i < len; i++) {
          subLayer = ref1[i];
          arr.push(subLayer);
          if (subLayer.subLayers.length > 0) {
            findSubLayer(subLayer);
          }
        }
        return arr;
      };
      return findSubLayer(layer);
    };
    existingLayers = {};
    ref1 = traverseSubLayers(this.current);
    for (i = 0, len = ref1.length; i < len; i++) {
      sub = ref1[i];
      existingLayers[sub.name] = sub;
    }
    if (this.subLayers.indexOf(newView) === -1) {
      this.addSubLayer(newView);
    }
    newView.visible = true;
    newView.point = {
      x: 0,
      y: 0
    };
    this.saveCurrentToHistory({
      name: 'magicMove',
      animationOptions: animationOptions
    });
    this.current = newView;
    this.current.bringToFront();
    ref2 = traverseSubLayers(newView);
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      newLayer = ref2[j];
      if (newLayer.originalFrame == null) {
        newLayer.originalFrame = newLayer.frame;
      }
      match = existingLayers[newLayer.name];
      if (match != null) {
        prevFrame = match.frame;
        animationObj = {
          properties: newLayer.props
        };
        simulatedProps = match.props;
        delete simulatedProps['image'];
        newLayer.props = simulatedProps;
      } else {
        newLayer.opacity = 0;
        animationObj = {
          properties: {
            opacity: 1
          }
        };
      }
      _.extend(animationObj, animationOptions);
      newLayer.animate(animationObj);
      delete existingLayers[newLayer.name];
    }
    results = [];
    for (remainingLayer in existingLayers) {
      layer = existingLayers[remainingLayer];
      tempCopy = layer.copy();
      tempCopy.superLayer = newView;
      animationObj = {
        properties: {
          opacity: 0
        }
      };
      _.extend(animationObj, animationOptions);
      fadeOut = tempCopy.animate(animationObj);
      results.push(tempCopy.on(Events.AnimationEnd, function() {
        return this.destroy();
      }));
    }
    return results;
  };

  exports.prototype.transition = function(newView, direction) {
    if (direction == null) {
      direction = 'right';
    }
    switch (direction) {
      case 'up':
        return this.moveInDown(newView);
      case 'right':
        return this.pushInRight(newView);
      case 'down':
        return this.moveInUp(newView);
      case 'left':
        return this.pushInLeft(newView);
    }
  };

  return exports;

})(Layer);



},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMTAwMDM5NS9Eb2N1bWVudHMvTXlGcmFtZXIvTXlGcmFtZXIvIHZpZXdfY29udHJvbGxlcl90ZXN0L3ZpZXdfY29udHJvbF8wMS5mcmFtZXIvbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvMTAwMDM5NS9Eb2N1bWVudHMvTXlGcmFtZXIvTXlGcmFtZXIvIHZpZXdfY29udHJvbGxlcl90ZXN0L3ZpZXdfY29udHJvbF8wMS5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzZCQUFBOztBQUFBLE1BQVksQ0FBQztBQUVaLDZCQUFBLENBQUE7O0FBQWEsRUFBQSxpQkFBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCO0FBQUEsSUFPQSx5Q0FBTSxPQUFOLENBUEEsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVJYLENBQUE7QUFVQSxJQUFBLElBQUcsMkJBQUg7QUFDQyxNQUFBLElBQUMsQ0FBQSxhQUFELENBQWUsT0FBTyxDQUFDLFdBQXZCLENBQUEsQ0FERDtLQVZBO0FBQUEsSUFhQSxJQUFDLENBQUEsRUFBRCxDQUFJLGtCQUFKLEVBQXdCLFNBQUMsVUFBRCxHQUFBO0FBQ3ZC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V0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQWxVWixDQUFBOztpQkFBQTs7R0FGNEIsTUFBN0IsQ0FBQTs7Ozs7QUNJQSxPQUFPLENBQUMsS0FBUixHQUFnQixZQUFoQixDQUFBOztBQUFBLE9BRU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUEsR0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU4sRUFEb0I7QUFBQSxDQUZyQixDQUFBOztBQUFBLE9BS08sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBTGxCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgbW9kdWxlLmV4cG9ydHMgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKVwiLCB0aW1lOiAuN1xuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiYmxhY2tcIlxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXc/XG5cdFx0XHRAc3dpdGNoSW5zdGFudCBvcHRpb25zLmluaXRpYWxWaWV3XG5cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0dmlldyA9IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHRcdHVubGVzcyB2aWV3Lm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0dmlldy52aXNpYmxlID0gZmFsc2VcblxuXHRhZGQ6ICh2aWV3KSAtPiB2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChpbmNvbWluZ0FuaW1hdGlvbixvdXRnb2luZ0FuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0aW5jb21pbmdBbmltYXRpb246IGluY29taW5nQW5pbWF0aW9uXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbjogb3V0Z29pbmdBbmltYXRpb25cblxuXHRiYWNrOiAtPlxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRpZiBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbi5uYW1lIGlzICdtYWdpY01vdmUnXG5cdFx0XHRcdEBtYWdpY01vdmUgcHJldmlvdXMudmlldywgcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24uYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRiYWNrSW4gPSBwcmV2aW91cy5vdXRnb2luZ0FuaW1hdGlvbi5yZXZlcnNlKClcblx0XHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRcdGJhY2tJbi5zdGFydCgpXG5cdFx0XHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0XHRcdEBjdXJyZW50ID0gcHJldmlvdXMudmlld1xuXHRcdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRcdG1vdmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZyA9IHt9KSAtPlxuXHRcdHVubGVzcyBuZXdWaWV3IGlzIEBjdXJyZW50XG5cblx0XHRcdG5ld1ZpZXcuYW5pbWF0ZVN0b3AoKVxuXHRcdFx0IyByZXN0b3JlIHByb3BlcnRpZXMgYXMgdGhleSB3ZXJlIFxuXHRcdFx0IyBiZWZvcmUgcHJldmlvdXMgYW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudD8ucHJvcHNCZWZvcmVBbmltYXRpb24gPSBAY3VycmVudC5wcm9wc1xuXHRcdFx0bmV3Vmlldy5wcm9wcyA9IG5ld1ZpZXcucHJvcHNCZWZvcmVBbmltYXRpb25cblxuXHRcdFx0IyBhZGQgYXMgc3VibGF5ZXIgaWYgbm90IGFscmVhZHkgaW4gdmlld2NvbnRyb2xsZXJcblx0XHRcdEBhZGRTdWJMYXllciBuZXdWaWV3IGlmIEBzdWJMYXllcnMuaW5kZXhPZihuZXdWaWV3KSBpcyAtMVxuXHRcdFx0XG5cdFx0XHQjIGRlZmF1bHRzXG5cdFx0XHRuZXdWaWV3LnZpc2libGUgPSB0cnVlXG5cdFx0XHRuZXdWaWV3LnBvaW50ID0ge3g6IDAsIHk6MH1cblxuXHRcdFx0IyBBbmltYXRlIHRoZSBjdXJyZW50IHZpZXdcblx0XHRcdF8uZXh0ZW5kIEBjdXJyZW50LCBvdXRnb2luZy5zdGFydFxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb25PYmplY3QgPVxuXHRcdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0LnByb3BlcnRpZXMsIG91dGdvaW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb25PYmplY3QsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihvdXRnb2luZ0FuaW1hdGlvbk9iamVjdClcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uLnN0YXJ0KClcblxuXHRcdFx0IyBBbmltYXRlIHRoZSBuZXcgdmlld1xuXHRcdFx0Xy5leHRlbmQgbmV3VmlldywgaW5jb21pbmcuc3RhcnRcblx0XHRcdGluY29taW5nQW5pbWF0aW9uT2JqZWN0ID0gXG5cdFx0XHRcdGxheWVyOiBuZXdWaWV3XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbk9iamVjdC5wcm9wZXJ0aWVzLCBpbmNvbWluZy5lbmRcblx0XHRcdF8uZXh0ZW5kIGluY29taW5nQW5pbWF0aW9uT2JqZWN0LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oaW5jb21pbmdBbmltYXRpb25PYmplY3QpXG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBpbmNvbWluZ0FuaW1hdGlvbiwgb3V0Z29pbmdBbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAobmV3VmlldykgLT4gQGZhZGVJbiBuZXdWaWV3LCB0aW1lOiAwXG5cblx0c2xpZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QHNsaWRlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0Y3Jvc3NEaXNzb2x2ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QGZhZGVJbiBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRzY2FsZTogMS41XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFxuXHRzcGluSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHJvdGF0aW9uOiAxODBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBwdXNoSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC0oQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDgwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRwdXNoSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiArKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA5MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAbW92ZUluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdG1vdmVJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bWFnaWNNb3ZlOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXG5cdFx0IyByZXN0b3JlIHByb3BlcnRpZXMgYXMgdGhleSB3ZXJlIFxuXHRcdCMgYmVmb3JlIHByZXZpb3VzIGFuaW1hdGlvblxuXHRcdEBjdXJyZW50Py5wcm9wc0JlZm9yZUFuaW1hdGlvbiA9IEBjdXJyZW50LnByb3BzXG5cdFx0bmV3Vmlldy5wcm9wcyA9IG5ld1ZpZXcucHJvcHNCZWZvcmVBbmltYXRpb25cblxuXHRcdHRyYXZlcnNlU3ViTGF5ZXJzID0gKGxheWVyKSAtPlxuXHRcdFx0YXJyID0gW11cblx0XHRcdGZpbmRTdWJMYXllciA9IChsYXllcikgLT5cblx0XHRcdFx0Zm9yIHN1YkxheWVyIGluIGxheWVyLnN1YkxheWVyc1xuXHRcdFx0XHRcdGFyci5wdXNoIHN1YkxheWVyXG5cdFx0XHRcdFx0aWYgc3ViTGF5ZXIuc3ViTGF5ZXJzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpbmRTdWJMYXllciBzdWJMYXllclxuXHRcdFx0XHRyZXR1cm4gYXJyXG5cdFx0XHRmaW5kU3ViTGF5ZXIgbGF5ZXJcblx0XHRcblx0XHRleGlzdGluZ0xheWVycyA9IHt9XG5cdFx0Zm9yIHN1YiBpbiB0cmF2ZXJzZVN1YkxheWVycyBAY3VycmVudFxuXHRcdFx0ZXhpc3RpbmdMYXllcnNbc3ViLm5hbWVdID0gc3ViXG5cblx0XHQjIHByb3BlciBzd2l0Y2ggd2l0aCBoaXN0b3J5IHN1cHBvcnRcblx0XHRAYWRkU3ViTGF5ZXIgbmV3VmlldyBpZiBAc3ViTGF5ZXJzLmluZGV4T2YobmV3VmlldykgaXMgLTFcblx0XHRuZXdWaWV3LnZpc2libGUgPSB0cnVlXG5cdFx0bmV3Vmlldy5wb2ludCA9IHt4OjAsIHk6MH1cblx0XHRcblx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgXG5cdFx0XHRuYW1lOiAnbWFnaWNNb3ZlJ1xuXHRcdFx0YW5pbWF0aW9uT3B0aW9uczogYW5pbWF0aW9uT3B0aW9uc1xuXHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cdFx0XG5cdFx0IyBmYW5jeSBhbmltYXRpb25zIHdpdGggbWFnaWMgbW92ZVxuXHRcdGZvciBuZXdMYXllciBpbiB0cmF2ZXJzZVN1YkxheWVycyBuZXdWaWV3XG5cdFx0XHR1bmxlc3MgbmV3TGF5ZXIub3JpZ2luYWxGcmFtZT8gdGhlbiBuZXdMYXllci5vcmlnaW5hbEZyYW1lID0gbmV3TGF5ZXIuZnJhbWVcblx0XHRcdG1hdGNoID0gZXhpc3RpbmdMYXllcnNbbmV3TGF5ZXIubmFtZV1cblx0XHRcdGlmIG1hdGNoP1xuXHRcdFx0XHRwcmV2RnJhbWUgPSBtYXRjaC5mcmFtZVxuXHRcdFx0XHRhbmltYXRpb25PYmogPSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOiBuZXdMYXllci5wcm9wc1xuXHRcdFx0XHRzaW11bGF0ZWRQcm9wcyA9IG1hdGNoLnByb3BzXG5cdFx0XHRcdGRlbGV0ZSBzaW11bGF0ZWRQcm9wc1snaW1hZ2UnXVxuXHRcdFx0XHRuZXdMYXllci5wcm9wcyA9IHNpbXVsYXRlZFByb3BzXG5cdFx0XHRlbHNlICMgZmFkZSBpbiBuZXcgbGF5ZXJzXG5cdFx0XHRcdG5ld0xheWVyLm9wYWNpdHkgPSAwXG5cdFx0XHRcdGFuaW1hdGlvbk9iaiA9IFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRfLmV4dGVuZCBhbmltYXRpb25PYmosIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdG5ld0xheWVyLmFuaW1hdGUgYW5pbWF0aW9uT2JqXG5cdFx0XHRkZWxldGUgZXhpc3RpbmdMYXllcnNbbmV3TGF5ZXIubmFtZV1cblxuXHRcdCMgZmFkZSBvdXQgdW51c2VkIGxheWVyc1xuXHRcdGZvciByZW1haW5pbmdMYXllciwgbGF5ZXIgb2YgZXhpc3RpbmdMYXllcnNcblx0XHRcdHRlbXBDb3B5ID0gbGF5ZXIuY29weSgpXG5cdFx0XHR0ZW1wQ29weS5zdXBlckxheWVyID0gbmV3Vmlld1xuXHRcdFx0YW5pbWF0aW9uT2JqID0gXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdF8uZXh0ZW5kIGFuaW1hdGlvbk9iaiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0ZmFkZU91dCA9IHRlbXBDb3B5LmFuaW1hdGUgYW5pbWF0aW9uT2JqXG5cdFx0XHR0ZW1wQ29weS5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPiBAZGVzdHJveSgpXG5cblxuXHQjIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggaHR0cHM6Ly9naXRodWIuY29tL2NocmlzY2FtYXJnby9mcmFtZXItdmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cdHRyYW5zaXRpb246IChuZXdWaWV3LCBkaXJlY3Rpb24gPSAncmlnaHQnKSAtPlxuXHRcdHN3aXRjaCBkaXJlY3Rpb25cblx0XHRcdHdoZW4gJ3VwJyB0aGVuIEBtb3ZlSW5Eb3duIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIEBwdXNoSW5SaWdodCBuZXdWaWV3XG5cdFx0XHR3aGVuICdkb3duJyB0aGVuIEBtb3ZlSW5VcCBuZXdWaWV3XG5cdFx0XHR3aGVuICdsZWZ0JyB0aGVuIEBwdXNoSW5MZWZ0IG5ld1ZpZXciLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIl19
