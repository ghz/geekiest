define([
		'backbone',
		"mustache",
		'packages/CustomView',
		'text!templates/home/splashscreen.html'
		],
function(
		Backbone,
		Mustache,
		CustomView,
		SplashScreenTemplate
){
	return  Backbone.View.extend({
		el: 'body',

        initialize: function(opts)
        {
        	this.router = opts.router;

        	if(localStorage.getItem("userToken"))
        	{
        		this.router.navigate("invit", {trigger: true, replace: true});	
        		return;	 
        	}

        	var html = Mustache.to_html(SplashScreenTemplate);
        	this.$el.html(html);
        },

        events: {
        	'click .facebook': 'facebookClick',
        	'click .howto': 'howtoClick',
        },

        facebookClick: function(e) {
        	e.preventDefault();

        	$('.facebook')
        		.addClass('refresh')
        		.html('<img src="img/btn_refresh.png" class="rotate btn_wait" />');

        	var self = this;
        	var datas;
		    FB.login(function(response){
		        if(response.authResponse){

	        	$.ajax({
					  type: "POST",
					  url: 'http://serene-forest-6114.herokuapp.com/users/login',
					  data: response,
					  success: function(response){
					  	datas = JSON.parse(response);

					  	localStorage.setItem("userToken", datas.token);
					  	localStorage.setItem("userName", datas["name"]);
					  	localStorage.setItem('userAvatar', datas.avatar);

					  	self.router.navigate("invit", {trigger: true, replace: true});
					  }
					});

		        }
		      },{scope : 'email,read_friendlists'});
        },

        howtoClick: function(e) {	
        	e.preventDefault();
        	this.router.navigate("howto", {trigger: true, replace: true});
        },
	});
});