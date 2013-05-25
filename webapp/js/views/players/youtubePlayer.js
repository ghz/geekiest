define([
	'jquery',
	'backbone',
	'mustache',
	'text!templates/player/youtube.html',
	'libs/jquery.slider.min',

	],
function($,
	Backbone,
	Mustache,
	YoutubePlayerTemplate
	){
	return Backbone.View.extend({
		tagName: 'div',

		isPlaying: false,
		intervalTimer: null,

		startPicker: 0,
		endPicker: 0,
        
        initialize : function()
        {
        	this.endPicker = this.model.duration;
        },

        events: {
        	'click .playpausebtn' : 'playPauseBtnClick',
        	'click .overlay' : 'playPauseBtnClick'
        },

        render: function()
        {
        	var html = Mustache.to_html(YoutubePlayerTemplate,this.model);

			this.$el.html(html);

        	return this;
        },

        initPicker: function()
        {
        	var self = this;
		 	$("#videoPicker").slider({
				from: 0,
				to: this.model.duration,
				step: 1,
				dimension: '',
				limits: false,
				calculate: function( value ){
					var hours = Math.floor( value / 60 );
					var mins = ( value - hours*60 );
					return (hours < 10 ? "0"+hours : hours) + "     :     " + ( mins == 0 ? "00" : mins );
				},
				onstatechange: function( value ){
					if(!_.isUndefined(player))
					{
						self.updateCursorPos(value);
					}
				}
			});
        },

        playPauseBtnClick: function()
        {
        	if(this.isPlaying)
        	{
        		player.pauseVideo();
        		$('.playpausebtn').removeClass('play');
        		this.isPlaying = false;
        		clearInterval(this.intervalTimer);
        	}
        	else
        	{
        		player.playVideo();
        		$('.playpausebtn').addClass('play');
        		this.isPlaying = true;

    			var self = this;
        		this.intervalTimer = setInterval(function(){


    				var currentTime = player.getCurrentTime();

    				var pCt = currentTime / self.model.duration * 100;
				    $('.currentpos').css('left', pCt+"%");

    				if(currentTime > self.endPicker || currentTime < self.startPicker)
    				{
    					player.seekTo(self.startPicker)
    				}




				},500);
        	}
        },

        updateCursorPos: function(value)
        {
        	var dataSplit = value.split(";");
    		this.startPicker = dataSplit[0];
    		this.endPicker = dataSplit[1];

    		var currentPos = player.getCurrentTime();
    		var newCurrentPos = currentPos;

    		if(currentPos<this.startPicker)
    		{
    			newCurrentPos = this.startPicker;
    		}
    		else if(currentPos>this.endPicker)
    		{
    			newCurrentPos = this.endPicker;
    		}

			var pCt = newCurrentPos / this.model.duration * 100;
		    $('.currentpos').css('left', pCt+"%");

    		player.seekTo(newCurrentPos);
        }


	});
});