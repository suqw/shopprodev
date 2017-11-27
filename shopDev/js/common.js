/*************
 日期：2017/10/29
 作者：苏倩文
 说明：公共方法
*/

// 根据id获取相应dom节点
function gId( _id ){
	return document.getElementById( _id )
}

// 通过当前href.url获取产品pid
function gPid(_href){
	// .indexOf()查询某字符在字符串中首次出现的位置（从0开始）
	var _strInx = _href.indexOf("?")
	// substring()用于截取字符串（从0开始，要前不要后）  
	// abcdefg，substring(1,3)，将返回bc
	// 只写一个数字时，截取到末尾。abcdefg，substring(3)，将返回defg
	var _pid = _href.substring( _strInx+5 )
	return _pid;
}


// ajax的公共方法(不跨域)
function ajaxFn( _url, callback ){
	$.ajax({
		url: _url,
		type:"get",
		dataType:"json",		
		success:function( _d ){
			callback( _d );
		} 
	});
}

// jsonp跨域的ajax
function JsonpAjaxFn( _url, callback ){
	$.ajax({
		url: _url,
		type:"get",
		dataType:"jsonp",
		jsonp:"callback",		
		success:function( _d ){
			callback( _d );
		}
	});
}

// jsonp跨域的ajax
// 接收pid，返回产品信息
function getParam( _url, _pid, callback ){
	$.ajax({
		url: _url,
		type:"get",
		data: "cc=" + _pid,
		dataType:"jsonp",
		jsonp:"jsoncallback",		
		success:function( _d ){
			callback( _d );
		}
	});
}

// jsonp跨域的ajax
// 接收产品数量和价格，返回单项商品的总价：单价 * 数量
function JsonpCarFn( _url, _d, callback ){
	$.ajax({
		url: _url,
		type:"get",
		data: "cart=" + _d,
		dataType:"jsonp",
		jsonp:"jsoncallback",		
		success:function( _d ){
			callback( _d );
		}
	});
}

// 单个商品复选按钮的接口，计算所有选中的商品的总数和总价
function JsonpIsCheckedFn( _url, _d, callback ){
	$.ajax({
		url: _url,
		type:'get',
		data:'goods=' + _d,
		dataType:'jsonp',
		jsonp:'jsoncallback',
		success:function(d){
			callback(d);
		}
	});
}

// =====================================================
// 全站的header
function getHeader(){
	$.ajax({
		url: "../component/header.html" ,
		type:"get",
		dataType:"html",		
		success:function( _d ){
			$("body").prepend( _d );
			new backToHomeFn( $("#backToHomeId"));
			new SearchFn( $("#seachBoxId") );
			new CreateColumnFn( $("#columnMenuId") );
			new goToCartFn( $("#goToCart"));
		} 
	});
}

getHeader();

//单击京东logo跳转到首页
function backToHomeFn(){
	$("#backToHomeId").on("click", function(){
		window.open( LocalHref );
	})
}

// header导航条上的搜索框
function SearchFn( _o ){
	this.searVal = indexHeaderSearchVal;
	this.init( _o ); 
}

SearchFn.prototype = {
	init:function( _o ){
		var _self = this;
		
		_self.onFocus( _o );
		_self.onBlur( _o );
	},
	onFocus:function( _o ){
		_o.on('focus',function(){
			$(this).attr('value', '');
		});
	},
	onBlur:function( _o ){
		_o.on('blur',function(){
			$(this).attr('value', indexHeaderSearchVal );
		});
	}
}


// 首页顶部-栏目菜单
function CreateColumnFn( _obj){
	this.columnMenuId = _obj;
	this.init();
}

CreateColumnFn.prototype = {
	init:function(){
		var _self = this;
		_self.getData();
	},
	getData:function( _obj ){
		var _self = this;

		ajaxFn( COLUMNMENU_DATA.url, function( _d ){
			_self.createDom(  _d );
			// console.log( _d) //可以看里面的属性名等
		});
	},
	createDom:function( _d ){
		var _self       = this;
		var _navLinks = _d.columnMenu;

		// console.log(_d);

		for( var i=0; i<_navLinks.length; i++ ){
			$("<li/>",{
				"data-navId":_navLinks[i].menuId //自定义属性，以data-开头
			})
			.html( _navLinks[i].name )
			.appendTo( _self.columnMenuId );
		}
	}
}

//单击“我的购物车”跳转到购物车页面
function goToCartFn(){
	$("#goToCart").on("click", function(){
		console.log(111)
		window.open( LocalHref + 'shopCar.html');
	})
}

// =====================================================
// 全站的footer
function getFooter(){
	$.ajax({
		url: "../component/footer.html" ,
		type:"get",
		dataType:"html",		
		success:function( _d ){
			$("#footer").append( _d );
		} 
	});
}

getFooter();