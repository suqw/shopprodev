/***
日期：2017/11/24
作者：苏倩文
说明：购物车页面的js
*/

function ShoppingCarFn( _obj ){
	for(var i in _obj){
		this[i] = _obj[i];
	}
	this.isCheck = '';
	this.init();
}

ShoppingCarFn.prototype = {

	init:function(){
		var _self = this;
		_self.getDate();
	},

	// 获取数据
	getDate:function(){
		var _self = this;
		ajaxFn( CARTITEMS_DATA.url, function( _d ){
			if(_d.error.code == 0 ){
				// console.log( _d );
				_self.createDom( _d);
				// 获得所有产品的checkbox
				_self.isCheck = _self.mainId.find('input.checkBox');

				_self.eventAddGoods( _d );
				_self.eventReduceGoods( _d );
				_self.eventEnterGoodsNumFn();
				_self.eventCheckBox();
				_self.eventSelectAll();
				
				_self.eventDelBtn();
				_self.totalFn();
			} else {
				console.log( _d.error.msg );
			}
		});
	},

	// 生成购物车
	createDom:function( _d ){
		var _self = this;
		// console.log( _self.mainId )
		_self.mainId.html( carTplFn(_d) );
		// console.log(_d.total.totalMoney)
		_self.totalMoneyId.html("¥"+_d.total.totalMoney)
	},

	// 获取某项商品的信息
	eventGetGoodsInfo:function( _this ){
		var _self = this;
		var _carGoods = _this.parents(".carGoods"); //向上找到class为carGoods的父容器
		var _check    = _carGoods.find("input.checkBox"); //再向下找到input标签内class为checkBox的容器
		// console.log(_check)

		var _num  = _check.attr("data-goodsNum"); //给该容器绑定自定义属性
		var _unit = _check.attr("data-unit");
		var _subTotal = _carGoods.find("li.subTotal");

		var _obj = {}; //新建一个对象，用以存储存在容器属性中的值
		_obj["num"] = _num;
		_obj["unit"] = _unit;
		_obj["subTotal"] = _subTotal;
		// console.log(_obj.subTotal)

		return _obj;
	},

	// 商品输入框直接输入数字的方法
	eventEnterGoodsNumFn:function( _d ){
		var _self = this;
		var _inputGoodsNum = _self.mainId.find("input.inputGoodsNum");
		var _reduceGoodsBtn = _self.mainId.find("label.reduceGoodsBtn");
		
		_inputGoodsNum.on("blur", function(){
			var _this = $(this);
			var _obj  = _self.eventGetGoodsInfo( _this );

			_self.countItemTotalFn( _this.val(), _obj.unit, _obj.subTotal);

		});
	},
	// 计算单个商品数量和价格
	countItemTotalFn:function( _num, _unit, _subTotal ){
		var _self = this;
		
		// 商品小计数字
		_subTotal.html("¥" + _num*_unit)

		var _carGoods = _subTotal.parents("ul.carGoods");

		// 更新checkBox的商品数量
		_carGoods
			.find("input.checkBox")
			.attr("data-goodsNum", _num);

		// 更新商品输入框的商品数量
		_carGoods
			.find("input.inputGoodsNum")
			.val(_num);

		//重新统计商品总价
		_self.totalFn();
	},

	// 增加商品数量(+按钮)
	eventAddGoods:function( _d ){
		var _self = this;
		var _addGoodsBtn = _self.mainId.find("span.addGoodsBtn");
		var _reduceGoodsBtn = _self.mainId.find("label.reduceGoodsBtn");
		// console.log(_addGoodsBtn)

		_addGoodsBtn.on("click", function(){
			var _obj = _self.eventGetGoodsInfo( $(this));
			_obj.num = parseInt(_obj.num) +1;
			_self.countItemTotalFn( _obj.num, _obj.unit, _obj.subTotal );
			_self.isCheckBoxGoodsInfo(_self.isCheck);
			_self.totalFn();
		}); 
	},

	// 减少商品数量(-按钮)
	eventReduceGoods:function( _d ){
		var _self = this;
		var _reduceGoodsBtn = _self.mainId.find("label.reduceGoodsBtn");

		_reduceGoodsBtn.on( "click", function(){
			var _obj = _self.eventGetGoodsInfo( $(this) );
			_obj.num = parseInt(_obj.num) -1;
		
			if(_obj.num<=1){
				 _obj.num = 1;
			}
			_self.countItemTotalFn( _obj.num, _obj.unit, _obj.subTotal );
			_self.totalFn();
		}); 
			
	},
	// 删除商品按钮事件
	eventDelBtn:function(){
		var _self = this;
		var _delBtn = _self.mainId.find("li.delBtn");

		_delBtn.on("click",function(){
			var _c = $(this).parents("div.carGoodsWrap");
			var _check = _c.find("input.checkBox")

			_check.removeAttr("checked");

			// console.log(_check)

			_c.remove();

			//更新全选按钮状态-------.remove()方法不删除dom节点，更新全选按钮状态方法在这里不管用，数组长度仍为3
			// _self.updateCheckAllSelectState();


			// 重新统计商品总价
			_self.totalFn();
		});
	},
	// 每个商品的checkbox事件
	eventCheckBox:function(){
		var _self = this;

		_self.isCheck.on('click',function(){
			_self.totalFn();

			_self.updateCheckAllSelectState();
		});
	},

	// 更新全选按钮的状态
	updateCheckAllSelectState:function(){
		var _self = this;
		var _selectAllBtn = $(".selectAllBtn");

		// console.log(_self.isCheck);
		for( var i=0; i<_self.isCheck.length; i++ ){
			console.log(_self.isCheck.length)
			if( _self.isCheck.eq(i).is(":checked") == false ){
				_selectAllBtn.removeAttr("checked");
				break;
			}
			_selectAllBtn.attr('checked', true);
		}
	},
	//单击全选按钮
	eventSelectAll:function(){
		var _self = this;
		var _selectAllBtn = $(".selectAllBtn");
		var _checkedState = _selectAllBtn.is(":checked") ;

		_selectAllBtn.on("click",function(){
			if(_checkedState==true){
				// console.log(_checkedState)
				for( var i=0; i<_self.isCheck.length; i++ ){
					_self.isCheck.eq(i).removeAttr("checked");
				}
				_checkedState = !_checkedState;

				for(var j=0; j<_selectAllBtn.length;j++){
					_selectAllBtn[j].checked = false;
				}
			}else if(_checkedState == false){
				for( var i=0; i<_self.isCheck.length; i++ ){
					_self.isCheck.eq(i).attr("checked",true);
				}
				_checkedState = !_checkedState;

				for(var j=0; j<_selectAllBtn.length;j++){
					_selectAllBtn[j].checked = true;
				} 
			}
			_self.totalFn()
		})

	},
// 统计“所有商品中，哪些商品处于被选中的状态”
	isCheckBoxGoodsInfo:function( _chk ){
		var _self = this;
		var _tempArr = [];
		// console.log( _chk.length );
		for(var i=0; i<_chk.length; i++){
			if( _chk.eq(i).is(':checked') ){
				var _temp = {};
				_temp["price"] 	= _chk.eq(i).attr('data-unit');
				_temp["num"] 	= _chk.eq(i).attr('data-goodsNum');
				_tempArr.push( _temp );
			}
		}

		return _tempArr;
	},
	// 所有checkbox选中的商品的总价
	totalFn:function(){
		var _self = this;
		var _data = _self.isCheckBoxGoodsInfo( _self.isCheck );
		var _sum = 0;
		// console.log(_data)
		if( _data.length>0){
			for( var i=0; i<_data.length; i++ ){
			_sum += _data[i].num*_data[i].price
			_self.totalMoneyId.html( "¥" +_sum )
			}
		}else{
			_self.totalMoneyId.html("¥ 0.00")
		}
		
		
	}
}

var shoppingCarObj = {
		mainId : $("#mainId"),
		selectGoodsNumId : $("#selectGoodsNumId"),
		totalMoneyId : $("#totalMoneyId")
	};

new ShoppingCarFn( shoppingCarObj );