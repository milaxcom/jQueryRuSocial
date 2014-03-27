/**
 * jQueryRuSocial v1.0
 *
 * Copyright Milax
 * http://www.milax.com/
 *
 * Author
 * Maksim Gusakov
 */

var _RuSocial = new Object;

_RuSocial.replace = function (str, obj) {
	for (var _i in obj) {
		str = str.replace(new RegExp('{'+_i+'}','gi'), obj[_i]);
	}
	return str;
};

_RuSocial.getData = function () {

	var $els = $("meta[property ^= 'og:']");

	var data = {};
	var property, content;

	$els.each(function () {
		content = $(this).attr("content");
		property = $(this).attr("property").substr(3);
		data[property] = content;
	});
	
	return data;
};

/** Алгоритм VK Like */
_RuSocial.likeVk = function ($element, data) {

	var tmpl1 = "<script type='text/javascript' src='//vk.com/js/api/openapi.js?109'></script><div id='vk_like'></div>";

	var tmpl2 = "VK.init({apiId: {VkLikeApi}, onlyWidgets: true}); VK.Widgets.Like('vk_like', {type: 'button', height: '20px', pageUrl:'{url}', verb: 1, page_id:'{PageId}'});";

	$element.append( _RuSocial.replace( tmpl1, data ) );

	var check = function () {
		if (typeof VK != "undefined") 
			eval( _RuSocial.replace( tmpl2, data ) );
		else 
			setTimeout (function () { check(); }, 1000);
	};

	check();

};

_RuSocial.likeFb = function ($element, data) {

	var tmpl1 = "<iframe src='http://www.facebook.com/plugins/like.php?href={url}&layout=button_count&show_faces=true&width=200&action=like&colorscheme=light&height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:200px; height:21px;' allowTransparency='true'></iframe>";

	$element.append( _RuSocial.replace( tmpl1, data ) );

};

_RuSocial.likeOk = function ($element, data) {
	
	var tmpl1 = "<div id='ok_shareWidget'></div>";

	var tmpl2 = "!function (d, id, did, st) { var js = d.createElement('script'); js.src = 'http://connect.ok.ru/connect.js'; js.onload = js.onreadystatechange = function () { if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') { if (!this.executed) { this.executed = true; setTimeout(function () { OK.CONNECT.insertShareWidget(id,did,st); }, 0); } }}; d.documentElement.appendChild(js); }(document,'ok_shareWidget','{PageUrl}','{width:170,height:30,st:\"rounded\",sz:20,ck:3}');";

	$element.append( _RuSocial.replace( tmpl1, data ) );

	eval( _RuSocial.replace( tmpl2, data ) );

};

_RuSocial.shareTw = function ($element, data) {
	
	var tmpl1 = "<a href='https://twitter.com/share' data-url='{url}' class='twitter-share-button' data-text='{title}' data-lang='ru'>Твитнуть</a>";

	var tmpl2 = "!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');";

	$element.append( _RuSocial.replace( tmpl1, data ) );

	eval(tmpl2);

};


(function($) {

	/**
	 * Launch-метод.
	 * @this	$jq		this		Контейнер
	 * @param	object	option		Объект-масив, содержащий параметры плагина.
	 * @return	void
	 */
	$.fn.RuSocial = function( option ) {

		option = option || {};

		var data = _RuSocial.getData();

		var socials = {
			"like-vk" : _RuSocial.likeVk,
			"like-fb" : _RuSocial.likeFb,
			"like-ok" : _RuSocial.likeOk,
			"share-tw" : _RuSocial.shareTw
		};

	    var make = function() {

			for (var key in socials) {

				if ($(this).hasClass(key)) {

					socials[key]($(this), data);

				}

			}
	    	
	    };
	 	
	    return this.each( make ); 

	};

})(jQuery);