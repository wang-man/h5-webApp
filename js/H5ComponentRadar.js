/* 雷达图组件对象 */
var H5ComponentRadar = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);

	// 加入一个画布
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;

	// 画圆
	// ctx.beginPath();
	var r = cvs.width/2;
	// ctx.arc(r,r,20,0,2*Math.PI);
	// ctx.stroke();

	// ctx.beginPath();
	// ctx.arc(r,r,r-1,0,2*Math.PI);
	// ctx.stroke();
		
	// 项目数量(n边形)
	var len = cfg.data.length;

	/*
		计算圆周上某个点的坐标x,y(多边形顶点坐标)
		已知：圆心坐标(a,b)，半径r，角度rad
		rad = ( 2*Math.PI / 360) * (360 / len) * i    // i是第几个顶点
		x = a + Math.sin(rad) * r
		y = b + Math.cos(rad) * r
	*/
	// 画出同心多边形
	var flag = false;
	for (var i = 10; i > 0; i--) {		//注意这里是递减，否则无法填充出分层颜色
		ctx.beginPath();
		// ctx.moveTo(r,r);		//这里可以省略起始点，而且也无法指定合适的起点
		for (var j = 0; j < len; j++) {
			var rad = ( 2*Math.PI / 360) * (360 / len) * j;    // i是第几个顶点
			var x = r + Math.sin(rad) * r*(i/10);	//层层放大，绘制出同心
			var y = r + Math.cos(rad) * r*(i/10);
			ctx.lineTo(x,y);
		}
		ctx.closePath();	//循环后最后首尾两个点并没有连线，这里用于封闭连线，或者用len+1
		// ctx.stroke();
		ctx.fillStyle = (flag = !flag) ? "#99d5ff":"#eee";
		ctx.fill()
	}
	// 绘制伞骨线
	for (var i = 0; i < len; i++) {
		var rad = ( 2*Math.PI / 360) * (360 / len) * i;    // i是第几个顶点
		var x = r + Math.sin(rad) * r;	//层层放大，绘制出同心
		var y = r + Math.cos(rad) * r;
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);
		// 项目名称
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);
		// 下面是项目名称的定位方式。
		if (x <= cvs.width/2) {
			text.css("right", cvs.width-x-10);
		}else if (x > cvs.width/2) {
			text.css("left", x);
		}
		if (y <= cvs.height/2) {
			text.css("bottom", cvs.height-y+5);
		}else if (y > cvs.height/2) {
			text.css("top", y);
		}
		component.append(text);
	}
	ctx.strokeStyle = "#aaa";
	ctx.stroke();
	component.append(cvs);

	// 加入一个新的画布，绘制数据层
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	ctx.strokeStyle = "#f00";
	
	function drow(h) {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		// 绘制数据连线
		for (var i = 0; i < len; i++) {
			var rate = cfg.data[i][1]/100*h;
			var rad = ( 2*Math.PI / 360) * (360 / len) * i;    // i是第几个顶点
			var x = r + Math.sin(rad) * r * rate;	//层层放大，绘制出同心
			var y = r + Math.cos(rad) * r * rate;
			ctx.lineTo(x,y);

		}
		ctx.closePath();
		ctx.stroke();

		// 绘制数据圆点----这里只能与上面的数据连线分开绘制，不然填充颜色时会有干扰
		ctx.fillStyle = "#f00";
		for (var i = 0; i < len; i++) {
			var rate = cfg.data[i][1]/100*h;
			var rad = ( 2*Math.PI / 360) * (360 / len) * i;    // i是第几个顶点
			var x = r + Math.sin(rad) * r * rate;	//层层放大，绘制出同心
			var y = r + Math.cos(rad) * r * rate;
			ctx.beginPath();	//每次开启新的画笔
			ctx.arc(x,y,5,0,2*Math.PI);
			ctx.fill();
		}
	};
	// drow(0.5);
	component.append(cvs);



	// 将动画添加到事件
	component.on('enter', function(event) {
		var h = 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				h+=0.01;		//h必须放在里面，否则像i一样直接变成最后一个数
				drow(h);
			},10*i+500)				//这里必须利用i来延迟，达到延续效果。这里的i不在函数内部，所以享受依次递增
		}						
		$(this).find('.text').css('opacity', 1);	
		
	});
	component.on('leave', function(event) {
		var h = 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				h-=0.01;		//h必须放在里面，否则像i一样直接变成最后一个数
				drow(h);
			},10*i)				//这里必须利用i来延迟，达到延续效果。这里的i不在函数内部，所以享受依次递增
		}
		$(this).find('.text').css('opacity', 0);								
	});
	

	

	return component;
}

