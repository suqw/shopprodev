/***
日期：2017/10/20
作者：苏倩文
说明：产品详情页左侧图片的js
*/


// console.log(location.href)获得网址
// var _href = location.href


// 获取当前页面产品的pid
// console.log( gPid(location.href );


// 左侧产品图片轮播
function GetDetailImg( _obj ){
	for(var i in _obj){
	this[i] = _obj[i];
	}
	this.tempI = 0;
	this.init();
}

GetDetailImg.prototype = {
	init:function(){
		var _self = this;
		_self.getDate();
		
	},
	getDate:function(){
		var _self = this;
		ajaxFn(DETAILIMG_DATA.url,function( _d ){
			// console.log( _d );
			_self.createDom( _d );
			_self.toLeftBtnFn( _d );
			_self.toRightBtnFn( _d );
			_self.clickSmallImg();
			_self.defaultFn( _d );
			_self.eventMouse( _d );
		})
	},
	createDom:function( _d ){
		var _self = this;
		var _detailImg = _d.detailImg

		console.log(_detailImg)
		var _len = _detailImg.length

		// 小图Ul列表的宽度
		_self.smallImgUlId.css( "width", _len*90 )
		for(var i=0; i<_len; i++){
			$("<li/>",{})
				.attr("data-bigImg", _detailImg[i].bigImg )
				.html( "<img src="+ _detailImg[i].imgurl +" />" )
				.appendTo( _self.smallImgUlId );
		}

		// 放大镜大图显示图片
		var _lis = _self.smallImgUlId.children("li");
		var _bImg = _lis.eq( _self.tempI ).attr("data-bigImg");
		$("<img/>",{})
			.attr("src",  _bImg )
			// .attr("width", 100% )
			.appendTo( _self.magnifier_bId );

	},
	defaultFn:function( _d ){
		var _self = this;
		var _detailImg = _d.detailImg;
		// 默认大图为第一张图
		_self.bigImgId.attr("src", _detailImg[0].bigImg );

		// 默认第一个小图是红边框
		_self.smallImgUlId.children("li").eq(0).addClass("red");
	},
	toLeftBtnFn:function( _d ){
		var _self = this;
		var _len = _d.detailImg.length
		_self.toLeftBtnId.on("click", function(){
			if( _self.tempI < _len-1 ){
				_self.tempI++;
			}else{
				_self.tempI = 0;
			}
			
			// console.log(_self.tempI)
			if( _self.tempI>= 3){
				_self.smallImgUlId.css("left", -(_self.tempI-2)*90 );
			}else{
				_self.smallImgUlId.css("left", 0 );
			}
		
			//小图边框变红、大图切换方法
			_self.switchFn();

		});
	},
	toRightBtnFn:function( _d ){
		var _self = this;
		var _len = _d.detailImg.length
		_self.toRightBtnId.on("click", function(){
			if( _self.tempI > 0  ){
				_self.tempI--;
			}else{
				_self.tempI = _len-1 ;
			}

			// console.log(_self.tempI)
			if( (_self.tempI+3)<=_len ){
				_self.smallImgUlId.css("left", -(_self.tempI-2)*90 );
			}else{
				_self.smallImgUlId.css("left", -(_len-5)*90 );
			}
	    	
			//小图边框变红、大图切换方法
			_self.switchFn();
		});
	},

	// 点击小图方法
	clickSmallImg:function(){
		var _self = this;
		var _lis = _self.smallImgUlId.children();

		_lis.on("click", function(){
			_self.tempI = $(this).index();
			_self.switchFn();			
		})
	},
	
	//小图边框变红、大图切换方法		
	switchFn:function(){
		var _self = this;
		var _lis = _self.smallImgUlId.children("li");
		var _magnifier_bId = _self.magnifier_bId;

		// 大图显示图片
		var _bImg = _lis.eq( _self.tempI ).attr("data-bigImg");
		_self.bigImgId.attr("src", _bImg);
		_self.magnifier_bId.children("img").attr("src", _bImg);

		// 小图边框变红
		_lis.eq( _self.tempI ).addClass("red").siblings().removeClass();
	},
	// 鼠标事件
	eventMouse:function( _d ){
		var _self= this;

		_self.bigImgWrapId.on({
			mouseover:function(e){
				_self.magnifier_sId.show();
				_self.magnifier_bId.show();
			},
			mouseout:function(){
				_self.magnifier_sId.hide();
				_self.magnifier_bId.hide();
			},
			mousemove:function(e){
				var _magnifier_sId = _self.magnifier_sId;
				var _magnifier_bId = _self.magnifier_bId;

				// 放大镜小图的宽高
				var _w = _magnifier_sId.width();
				var _h = _magnifier_sId.height();
				// 图片框的宽高
				var _w1 = _self.bigImgWrapId.width();
				var _h1 = _self.bigImgWrapId.width()

				// console.log(e.pageX);  //获取鼠标相对于浏览器的坐标
				//.offset()获取容器相对于浏览器的坐标
				// 用鼠标坐标减去父容器坐标，得到鼠标在父容器中的坐标
				var _ex = e.pageX - _self.bigImgWrapId.offset().left; 
				var _ey = e.pageY - _self.bigImgWrapId.offset().top;

				// 使鼠标坐标刚好在放大镜小图的中间，使其宽高各减去小图的一半
				var _x = _ex- _w*0.5
				var _y = _ey- _h*0.5
				
				// console.log(_x)
				// 判断放大镜小图的位置，使其只能在图片框中移动，超出则停留在边框内
				if( _x < 0 ){			
					_x = 0;
				}else if( _x > _w1-_w ){
					_x = _w1-_w;
				}

				if( _y < 0 ){			
					_y = 0;
				}else if( _y > _h1-_h ){
					_y = _h1-_h;
				}

				// 放大镜小图的绝对定位，left、top的赋值
				_magnifier_sId.css({
					"left" : _x, 
					"top"  : _y,
				})

				// 放大镜大图的绝对定位，left、top的赋值
				_magnifier_bId.children().css({
					"left" : -_x*2.9, 
					"top"  : -_y*2.9,
				})
				
			}
		});

		// 臃肿的写法
		// _self.bigImgWrapId.on("mouseover", function(){
		// 	_self.magnifier_sId.show();
		// });
		// _self.bigImgWrapId.on("mouseout", function(){
		// 	_self.magnifier_sId.hide();
		// });
	}
}

var detailObj = {
		smallImgWrapId : $("#smallImgWrapId"),
		smallImgUlId : $("#smallImgUlId"),
		toLeftBtnId : $("#toLeftBtnId"),
		toRightBtnId : $("#toRightBtnId"),
		bigImgWrapId: $("#bigImgWrapId"),
		bigImgId :  $("#bigImgId"),
		magnifier_sId : $("#magnifier_sId"),
		magnifier_bId : $("#magnifier_bId")
	};
new GetDetailImg( detailObj );



$("#addToCarbtnId").on("click", function(){
	// console.log(1111111);
	window.open( LocalHref + 'shopCar.html');
})