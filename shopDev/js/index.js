/***
日期：2017/10/11
作者：苏倩文
说明：index首页的js
*/

// 首页顶部搜索框(已切到公共文件中)

// 首页顶部-栏目菜单(已切到公共文件中)

// 首页左侧的纵向导航条
function IndexSubNav( _obj ){
	this.subNavUlId = _obj ;
	this.init();
}

IndexSubNav.prototype = {
	init:function(){
		var _self = this;
		_self.getDate();
	},
	getDate:function(){
		var _self = this;
		ajaxFn(SUBNAV_DATA.url,function(_d){
			// console.log(_d);
			_self.creatDom( _d );
			var _li = _self.subNavUlId.children();
			_self.onMouseover( _li );
			_self.onMouseout( _li );
		});
	},
	creatDom:function( _d ){
		var _self = this;
		var _dataArr = _d.productList;

		for(var i=0; i<_dataArr.length; i++){

			$("<li/>",{})
				.html(function(){
					var _this = this;

					$("<p/>",{})
						.html( _dataArr[i].type )
						.appendTo( _this);	

					$("<div/>",{
							"class" : "liPopup"
 						})
						.html( function(){
							var _this = this;
							for( var j=0; j<_dataArr[i].products.length; j++ ){
								$("<li/>",{})
									.html( _dataArr[i].products[j].name )
									.appendTo( _this);
							}
						}) 
						.appendTo( _this);	
				})
				.appendTo( _self.subNavUlId );	
		}
	},	
	onMouseover:function( _li ){
		var _self = this;

		_li.on("mouseover", function(){
			$(this).children("div").show();
		});
	},
	onMouseout:function( _li ){
		var _self = this;

		_li.on("mouseout", function(){
			$(this).children("div").hide();
		});
	}
}

// 首页轮播图
function IndexSliderFn( _obj ){
	for(var i in _obj){
		this[i] = _obj[i]
	}
	this.tempI = 0;
	this.init();
}

IndexSliderFn.prototype = {
	init:function(){
		var _self = this;

		//生成图片列表
		_self.createImgFn();

		//生成小白点
		_self.createPointFn();

		//获取轮播图片的宽度、个数
		var _imgW = _self.mainRightId.width(); //下载到的图的宽度比容器小，所以用的容器的宽度
		var _imgNum = _self.getDate().urls.length;

		//轮播图Ul的宽度
		_self.imgUlId.width( _imgW * _imgNum );
		
		//小白点单击事件
		_self.pointFn( _imgW );

		//向左按钮单击事件
		_self.toLeftBtnFn( _imgW, _imgNum );

		//向右按钮单击事件
		_self.toRightBtnFn( _imgW, _imgNum );

		//小白点变红方法
		_self.pointRed();

		//图片滑动动画方法
		_self.sliderAnimate(_self.imgUlId, _self.tempI, _imgW);

	},

	//获取数据,本对象内的公共方法
	getDate:function(){
		var _self = this;
		return SliderImgUrl;
	},

	//生成图片列表
	createImgFn:function(){
		var _self = this;
		var _data = _self.getDate();
		var _imgW = _self.mainRightId.width();

		for (var i=0; i<_data.urls.length; i++){
			$("<li/>")
				.html(function(){
					var _this = $(this)
					$("<img>")
						.attr("src", _data.urls[i])
						.attr("width", _imgW)
						.appendTo( _this )
				})
				.appendTo( _self.imgUlId );
		}
	},

	//生成小白点
	createPointFn:function(){
		var _self = this;	
		var _imgNum = _self.getDate().urls.length;

		//按照图片个数生成
		for (var i=0; i<_imgNum; i++){
			$("<li/>").appendTo( _self.pointUlId);
		}

		//小白点父容器宽度自适应、并居中
		var _pointUlW = _imgNum*28;
		_self.pointUlId
			.width( _pointUlW )
			.css("margin-left", -(_pointUlW/2+5));

		//小白点背景宽度自适应、并居中
		var _pointUlW = _imgNum*28;
		_self.pointBgId
			.width( _pointUlW )
			.css("margin-left", -(_pointUlW/2)-1);

		//获取小白点列表	
		var _pointLis = _self.getPointLisFn();

		//默认第一个小白点为红色
		_pointLis.eq(0).addClass("red");
	},

	//获取小白点列表
	getPointLisFn:function(){
		var _self = this;
		return _self.pointUlId.children("li");
	},

	//小白点单击事件
	pointFn:function(_imgW){
		var _self = this;

		//获取小白点列表	
		var _pointLis =  _self.getPointLisFn();

		//单击变红、图片跳转
		_pointLis.on("click",function(){
			_self.tempI = $(this).index();
			_self.pointRed();
			_self.sliderAnimate( _self.imgUlId, _self.tempI, _imgW );
		});
	},

	//向左按钮单击事件
	toLeftBtnFn:function(_imgW, _imgNum){
		var _self = this;

		_self.toLeftBtnId.on("click",function(){
			if( _self.tempI < (_imgNum - 1) ){
				_self.tempI++;
			} else {
				_self.tempI = 0;
			}
			//相应小白点变红
			_self.pointRed();

			//图片滑动
			_self.sliderAnimate( _self.imgUlId, _self.tempI, _imgW );
		});
	},

	//向右按钮单击事件
	toRightBtnFn:function( _imgW, _imgNum){
		var _self = this;

		_self.toRightBtnId.on("click",function(){
			if( _self.tempI > 0 ){
				_self.tempI--;
			} else {
				_self.tempI = ( _imgNum - 1 );
			};
		
			//相应小白点变红
			_self.pointRed();

			//图片滑动
			_self.sliderAnimate( _self.imgUlId, _self.tempI, _imgW );
		});
	},

	//小白点变红方法
	pointRed:function(){
		var _self = this;
		_self.pointUlId.children("li")
			.eq( _self.tempI)
			.addClass("red").siblings().removeClass();
	},

	//轮播图动画方法
	sliderAnimate:function( _o, n, w){
		var _self = this;

		_o.stop().animate({
			left: -(n*w)
		},300);

	}
}

// 底部-产品广告
function ProductDivFn( _obj){
	this.productListId = _obj;
	this.init();
}

ProductDivFn.prototype = {
	init:function(){
		var _self = this;
		_self.getData();
	},
	getData:function(){
		var _self = this;

		ajaxFn(PRODUCTAD_DATA.url, function( _d ){
			_self.createDom( _d );
			console.log( _d );
		})
	},
	createDom:function( _d ){
		var _self = this;
		var _productEnter = _d.productEnter;
		for( var i=0; i<_productEnter.length; i++){
			$("<a/>",{})
				.attr("target","_blank")
				.attr("href", "detail.html?pid=" + _productEnter[i].pid)
				.html(function(){
					var a_this = this;
					$("<li/>",{
						"class":"bg_"+(i+1)
						})
						.html(function(){
						var li_this = this;
						$("<dl/>",{
								"class":"bg_"+(i+1)
							})
							.html("<dt>" + _productEnter[i].name + "</dt><dd>"+ _productEnter[i].describe + "</dd>")
							.appendTo( li_this );
						})
						.appendTo( a_this );	
				})		
				.appendTo( _self.productListId);
		}
	}
}

