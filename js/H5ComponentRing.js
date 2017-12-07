/* 环图组件对象 ，环图的做法和饼图类似，数据层只有一个。在中间再覆盖一块白色即可*/
var H5ComponentRing = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);

	// 加入一个画布，底图层
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	var r = cvs.width/2;
	component.append(cvs);
	ctx.fillStyle = "#ddd";
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();



	// 绘制一个数据层
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	var r = cvs.width/2;
	component.append(cvs);
	var colors = ["#f85", "green", "blue", "orange","gray"];
	var sAngle = 1.5*Math.PI;	// 起始角度
	var eAngle = 2*Math.PI;	// 结束角度

	for (var i = 0; i < cfg.data.length; i++) {
		eAngle = sAngle + 2*Math.PI*(cfg.data[i][1]/100);	// 注意这里结束角度是在起始角度基础上加上数据的百分比
		ctx.beginPath();	//这里必须每次开启新的画笔，形成独立的扇形
		ctx.moveTo(r,r);	// 填充扇形时候，这里还必须要定位到圆心点
		ctx.fillStyle = cfg.data[i][2] || colors[i];
		ctx.arc(r,r,r,sAngle,eAngle);
		ctx.fill();
		sAngle = eAngle;	// 关键的一点，将起始角度位置改变为结束角度的位置，这样才可以在下一循环无缝隙拼接扇形

		// 添加项目名称
		var per = $('<div class="per">');
		var text = $('<div class="text">');
		per.text(cfg.data[i][1]+"%");
		text.text(cfg.data[i][0]);
		per.css({
			width: "100px",
			left: '50%',
			marginLeft: '-50px',
			top: "38%",
			color: "#f00",
			fontSize: "18px"
		});
		text.css({
			width: "100px",
			left: '50%',
			marginLeft: '-50px',
			bottom: "-20%",
			color: "#111",
			fontSize: "14px"
		});
		component.append(per);
		component.append(text);
	}


	// 加入一个画布，中间白色层
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	var r = cfg.css.width/2;
	component.append(cvs);
	ctx.fillStyle = "#fff";
	ctx.arc(r,r,r*0.8,0,2*Math.PI);
	ctx.fill();

	// 绘制一个动画层
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	cvs.width = cfg.css.width;
	cvs.height = cfg.css.height;
	component.append(cvs);
	function drow(h) {
		ctx.clearRect(0,0,cvs.width,cvs.height);	//每次清除画布的内容
		ctx.beginPath();	//这里必须每次开启新的画笔，形成独立的扇形
		ctx.moveTo(r,r);	// 填充扇形时候，这里还必须要定位到圆心点
		ctx.fillStyle = "#ddd";
		// 初始状态,以及结束角度减至最小的时候，应该让动画层覆盖住数据层
		// 这里有个需要注意到的地方就是。为什么要判断h<=0，而不是h==0？
		// 因为在退出动画中，h递减，最后得到的并不是0，而是-0.00000的接近0的负数
		if (h <= 0) {
			ctx.arc(r,r,r,0,2*Math.PI, true);
		}else {
			ctx.arc(r,r,r,1.5*Math.PI,1.5*Math.PI+2*Math.PI*h, true);	// 加上了true，逆时针反向来绘制。事件中，结束角度逐渐增大
		}													// 所以灰色遮罩会看着像是在逆时针减小
		ctx.fill();	

		if (h >= 1) {	//js特性，0.01加上100次，会大于1
			component.find('.per, .text').css('opacity', '1');
		}else if (h<=0) {	//js特性，1减100次0.01，会小于0
			component.find('.text').css('opacity', '0');
		}									
	};
	drow(0);



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
				console.log(h);
			},10*i)				//这里必须利用i来延迟，达到延续效果。这里的i不在函数内部，所以享受依次递增
		}					
	});


	return component;
}
