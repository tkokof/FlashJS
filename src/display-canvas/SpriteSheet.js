/*
* SpriteSheet is a part of FlashJS engine
*
* http://flashjs.com
*
* Copyright (c) 2011 - 2012 pixelsresearch.com,
*/

(function(w){
	var SpriteSheet = function(image, width, height, total, animationsData){
		this.data = image;

        this.frames = [];
        this.flippedFrames = [];
        this.animations = {};

        this._frameWidth = width;
		this._frameHeight = height;
		this._totalFrames = total;
		this._animationsData = animationsData;

		this.initAnimations();

		if (image !== undefined){
			if (image.constructor == Array){
				this.fillFramesFromImagesArray();
			} else {
				this.fillFramesFromSpritesheet();
			}	
		}
	}

	p = SpriteSheet.prototype;

	p.data = {};

	p._frameWidth = 0;
	p._frameHeight = 0;
	p._totalFrames = 0;

	p.fillFramesFromSpritesheet = function(){
		var rows = Math.round(this.data.width / this._frameWidth);
		var columns = Math.round(this.data.height / this._frameHeight);

		for (var c = 0; c < columns; c++){
			for (var r = 0; r < rows; r++){
				if (this.frames.length <= this._totalFrames){
					var canvas = document.createElement("canvas");
					
					canvas.width = this._frameWidth;
					canvas.height = this._frameHeight;
					
					var context = canvas.getContext("2d");
					context.drawImage(this.data, this._frameWidth * r, this._frameHeight * c,this._frameWidth,this._frameHeight,0,0,this._frameWidth,this._frameHeight);
					this.frames.push(canvas);
				}
			}
		}
	}

	p.fillFramesFromImagesArray = function(){
		this.frames = this.data;
	}

    p.fillFlippedFrames = function(){
        for (var i = 0; i < this.frames.length; i++){
            var currentAnimation = this.getAnimationByFrameNumber(i);
            if (currentAnimation !== undefined && currentAnimation.makeFlip) {
                this.flippedFrames.push(this.getFlippedFrame(this.frames[i]));
            } else {
                this.flippedFrames.push(undefined);
            }
        }
    }

    p.getFlippedFrame = function(imageData){

        var canvas = document.createElement("canvas");
        canvas.width = this._frameWidth;
        canvas.height = this._frameHeight;
        var context = canvas.getContext("2d");

        var newCanvas = document.createElement("canvas");
        newCanvas.width = this._frameWidth;
        newCanvas.height = this._frameHeight;
        var newContext = newCanvas.getContext("2d");

        context.save();
        context.scale(-1, 1);
        context.drawImage(imageData, -this._frameWidth, 0);
        newContext.drawImage(canvas, 0, 0);
        context.restore();

        return newCanvas;
    }

    p.getAnimationByFrameNumber = function(frameNumber){
        for (var key in this.animations) {
            var animationToCheck = this.animations[key];

            if (animationToCheck.startFrame <= frameNumber && animationToCheck.endFrame >= frameNumber){
                return animationToCheck;
            }
        }

        return undefined;
    }

	p.initAnimations = function(){
		for(var animationName in this._animationsData) {
			this.animations[animationName] = {
				"name":animationName,
				"startFrame":this._animationsData[animationName].startFrame, 
				"endFrame":this._animationsData[animationName].endFrame, 
				"interval":this._animationsData[animationName].interval,
                "makeFlip":this._animationsData[animationName].makeFlip,
				"looped":this._animationsData[animationName].looped};
		}
	}

	w.flash.cloneToNamespaces(SpriteSheet, 'SpriteSheet');
})(window);