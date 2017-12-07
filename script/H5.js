var H5 = function() {
	this.id = ("h5_"+Math.random()).replace(".","_");

	this.el = $("<div class='H5' id='"+this.id+"'></div>").hide();

	$('body').append(this.el);

	// 新增一个页
	this.addPage = function(name, text) {
		var page = $("<div class='h5_page section'></div>");
		if (name != undefined) {
			page.addClass("h5_page_"+name);
		}
		if (text != undefined) {
			page.text(text);
		}
		this.el.append(page);
		return this;
	};
	// 新增一个组件
	this.addComponent = function(name, text) {
		
	};
	this.loader = function () {
		this.el.show();
		this.el.fullpage();
	}
	return this; 	//返回对象本身？？良好编程习惯？
}