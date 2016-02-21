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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMTAwMDM5NS9Eb2N1bWVudHMvc3R1ZHlGcmFtZXIvIHZpZXdfY29udHJvbGxlcl90ZXN0L3ZpZXdfY29udHJvbF8wMS5mcmFtZXIvbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvMTAwMDM5NS9Eb2N1bWVudHMvc3R1ZHlGcmFtZXIvIHZpZXdfY29udHJvbGxlcl90ZXN0L3ZpZXdfY29udHJvbF8wMS5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzs7QUFBTSxNQUFNLENBQUM7OztFQUVDLGlCQUFDLE9BQUQ7O01BQUMsVUFBUTs7O01BQ3JCLE9BQU8sQ0FBQyxRQUFTLE1BQU0sQ0FBQzs7O01BQ3hCLE9BQU8sQ0FBQyxTQUFVLE1BQU0sQ0FBQzs7O01BQ3pCLE9BQU8sQ0FBQyxPQUFROzs7TUFDaEIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxtQkFBb0I7UUFBQSxLQUFBLEVBQU8sZ0NBQVA7UUFBeUMsSUFBQSxFQUFNLEVBQS9DOzs7O01BQzVCLE9BQU8sQ0FBQyxrQkFBbUI7O0lBRTNCLHlDQUFNLE9BQU47SUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRVgsSUFBRywyQkFBSDtNQUNDLElBQUMsQ0FBQSxhQUFELENBQWUsT0FBTyxDQUFDLFdBQXZCLEVBREQ7O0lBR0EsSUFBQyxDQUFBLEVBQUQsQ0FBSSxrQkFBSixFQUF3QixTQUFDLFVBQUQ7QUFDdkIsVUFBQTtNQUFBLElBQUEsR0FBTyxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUE7TUFDeEIsSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFBLEdBQUEsQ0FBdEI7TUFDQSxJQUFPLElBQUksQ0FBQyxJQUFMLEtBQWEs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QUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIG1vZHVsZS5leHBvcnRzIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5pbml0aWFsVmlld05hbWUgPz0gJ2luaXRpYWxWaWV3J1xuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSlcIiwgdGltZTogLjdcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcImJsYWNrXCJcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3P1xuXHRcdFx0QHN3aXRjaEluc3RhbnQgb3B0aW9ucy5pbml0aWFsVmlld1xuXG5cdFx0QG9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdHZpZXcgPSBjaGFuZ2VMaXN0LmFkZGVkWzBdXG5cdFx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0XHR1bmxlc3Mgdmlldy5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdHZpZXcudmlzaWJsZSA9IGZhbHNlXG5cblx0YWRkOiAodmlldykgLT4gdmlldy5zdXBlckxheWVyID0gQFxuXG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoaW5jb21pbmdBbmltYXRpb24sb3V0Z29pbmdBbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGluY29taW5nQW5pbWF0aW9uOiBpbmNvbWluZ0FuaW1hdGlvblxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb246IG91dGdvaW5nQW5pbWF0aW9uXG5cblx0YmFjazogLT5cblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0aWYgcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24ubmFtZSBpcyAnbWFnaWNNb3ZlJ1xuXHRcdFx0XHRAbWFnaWNNb3ZlIHByZXZpb3VzLnZpZXcsIHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLmFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGVsc2Vcblx0XHRcdFx0YmFja0luID0gcHJldmlvdXMub3V0Z29pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cdFx0XHRcdG1vdmVPdXQgPSBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbi5yZXZlcnNlKClcblxuXHRcdFx0XHRiYWNrSW4uc3RhcnQoKVxuXHRcdFx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0XHRtb3ZlT3V0Lm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+IEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0YXBwbHlBbmltYXRpb246IChuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmcgPSB7fSkgLT5cblx0XHR1bmxlc3MgbmV3VmlldyBpcyBAY3VycmVudFxuXG5cdFx0XHRuZXdWaWV3LmFuaW1hdGVTdG9wKClcblx0XHRcdCMgcmVzdG9yZSBwcm9wZXJ0aWVzIGFzIHRoZXkgd2VyZSBcblx0XHRcdCMgYmVmb3JlIHByZXZpb3VzIGFuaW1hdGlvblxuXHRcdFx0QGN1cnJlbnQ/LnByb3BzQmVmb3JlQW5pbWF0aW9uID0gQGN1cnJlbnQucHJvcHNcblx0XHRcdG5ld1ZpZXcucHJvcHMgPSBuZXdWaWV3LnByb3BzQmVmb3JlQW5pbWF0aW9uXG5cblx0XHRcdCMgYWRkIGFzIHN1YmxheWVyIGlmIG5vdCBhbHJlYWR5IGluIHZpZXdjb250cm9sbGVyXG5cdFx0XHRAYWRkU3ViTGF5ZXIgbmV3VmlldyBpZiBAc3ViTGF5ZXJzLmluZGV4T2YobmV3VmlldykgaXMgLTFcblx0XHRcdFxuXHRcdFx0IyBkZWZhdWx0c1xuXHRcdFx0bmV3Vmlldy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0bmV3Vmlldy5wb2ludCA9IHt4OiAwLCB5OjB9XG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHRfLmV4dGVuZCBAY3VycmVudCwgb3V0Z29pbmcuc3RhcnRcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0ID1cblx0XHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbk9iamVjdC5wcm9wZXJ0aWVzLCBvdXRnb2luZy5lbmRcblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24ob3V0Z29pbmdBbmltYXRpb25PYmplY3QpXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgbmV3IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG5ld1ZpZXcsIGluY29taW5nLnN0YXJ0XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCA9IFxuXHRcdFx0XHRsYXllcjogbmV3Vmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb25PYmplY3QucHJvcGVydGllcywgaW5jb21pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0aW5jb21pbmdBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKGluY29taW5nQW5pbWF0aW9uT2JqZWN0KVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgaW5jb21pbmdBbmltYXRpb24sIG91dGdvaW5nQW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKG5ld1ZpZXcpIC0+IEBmYWRlSW4gbmV3VmlldywgdGltZTogMFxuXG5cdHNsaWRlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBzbGlkZUluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGNyb3NzRGlzc29sdmU6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBmYWRlSW4gbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0XG5cdHpvb21JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHR6b29tZWRJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0c3BpbkluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRyb3RhdGlvbjogMTgwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHJvdGF0aW9uOiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAcHVzaEluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAtKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA4MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogKyhAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QG1vdmVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRtb3ZlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbkRvd246IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1hZ2ljTW92ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblxuXHRcdCMgcmVzdG9yZSBwcm9wZXJ0aWVzIGFzIHRoZXkgd2VyZSBcblx0XHQjIGJlZm9yZSBwcmV2aW91cyBhbmltYXRpb25cblx0XHRAY3VycmVudD8ucHJvcHNCZWZvcmVBbmltYXRpb24gPSBAY3VycmVudC5wcm9wc1xuXHRcdG5ld1ZpZXcucHJvcHMgPSBuZXdWaWV3LnByb3BzQmVmb3JlQW5pbWF0aW9uXG5cblx0XHR0cmF2ZXJzZVN1YkxheWVycyA9IChsYXllcikgLT5cblx0XHRcdGFyciA9IFtdXG5cdFx0XHRmaW5kU3ViTGF5ZXIgPSAobGF5ZXIpIC0+XG5cdFx0XHRcdGZvciBzdWJMYXllciBpbiBsYXllci5zdWJMYXllcnNcblx0XHRcdFx0XHRhcnIucHVzaCBzdWJMYXllclxuXHRcdFx0XHRcdGlmIHN1YkxheWVyLnN1YkxheWVycy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaW5kU3ViTGF5ZXIgc3ViTGF5ZXJcblx0XHRcdFx0cmV0dXJuIGFyclxuXHRcdFx0ZmluZFN1YkxheWVyIGxheWVyXG5cdFx0XG5cdFx0ZXhpc3RpbmdMYXllcnMgPSB7fVxuXHRcdGZvciBzdWIgaW4gdHJhdmVyc2VTdWJMYXllcnMgQGN1cnJlbnRcblx0XHRcdGV4aXN0aW5nTGF5ZXJzW3N1Yi5uYW1lXSA9IHN1YlxuXG5cdFx0IyBwcm9wZXIgc3dpdGNoIHdpdGggaGlzdG9yeSBzdXBwb3J0XG5cdFx0QGFkZFN1YkxheWVyIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cdFx0bmV3Vmlldy52aXNpYmxlID0gdHJ1ZVxuXHRcdG5ld1ZpZXcucG9pbnQgPSB7eDowLCB5OjB9XG5cdFx0XG5cdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IFxuXHRcdFx0bmFtZTogJ21hZ2ljTW92ZSdcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6IGFuaW1hdGlvbk9wdGlvbnNcblx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXHRcdFxuXHRcdCMgZmFuY3kgYW5pbWF0aW9ucyB3aXRoIG1hZ2ljIG1vdmVcblx0XHRmb3IgbmV3TGF5ZXIgaW4gdHJhdmVyc2VTdWJMYXllcnMgbmV3Vmlld1xuXHRcdFx0dW5sZXNzIG5ld0xheWVyLm9yaWdpbmFsRnJhbWU/IHRoZW4gbmV3TGF5ZXIub3JpZ2luYWxGcmFtZSA9IG5ld0xheWVyLmZyYW1lXG5cdFx0XHRtYXRjaCA9IGV4aXN0aW5nTGF5ZXJzW25ld0xheWVyLm5hbWVdXG5cdFx0XHRpZiBtYXRjaD9cblx0XHRcdFx0cHJldkZyYW1lID0gbWF0Y2guZnJhbWVcblx0XHRcdFx0YW5pbWF0aW9uT2JqID0gXG5cdFx0XHRcdFx0cHJvcGVydGllczogbmV3TGF5ZXIucHJvcHNcblx0XHRcdFx0c2ltdWxhdGVkUHJvcHMgPSBtYXRjaC5wcm9wc1xuXHRcdFx0XHRkZWxldGUgc2ltdWxhdGVkUHJvcHNbJ2ltYWdlJ11cblx0XHRcdFx0bmV3TGF5ZXIucHJvcHMgPSBzaW11bGF0ZWRQcm9wc1xuXHRcdFx0ZWxzZSAjIGZhZGUgaW4gbmV3IGxheWVyc1xuXHRcdFx0XHRuZXdMYXllci5vcGFjaXR5ID0gMFxuXHRcdFx0XHRhbmltYXRpb25PYmogPSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0Xy5leHRlbmQgYW5pbWF0aW9uT2JqLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRuZXdMYXllci5hbmltYXRlIGFuaW1hdGlvbk9ialxuXHRcdFx0ZGVsZXRlIGV4aXN0aW5nTGF5ZXJzW25ld0xheWVyLm5hbWVdXG5cblx0XHQjIGZhZGUgb3V0IHVudXNlZCBsYXllcnNcblx0XHRmb3IgcmVtYWluaW5nTGF5ZXIsIGxheWVyIG9mIGV4aXN0aW5nTGF5ZXJzXG5cdFx0XHR0ZW1wQ29weSA9IGxheWVyLmNvcHkoKVxuXHRcdFx0dGVtcENvcHkuc3VwZXJMYXllciA9IG5ld1ZpZXdcblx0XHRcdGFuaW1hdGlvbk9iaiA9IFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRfLmV4dGVuZCBhbmltYXRpb25PYmosIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGZhZGVPdXQgPSB0ZW1wQ29weS5hbmltYXRlIGFuaW1hdGlvbk9ialxuXHRcdFx0dGVtcENvcHkub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgLT4gQGRlc3Ryb3koKVxuXG5cblx0IyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc2NhbWFyZ28vZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlclxuXHR0cmFuc2l0aW9uOiAobmV3VmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHR3aGVuICd1cCcgdGhlbiBAbW92ZUluRG93biBuZXdWaWV3XG5cdFx0XHR3aGVuICdyaWdodCcgdGhlbiBAcHVzaEluUmlnaHQgbmV3Vmlld1xuXHRcdFx0d2hlbiAnZG93bicgdGhlbiBAbW92ZUluVXAgbmV3Vmlld1xuXHRcdFx0d2hlbiAnbGVmdCcgdGhlbiBAcHVzaEluTGVmdCBuZXdWaWV3IiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSJdfQ==
