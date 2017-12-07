/* 散点图表组件对象 */

var H5ComponentPoint = function(name, cfg) {
	// 这里取得组件这个对象
	var component = new H5ComponentBase(name, cfg);

	var base = cfg.data[0][1]; //以第一个散点数据为基本

	$.each(cfg.data, function(index, val) {
		var point = $('<div class="point point_'+ index +'"></div>');
		var name = $('<div class="point_name">'+val[0]+'</div>')
		var rate = $('<div class="point_rate">'+val[1]+'</div>')
		var size = val[1]/base*100 + "%";	//尺寸相对比

		if (val[3]!=undefined && val[4]!=undefined) {
			var left = val[3];
			var top = val[4];
		}
		point.css({
			width: size,
			height: size,
			backgroundColor: val[2],
			left: left,
			top: top
			
		});
		name.append(rate);
		point.append(name);
		component.append(point);

	});


	return component;
}