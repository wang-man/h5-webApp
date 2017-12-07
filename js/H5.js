/* 内容管理对象 */
var H5 = function() {
	this.id = ("h5_" + Math.random()).replace(".", "_");
	this.el = $('<div class="h5" id="'+this.id+'"></div>').hide();	//初始化的时候是隐藏的，原因见loader方法

	 // 因为页脚部分是每一页都有的，所以可以将其封装，方便在addPag内部调用
     this.addFooter = function() {
            this.addComponent("footer", {height:40, bg: "imgs/footer.png", css:{width: "100%", opacity: 0, bottom: -20, zIndex: 99}, 
            	animateIn: { opacity:1,bottom:0},animateOut:{opacity:0,bottom:-20}, delay:800});
        };

	// 定义一个数组，用于存储创建的page，目的是为了正确的取得该page并向其中插入组件，原理：
	// 因为组件是跟随在page后创建，每创建一个page，就将此page插入数组，然后取得数组最后一位，就是该page，就可以向它插入组件
	this.page = [];

	// h5对象是body元素里最外层的唯一的div，所以这里直接插入页面。
	// 而不像组件对象需要在实例化的时候一个个插入页面。
	$('body').append(this.el);

	/*
	 * 新增一个页
	 * @param{string} name 组件的名称，将会加入到className中
	 * @param{string} text 组件的默认文本
	 * @return {H5} H5对象，可以重复使用H5对象，实现链式调用
	*/

	// 新增一个页
	this.addPage = function(name, text) {
		var page = $('<div class="section"></div>');

		if (name != undefined) {
			page.addClass("h5_" + name)
		}

		if (text != undefined) {
			page.text(text);
		}

		this.page.push(page);	//将page插入数组，也就是插入到了实例化的的数组
		this.el.append(page);

		// 页脚部分直接在添加page的时候执行
		if (typeof this.addFooter === "function") {
			this.addFooter();
		}
		return this;
	}

	// 页里新增一个组件
	this.addComponent = function(name, cfg) {
		cfg = cfg || {};
		cfg = $.extend({type: "base"}, cfg);	//extend方法用于将一个或多个对象的内容合并到目标对象，返回目标对象
												//这里是为了让cfg有一个type参数，默认为base，如果自带了，那就是自带的
		var component;	//定义一个变量，存储组件元素
		switch (cfg.type) {
			case "base":
				component = new H5ComponentBase(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "bar":
				component = new H5ComponentBar(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "Polyline":
				component = new H5ComponentPolyline(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "Pie":
				component = new H5ComponentPie(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "Radar":
				component = new H5ComponentRadar(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "Ring":
				component = new H5ComponentRing(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			case "Point":
				component = new H5ComponentPoint(name, cfg);	//H5ComponentBase来自基本组件js
				break;
			default:
				// statements_def
				break;
		}

		var page = this.page.slice(-1)[0];		// 取得最后创建的page，此组件就是插入其中。这里是关键的地方
		page.append(component);					// 否则在创建完page后，然后创建组件并不能确定插入了哪个页面

		// 如果组件内部有事件，则添加事件
		if (typeof cfg.click === "function") {
			component.on('click',cfg.click);
		}


		return this;
	}

	// page页面创建完成后，h5对象的div才显示到页面
	// 因为当我们在创建很多页面，并且有图像资源，造成页面过大，这个时候可以先创建元素完毕，然后再显示。
	this.loader = function(firstPage) {
		this.el.show();
		this.el.fullpage({		//实现滚动功能
			//页面离开和进入的回调函数
			onLeave:function(index, nextIndex, direction) {     //滚动前
				// 触发此事件的对象是page，所以用$(this)，然后找到组件
			    $(this).find('.h5_component').trigger('leave'); //触发自定义leave事件
			},
			afterLoad:function(anchorLink , index) {            //滚动后
			    $(this).find('.h5_component').trigger('enter');  //触发自定义的enter事件
			},
		});
		// 页面加载的时候也要触发第一个的动画
		this.el.find('.section').eq(0).find('.h5_component').trigger('enter');

		// 为了开发方便，初始移动到的页面。
		if (firstPage) {
			this.el.fullpage.moveTo(firstPage);
			// $.fn.fullpage.moveTo(firstPage);    // 这个方法也可以
		}

		return this;
	}

	// 如果定义了H5_loading函数，那么，就用该函数，否则还是用这里定义的loader
	this.loader = (typeof H5_loading === "function") ? H5_loading : this.loader;


}
