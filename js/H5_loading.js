// H5_loading 函数将被赋给H5对象的this.loader方法，所有此函数的this指的是H5对象

var H5_loading = function(images, firstPage) {
	// 这里重点是要注意的加上if else判断的必要性。第一次执行此函数，是有images这个参数的
	// 后面执行就可以不需要了，因为_images变量已经被保存下来。但是如果我们不用if else判断
	// 第二次的时候images就是空的，那么_images就变成0，进度指示失败。如果试图在window[id].loader()加上images参数
	// 就会导致无穷的循环。。。。。
	if (this._images === undefined) {		// _images 第一次必定是没有的，所以只在第一次会执行这一句
		this._images = (images || []).length;
		this._loaded = 0;
		for (i in images) {			// for循环一定是放在第一次执行的里面

			var id = this.id;		// this.id是H5对象中的变量
			var item = images[i];
			var img = new Image; 	// 创建图像
			img.src = item;			// 将数组中的图片地址赋给图像，证明此图片加载完成
			window[id] = this;		// 将this存储在全局对象中，用来进行某个图片加载完成后的回调
			// 其实这里可以简单用 _this = this，保留this就可以

			img.onload = function() { 	// 图像加载完毕，证明此图片加载完成
				window[id].loader();	// 这里可以不再传images这个参数, 因为第二次执行此函数时，_images变量已经被保存下来
			}
		}

		$('#rate').text('0%');	// 第一次执行的时候归0
		// debugger
		return ;	// 在还没有加载完成的时候，不执行下面的fullpage函数方法
	}else {
		this._loaded++;
		$('#rate').text( ((this._loaded/this._images * 100) >>0) + '%');
		// debugger
		// 在还没有加载完成的时候，不执行下面的fullpage函数方法
		if (this._loaded < this._images) {
			return ;
		}
	}

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
	//页面加载的时候也要触发第一个的动画
	this.el.find('.section').eq(0).find('.h5_component').trigger('enter');

	// 为了开发方便，初始移动到的页面。
	if (firstPage) {
		this.el.fullpage.moveTo(firstPage);
		// $.fn.fullpage.moveTo(firstPage);    // 这个方法也可以
	}
}