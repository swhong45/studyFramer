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
    if (options.perspective == null) {
      options.perspective = 1000;
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
    var animationObj, existingLayers, fadeOut, i, j, layer, len, len1, match, newFrame, prevFrame, ref, ref1, ref2, remainingLayer, results, sub, tempCopy, traverseSubLayers;
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
      sub = ref2[j];
      if (sub.originalFrame == null) {
        sub.originalFrame = sub.frame;
      }
      match = existingLayers[sub.name];
      if (match != null) {
        newFrame = sub.originalFrame;
        prevFrame = match.frame;
        sub.frame = prevFrame;
        animationObj = {
          properties: {
            x: newFrame.x,
            y: newFrame.y,
            width: newFrame.width,
            height: newFrame.height,
            opacity: 1
          }
        };
      } else {
        sub.opacity = 0;
        animationObj = {
          properties: {
            opacity: 1
          }
        };
      }
      _.extend(animationObj, animationOptions);
      sub.animate(animationObj);
      delete existingLayers[sub.name];
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


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMTAwMDM5NS9Eb2N1bWVudHMvc3R1ZHlGcmFtZXIvZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzs7QUFBTSxNQUFNLENBQUM7OztFQUVDLGlCQUFDLE9BQUQ7O01BQUMsVUFBUTs7O01BQ3JCLE9BQU8sQ0FBQyxRQUFTLE1BQU0sQ0FBQzs7O01BQ3hCLE9BQU8sQ0FBQyxTQUFVLE1BQU0sQ0FBQzs7O01BQ3pCLE9BQU8sQ0FBQyxPQUFROzs7TUFDaEIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxtQkFBb0I7UUFBQSxLQUFBLEVBQU8sZ0NBQVA7UUFBeUMsSUFBQSxFQUFNLEVBQS9DOzs7O01BQzVCLE9BQU8sQ0FBQyxrQkFBbUI7OztNQUMzQixPQUFPLENBQUMsY0FBZTs7SUFFdkIseUNBQU0sT0FBTjtJQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFFWCxJQUFHLDJCQUFIO01BQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxPQUFPLENBQUMsV0FBdkIsRUFERDs7SUFHQSxJQUFDLENBQUEsRUFBRCxDQUFJLGtCQUFKLEVBQXdCLFNBQUMsVUFBRDtBQUN2QixVQUFBO01BQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQTtNQUN4QixJQUFJLENBQUMsRUFBTCxDQUFRLE1BQU0sQ0FBQyxLQUFmLEVBQXNCLFNBQUEsR0FBQSxDQUF0QjtNQUNBLElBQU8sSUFBSSxDQUFDLElBQUwsS0FBYSxPQUFPLENBQUMsZUFBNUI7ZUFDQyxJQUFJLENBQUMsT0FBTCxHQUFlLE1BRGhCOztJQUh1QixDQUF4QjtFQWZZOztvQkFxQmIsR0FBQSxHQUFLLFNBQUMsSUFBRDtXQUFVLElBQUksQ0FBQyxVQUFMLEdB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bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBtb2R1bGUuZXhwb3J0cyBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlldz9cblx0XHRcdEBzd2l0Y2hJbnN0YW50IG9wdGlvbnMuaW5pdGlhbFZpZXdcblxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHR2aWV3ID0gY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdFx0dW5sZXNzIHZpZXcubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0XHR2aWV3LnZpc2libGUgPSBmYWxzZVxuXG5cdGFkZDogKHZpZXcpIC0+IHZpZXcuc3VwZXJMYXllciA9IEBcblxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGluY29taW5nQW5pbWF0aW9uLG91dGdvaW5nQW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbjogaW5jb21pbmdBbmltYXRpb25cblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uOiBvdXRnb2luZ0FuaW1hdGlvblxuXG5cdGJhY2s6IC0+XG5cdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdGlmIHByZXZpb3VzLnZpZXc/XG5cblx0XHRcdGlmIHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLm5hbWUgaXMgJ21hZ2ljTW92ZSdcblx0XHRcdFx0QG1hZ2ljTW92ZSBwcmV2aW91cy52aWV3LCBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbi5hbmltYXRpb25PcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGJhY2tJbiA9IHByZXZpb3VzLm91dGdvaW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXHRcdFx0XHRtb3ZlT3V0ID0gcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cblx0XHRcdFx0YmFja0luLnN0YXJ0KClcblx0XHRcdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdFx0bW92ZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdGFwcGx5QW5pbWF0aW9uOiAobmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nID0ge30pIC0+XG5cdFx0dW5sZXNzIG5ld1ZpZXcgaXMgQGN1cnJlbnRcblxuXHRcdFx0bmV3Vmlldy5hbmltYXRlU3RvcCgpXG5cdFx0XHQjIHJlc3RvcmUgcHJvcGVydGllcyBhcyB0aGV5IHdlcmUgXG5cdFx0XHQjIGJlZm9yZSBwcmV2aW91cyBhbmltYXRpb25cblx0XHRcdEBjdXJyZW50Py5wcm9wc0JlZm9yZUFuaW1hdGlvbiA9IEBjdXJyZW50LnByb3BzXG5cdFx0XHRuZXdWaWV3LnByb3BzID0gbmV3Vmlldy5wcm9wc0JlZm9yZUFuaW1hdGlvblxuXG5cdFx0XHQjIGFkZCBhcyBzdWJsYXllciBpZiBub3QgYWxyZWFkeSBpbiB2aWV3Y29udHJvbGxlclxuXHRcdFx0QGFkZFN1YkxheWVyIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cdFx0XHRcblx0XHRcdCMgZGVmYXVsdHNcblx0XHRcdG5ld1ZpZXcudmlzaWJsZSA9IHRydWVcblx0XHRcdG5ld1ZpZXcucG9pbnQgPSB7eDogMCwgeTowfVxuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIGN1cnJlbnQgdmlld1xuXHRcdFx0Xy5leHRlbmQgQGN1cnJlbnQsIG91dGdvaW5nLnN0YXJ0XG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbk9iamVjdCA9XG5cdFx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb25PYmplY3QucHJvcGVydGllcywgb3V0Z29pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbk9iamVjdCwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0b3V0Z29pbmdBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0KVxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIG5ldyB2aWV3XG5cdFx0XHRfLmV4dGVuZCBuZXdWaWV3LCBpbmNvbWluZy5zdGFydFxuXHRcdFx0aW5jb21pbmdBbmltYXRpb25PYmplY3QgPSBcblx0XHRcdFx0bGF5ZXI6IG5ld1ZpZXdcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIGluY29taW5nQW5pbWF0aW9uT2JqZWN0LnByb3BlcnRpZXMsIGluY29taW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb25PYmplY3QsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGluY29taW5nQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihpbmNvbWluZ0FuaW1hdGlvbk9iamVjdClcblx0XHRcdGluY29taW5nQW5pbWF0aW9uLnN0YXJ0KClcblxuXHRcdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IGluY29taW5nQW5pbWF0aW9uLCBvdXRnb2luZ0FuaW1hdGlvblxuXHRcdFx0QGN1cnJlbnQgPSBuZXdWaWV3XG5cdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6IChuZXdWaWV3KSAtPiBAZmFkZUluIG5ld1ZpZXcsIHRpbWU6IDBcblxuXHRzbGlkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAc2xpZGVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkRvd246IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRjcm9zc0Rpc3NvbHZlOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAZmFkZUluIG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFxuXHR6b29tSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHNjYWxlOiAxLjVcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0cm90YXRpb246IDE4MFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRyb3RhdGlvbjogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QHB1c2hJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLShAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogODBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdHB1c2hJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6ICsoQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDkwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBtb3ZlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0bW92ZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtYWdpY01vdmU6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cblx0XHQjIHJlc3RvcmUgcHJvcGVydGllcyBhcyB0aGV5IHdlcmUgXG5cdFx0IyBiZWZvcmUgcHJldmlvdXMgYW5pbWF0aW9uXG5cdFx0QGN1cnJlbnQ/LnByb3BzQmVmb3JlQW5pbWF0aW9uID0gQGN1cnJlbnQucHJvcHNcblx0XHRuZXdWaWV3LnByb3BzID0gbmV3Vmlldy5wcm9wc0JlZm9yZUFuaW1hdGlvblxuXG5cdFx0dHJhdmVyc2VTdWJMYXllcnMgPSAobGF5ZXIpIC0+XG5cdFx0XHRhcnIgPSBbXVxuXHRcdFx0ZmluZFN1YkxheWVyID0gKGxheWVyKSAtPlxuXHRcdFx0XHRmb3Igc3ViTGF5ZXIgaW4gbGF5ZXIuc3ViTGF5ZXJzXG5cdFx0XHRcdFx0YXJyLnB1c2ggc3ViTGF5ZXJcblx0XHRcdFx0XHRpZiBzdWJMYXllci5zdWJMYXllcnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmluZFN1YkxheWVyIHN1YkxheWVyXG5cdFx0XHRcdHJldHVybiBhcnJcblx0XHRcdGZpbmRTdWJMYXllciBsYXllclxuXHRcdFxuXHRcdGV4aXN0aW5nTGF5ZXJzID0ge31cblx0XHRmb3Igc3ViIGluIHRyYXZlcnNlU3ViTGF5ZXJzIEBjdXJyZW50XG5cdFx0XHRleGlzdGluZ0xheWVyc1tzdWIubmFtZV0gPSBzdWJcblxuXHRcdCMgcHJvcGVyIHN3aXRjaCB3aXRoIGhpc3Rvcnkgc3VwcG9ydFxuXHRcdEBhZGRTdWJMYXllciBuZXdWaWV3IGlmIEBzdWJMYXllcnMuaW5kZXhPZihuZXdWaWV3KSBpcyAtMVxuXHRcdG5ld1ZpZXcudmlzaWJsZSA9IHRydWVcblx0XHRuZXdWaWV3LnBvaW50ID0ge3g6MCwgeTowfVxuXHRcdFxuXHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBcblx0XHRcdG5hbWU6ICdtYWdpY01vdmUnXG5cdFx0XHRhbmltYXRpb25PcHRpb25zOiBhbmltYXRpb25PcHRpb25zXG5cdFx0QGN1cnJlbnQgPSBuZXdWaWV3XG5cdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblx0XHRcblx0XHQjIGZhbmN5IGFuaW1hdGlvbnMgd2l0aCBtYWdpYyBtb3ZlXG5cdFx0Zm9yIHN1YiBpbiB0cmF2ZXJzZVN1YkxheWVycyBuZXdWaWV3XG5cdFx0XHR1bmxlc3Mgc3ViLm9yaWdpbmFsRnJhbWU/IHRoZW4gc3ViLm9yaWdpbmFsRnJhbWUgPSBzdWIuZnJhbWVcblx0XHRcdG1hdGNoID0gZXhpc3RpbmdMYXllcnNbc3ViLm5hbWVdXG5cdFx0XHRpZiBtYXRjaD9cblx0XHRcdFx0bmV3RnJhbWUgPSBzdWIub3JpZ2luYWxGcmFtZVxuXHRcdFx0XHRwcmV2RnJhbWUgPSBtYXRjaC5mcmFtZVxuXHRcdFx0XHRzdWIuZnJhbWUgPSBwcmV2RnJhbWVcblx0XHRcdFx0YW5pbWF0aW9uT2JqID0gXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHg6IG5ld0ZyYW1lLnhcblx0XHRcdFx0XHRcdHk6IG5ld0ZyYW1lLnlcblx0XHRcdFx0XHRcdHdpZHRoOiBuZXdGcmFtZS53aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBuZXdGcmFtZS5oZWlnaHRcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdGVsc2UgIyBmYWRlIGluIG5ldyBsYXllcnNcblx0XHRcdFx0c3ViLm9wYWNpdHkgPSAwXG5cdFx0XHRcdGFuaW1hdGlvbk9iaiA9IFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRfLmV4dGVuZCBhbmltYXRpb25PYmosIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdHN1Yi5hbmltYXRlIGFuaW1hdGlvbk9ialxuXHRcdFx0ZGVsZXRlIGV4aXN0aW5nTGF5ZXJzW3N1Yi5uYW1lXVxuXG5cdFx0IyBmYWRlIG91dCB1bnVzZWQgbGF5ZXJzXG5cdFx0Zm9yIHJlbWFpbmluZ0xheWVyLCBsYXllciBvZiBleGlzdGluZ0xheWVyc1xuXHRcdFx0dGVtcENvcHkgPSBsYXllci5jb3B5KClcblx0XHRcdHRlbXBDb3B5LnN1cGVyTGF5ZXIgPSBuZXdWaWV3XG5cdFx0XHRhbmltYXRpb25PYmogPSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0Xy5leHRlbmQgYW5pbWF0aW9uT2JqLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRmYWRlT3V0ID0gdGVtcENvcHkuYW5pbWF0ZSBhbmltYXRpb25PYmpcblx0XHRcdHRlbXBDb3B5Lm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+IEBkZXN0cm95KClcblxuXG5cdCMgQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0dHJhbnNpdGlvbjogKG5ld1ZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0d2hlbiAndXAnIHRoZW4gQG1vdmVJbkRvd24gbmV3Vmlld1xuXHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gQHB1c2hJblJpZ2h0IG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2Rvd24nIHRoZW4gQG1vdmVJblVwIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gQHB1c2hJbkxlZnQgbmV3VmlldyJdfQ==
