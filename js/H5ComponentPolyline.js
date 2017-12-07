/* 折线图组件对象 */
var H5ComponentPolyline = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	// 加入一个画布
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	
	// 划网格线
	var stepH= 6;
	var stepV= cfg.data.length+2;	//根据数据项数。折线只在中间，所以加2
	ctx.beginPath();			//启用/重置划线
	ctx.lineWidth = 1;			//画笔宽度
	ctx.strokeStyle = "#aaa";	//画笔颜色

	// window.ctx = ctx;	//将ctx对象给到全局对象

	// 水平线，6份，7线
	for (var i = 0; i < stepH+1; i++) {
		var y = (cvs.height/stepH)*i;
		ctx.moveTo(0,y);			//画笔起点
		ctx.lineTo(cvs.width,y);	//画笔结束点
	}
	// 竖直线,5份，6线
	for (var i = 0; i < stepV; i++) {
		var x = (cvs.width/(stepV-1))*i;
		ctx.moveTo(x,0);			//画笔起点
		ctx.lineTo(x,cvs.height);	//画笔结束点
	}

	ctx.stroke();	//开画
	component.append(cvs);
	
	// 画折线，折线与网格线不同层
	cvs = document.createElement("canvas");//创建一个新的画布
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	var ctx2 = cvs.getContext("2d");
	var dataLength = cfg.data.length;

	var width = 100/(dataLength+1)*(dataLength)+"%";
	var marginLeft = 100/(dataLength+1)*(dataLength)/2+"%";
	var project = $('<div class="project" style="width:'+width+';margin-left:-'+marginLeft+';"></div>');
	// 项目名因为其位置超出canvas返回会被隐藏，使用div插入页面更方便。
	var width2 = 100/dataLength+"%";
	// debugger
	for (var i = 0; i < dataLength; i++) {
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]).css('width', width2);
		project.append(text);
	}
	
	component.append(project);

	// 生成连线的函数。用一个函数的原因主要是为了做动画。
	// 在参数中传入y坐标值，用到每一个连线点的位置。然后使用for循环及setTimeout渐渐升高y坐标，就实现了动画
	function drow(h) {
		ctx2.clearRect(0,0,cvs.width,cvs.height);			//开头必须清空画布，因为此函数多次调用
		ctx2.beginPath();			//启用/重置划线
		ctx2.lineWidth = 3;			//画笔宽度
		ctx2.strokeStyle = "#f00";	//画笔颜色

		// 画点
		var x,y;
		for (var i = 0; i < dataLength; i++) {
			x = cvs.width/(dataLength+1)*(i+1);
			y = cvs.height*(1-cfg.data[i][1]/100*h);		//高度用1减
			ctx2.moveTo(x, y);
			ctx2.arc(x,y,3,0,2*Math.PI);
		}
		// 画连线
		ctx2.moveTo(cvs.width/(dataLength+1),cvs.height*(1-cfg.data[0][1]/100*h));	//画笔回第一点
		for (var i = 0; i < dataLength; i++) {
			x = cvs.width/(dataLength+1)*(i+1);
			y = cvs.height*(1-cfg.data[i][1]/100*h);		//高度用1减
			ctx2.lineTo(x, y);
		}
		//填充阴影，注意，阴影原理是连线成一个区域，然后填充
		ctx2.stroke();	//为了阴影部分边线设为1，先画完连线，下面的线条设置才不影响连线
		ctx2.lineWidth = 1;	
		ctx2.strokeStyle = "rgba(0, 0, 0, 0)"
		ctx2.lineTo(x, cvs.height);
		ctx2.lineTo(cvs.width/(dataLength+1), cvs.height);
		// ctx2.lineTo(cvs.width/(dataLength+1),cvs.height*(1-cfg.data[0][1]/100));	//可以不封闭
		ctx2.fillStyle = "rgba(47, 255, 173, 0.21)";	//半透明填充
		ctx2.fill();

		//写数据
		
		ctx2.moveTo(cvs.width/(dataLength+1),cvs.height*(1-cfg.data[0][1]/100));	//画笔回第一点
		for (var i = 0; i < dataLength; i++) {
			x = cvs.width/(dataLength+1)*(i+1);
			y = cvs.height*(1-cfg.data[i][1]/100*h);		//高度用1减
			ctx2.fillStyle = cfg.data[i][2] ? cfg.data[i][2] : "#f00";
			ctx2.fillText(cfg.data[i][1]+"%",x-10, y-15);
		}

		ctx2.stroke();	//开画
	};
	// 将动画添加到事件
	component.on('enter', function(event) {
		var h = 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				h+=0.01;		//h必须放在里面，否则像i一样直接变成最后一个数
				drow(h);
			},10*i+500)				//这里必须利用i来延迟，达到延续效果。这里的i不在函数内部，所以享受依次递增
		}							//加0.8s是为了组件进入时间
		
	});
	component.on('leave', function(event) {
		var h = 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				h-=0.01;		//h必须放在里面，否则像i一样直接变成最后一个数
				drow(h);
			},10*i)				//这里必须利用i来延迟，达到延续效果。这里的i不在函数内部，所以享受依次递增
		}							//加0.8s是为了组件进入时间
		
	});
	

	component.append(cvs);

	return component;
}
