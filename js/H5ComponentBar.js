/* 柱图组件对象 */
var H5ComponentBar = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);

	// 执行一个基本组件对象，然后在此基础上扩展
	$.each(cfg.data, function(index, val) {
		var width = val[1]+"%"
		var line = $("<div class='line'></div>");
		var name = $("<div class='name'></div>");
		var process = $("<div class='process' style='width:"+ width +"'><div class='bg' style='background-color:"+val[2] +"'></div></div>");
		var rate = $("<div class='rate'>"+ width +"</div>");
		name.text(val[0]);
		line.append(name).append(process).append(rate);
		component.append(line);
	});
	return component;
}
