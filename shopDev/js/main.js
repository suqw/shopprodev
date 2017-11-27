/***
日期：2017/10/11
作者：苏倩文
说明：项目入口
*/

;
$(function(){

	// 首页左侧的纵向导航条
	new IndexSubNav( $("#subNavUlId") );

	// 首页轮播图方法
	var sliderObj = {
		toLeftBtnId : $("#toLeftBtnId"),
		toRightBtnId : $("#toRightBtnId"),
		mainRightId : $("#mainRightId"),
		imgUlId : $("#imgUlId"),
		pointUlId : $("#pointUlId"),
		pointBgId : $("#pointBgId")
	};
	new IndexSliderFn( sliderObj );

	// 下部-产品广告
	new ProductDivFn( $("#productListId") );
	new ProductDivFn( $("#productListId2") );
});