/* 基本图文组件对象 */

var H5ComponentBase = function (name, cfg) {
	cfg = cfg || {};

	// 页面中有多个组件，通过id区分
	var id = ("h5_c_" + Math.random()).replace(".", "_");
	// class用于区分组件类型，因为页面中将会有多个类型的组件
	// 另外也要区分同类型相同之间的组件，如果不通过id来区分的话通过name参数
	var className = " h5_component" + cfg.type + " h5_component_name_" + name;

	//这个就是组件
	var component = $("<div class='h5_component"+className+"' id='"+id+"'></div>");

	cfg.text && component.text(cfg.text);
	cfg.css && component.css(cfg.css);
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
	cfg.center && component.css("marginLeft", -cfg.width/4).addClass('h5_component_center');
	cfg.bg && component.css({'backgroundImage': "url("+ cfg.bg+")", 'backgroundSize': "100%"});

	// 绑定自定义事件

	component.on("leave",function() {
		var that = $(this);		// setTimeout函数是window对象的方法，所以必须将this给到一个变量。
		setTimeout(function () {
			that.addClass('h5_component_leave').removeClass('h5_component_enter');
			cfg.animateOut && that.animate(cfg.animateOut, "10");
		}, cfg.delay || 0)	// 定时器是为了一个页面多个组件的不同时间动画。利用delay参数的不同

		return false;
		
	});
	component.on("enter",function() {
		var that = $(this);
		setTimeout(function () {
			that.addClass('h5_component_enter').removeClass('h5_component_leave');
			cfg.animateIn && that.animate(cfg.animateIn);
		}, cfg.delay || 0)

		return false;
	})


	//返回这个组件
	return component;
}

