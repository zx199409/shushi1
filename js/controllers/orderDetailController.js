/**
 * Created by chaoshen on 16/12/13.
 */
angular.module('cftApp.orderDetail',[])
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider.state('tabs.orderDetail',{
            url: '/orderDetail',
            views: {
                'tabs-personal': {
                    templateUrl: 'orderDetail.html',
                    controller: 'orderDetailController'
                }
            },
            params: {
                orderData: ''
            }
        })
    }])
    .controller('orderDetailController',['$scope',function ($scope) {
        $scope.orderGoodsObj = {
            orderData: '' // 单个订单数据
        };
        $scope.orderGoodsObj.orderData = { serial:"23456788", status:"待付款", goodsArray:[{ imgSrc:"images/myOrder.png", price:"258.00", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258.00", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ "imgSrc":"images/myOrder.png", "price":"258.00", "num":"2", "sname":"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}], "totalNum":"4", "totalPrice":"1032.00", "freight":"30.00"
        };
    }]);