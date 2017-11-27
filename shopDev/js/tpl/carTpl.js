/***
日期：2017/11/24
作者：苏倩文
说明：购物车-产品列表-js
*/

function carTplFn( _d ){
	var _html = "";
	for( var i=0; i<_d.cartList.length; i++ ){
			_html += '<div class="carGoodsWrap">'
			_html += '<ul class="carGoods">'
				_html += '<li class="w1">'
					_html += '<input checked type="checkbox" class="checkBox"'+
								'data-goodsNum='+ _d.cartList[i].num +
								' data-unit='+ _d.cartList[i].unit +' />'
					_html += '<img src="'+ _d.cartList[i].goodsimg +' " /></li>'
					_html += '<li class="w2">'+ _d.cartList[i].name +'</li>'
					_html += '<li class="w22">'+ _d.cartList[i].introduce +'</li>'
					_html += '<li class="w3">¥<label>'+ _d.cartList[i].unit +'</label></li>'
					_html += '<li class="w4">'
						_html += '<div>'
							if( _d.cartList[i].num <=1){
								_html += '<label class="reduceGoodsBtn">-</label>'
							} else{
								_html += '<label class="reduceGoodsBtn">-</label>'
							}
								
							_html += '<input type="text" class="inputGoodsNum" value="'+ 
										_d.cartList[i].num +'"/>'
							_html += '<span class="addGoodsBtn">+</span>'
							_html += '<p>有货</p>'
						_html += '</div>'
					_html += '</li>'
					_html += '<li class="w5 subTotal">'+ '¥' + _d.cartList[i].total +'</label></li>'
					_html += '<li class="w6 delBtn">删除</li>'
				_html += '</ul>'
			_html += '</div>'
		}
	return _html;
}