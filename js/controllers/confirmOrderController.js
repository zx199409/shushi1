/**
 * Created by chaoshen on 2017/1/6.
 */
angular.module('cftApp.confirmOrder',[])
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider.state('tabs.confirmOrder',{
            url: '/confirmOrder',
            params: {
                goodsArray:[]
            },
            views: {
                'tabs-homePage': {
                    templateUrl: 'confirmOrder.html',
                    controller: 'confirmOderController'
                }
            }
        });
    }])
    .controller('confirmOderController',['$scope','$rootScope','$stateParams',function ($scope,$rootScope,$stateParams) {
        var confirmObj = $scope.confirmObj = {
            inputNums: 0,
            inputMsg: '',
            is_integral: 1,
            inputChange: inputChange,
            goodsArray: [],
            IconROOTURL: ''
        };
        confirmObj.IconROOTURL = IconROOT_URL;
        confirmObj.goodsArray = $stateParams.goodsArray;
        console.log(confirmObj.goodsArray);
        // confirmObj.goodsArray = [{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ imgSrc:"images/myOrder.png", price:"258",origin:"99", num:"2", sname:"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"},{ "imgSrc":"images/myOrder.png", "price":"258",origin:"99", "num":"2", "sname":"买一份送一份日汪洋澄湖大闸蟹全母螃蟹3.2-3.0两6只鲜活现货礼盒装"}];
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = true;
        });
        function inputChange(msg) {
            confirmObj.inputNums = confirmObj.inputMsg.length;
        }
        
    }]);