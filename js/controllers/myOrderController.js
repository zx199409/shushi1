/**
 * Created by lx on 2016/12/9.
 */
angular.module('cftApp.myOrder',['ionic','cftApp.orderDetail']).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.myOrder',{
        url:'/myOrder',
        views: {
           'tabs-personal': {
               templateUrl:'myOrder.html',
               controller:'myOrderController'
           }
        }
        
    });

}]).controller('myOrderController',['$rootScope','$scope','$state','$ionicViewSwitcher','$ionicPopup',function ($rootScope,$scope,$state,$ionicViewSwitcher,$ionicPopup) {
    $scope.myOrder = {
        keyWords:'',//用于过滤数据的关键字
        navData:navData,//导航栏选项再点击选项按钮时触发的事件
        allData:'',//存储订单商品信息
        cancelBill:cancelBill,//取消订单的方法
        payment:payment,//付款的方法
        refund:refund,//退款的方法
        confirm:confirm,//确认订单的方法
        appraise:appraise,//评价的方法
        goOrderDetail: goOrderDetail//跳转订单详情


    };
    //隐藏 tabs
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = true;
    });
    $scope.myOrder.allData = [{ serial:"23456788", status:"待付款", goodsArray:[{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ "imgSrc":"images/myOrder.png", "price":"258",origin:"99", "num":"2", "sname":"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], "totalNum":"4", "totalPrice":"1032.00", "freight":"30.00"
    },{ serial:"23456788", status:"待收货", goodsArray:[{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], totalNum:"4", totalPrice:"1032.00", freight:"30.00"
    },{ serial:"23456788", status:"交易成功", isAppraise:false,goodsArray:[{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], totalNum:"4", totalPrice:"1032.00", freight:"30.00"
    },{ serial:"23456788", status:"待发货", goodsArray:[{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", "price":"258",origin:"99", "num":"2", "sname":"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", "price":"258",origin:"99", "num":"2", "sname":"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], totalNum:"4", "totalPrice":"1032.00", "freight":"30.00"
    },{ serial:"23456788", status:"退款中", goodsArray:[{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], totalNum:"4", totalPrice:"1032.00", freight:"30.00"
    }];
    //    跳转到订单详情
    function goOrderDetail(items) {
        console.log(items);
        $state.go('tabs.orderDetail',{orderData:items});
        // $ionicViewSwitcher.nextDirection("forward");
    }
    function navData(event) {

        var list = angular.element(event.currentTarget).children();
        var item = angular.element(event.target);
        console.log(item.text());
        //对数据进行过滤
        if (item.text() == '全部'){
            $scope.myOrder.keyWords = '';
        }

        //改变元素的样式.
        // console.log(item);
        if (event.currentTarget != event.target){
            list.removeClass('active');
            item.addClass('active');
            switch (item.text()){
                case '待付款':
                    $scope.myOrder.keyWords = '待付款';
                    break;
                case '待发货':
                    $scope.myOrder.keyWords = '待发货';
                    break;
                case '待收货':
                    $scope.myOrder.keyWords = '待收货';
                    break;
                case '待评价':
                    $scope.myOrder.keyWords = '交易成功';
                    break;
                default:
                    $scope.myOrder.keyWords = '';
                    break;
            }
        }
    }

    function cancelBill(items,event) {
        event.stopPropagation();
        //弹出弹框
            $ionicPopup.show({
            cssClass:'myOrder',
            template:'确认要取消订单吗？',
            buttons:[{
                text:'取消',
                onTap:function () {

                }
            },{
                text:'确定',
                onTap:function () {
                    items.status = '交易关闭';
                }
            }]

        });

    }
    
    function payment(items,event) {
        event.stopPropagation();
        console.log('跳转到微信支付页面');
    }
    
    function refund(items,event) {
        event.stopPropagation();
        $ionicPopup.show({
            cssClass:'myOrder refund',
            template:'<p>申请退款</p><textarea placeholder="请输入申请退款的原因？"></textarea><div>10/100</div>',
            buttons:[{
                text:'取消',
                onTap:function (e) {


                }
            },{
                text:'确定',
                onTap:function () {

                    items.status = '退款中';

                }
            }]

        });
    }
    
    function confirm(items,event) {
        event.stopPropagation();
        $ionicPopup.show({
            cssClass:'myOrder',
            template:'确认是否已收到货？',
            buttons:[{
                text:'取消',
                onTap:function () {

                }
            },{
                text:'确定',
                onTap:function () {
                    items.status = '交易成功';

                }
            }]

        });
        
    }
    
    function appraise(items,event) {
        event.stopPropagation();
        console.log('跳转到评价页面');
    }
}]);




