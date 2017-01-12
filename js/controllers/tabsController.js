
/**
 * Created by qingyun on 16/11/30.
 */
angular.module('cftApp.tabs',[])
    .controller('tabsController',['$scope','$rootScope','$location','$state','$ionicLoading','HttpFactory','cftStore',function ($scope,$rootScope,$location,$state,$ionicLoading,HttpFactory,cftStore) {
        // HttpFactory.getData("/api/getSign").then(function (result) {
        //     console.log(result);
        // });
        $scope.clickHome = function () {
            // $state.path("tabs.integralStore")
            $state.go("tabs.integralStore");
            // $state.path = "#/tabs/integralStore";
        };
        $scope.$on('$stateChangeSuccess',function (evt,current,previous) {
            var update_wx_title = function(title) {
                var body = document.getElementsByTagName('body')[0];
                document.title = title;
                var iframe = document.createElement("iframe");
                iframe.setAttribute("src", "images/empty.png");
                iframe.addEventListener('load', function() {
                    setTimeout(function() {
                        // iframe.removeEventListener('load');
                        document.body.removeChild(iframe);
                    });
                });
                document.body.appendChild(iframe);
            };
            switch (current.url){
                case '/homePage':
                    update_wx_title("SUNNY SHU官方商城");
                    break;
                case '/integralStore':
                    update_wx_title("积分商城");
                    break;
                case '/napaStores':
                    update_wx_title("加盟店");
                    break;
                case '/personal':
                    update_wx_title("个人中心");
                    break;
    
            }
        
        
        });
        var sideMenuObj = $scope.sideMenuObj = {
            is_integral: 0,
            is_allGoods: 0,
            headTitle: '一级分类',
            menuSecondClasses: [],
            sortedClassKeys: [],
            //用作将全部商品筛选的结果反馈给 sortedController
            filterObj: {
                sortedSecondIds: [],
                minPrice: '',//最小价
                maxPrice: ''//最高价
            },
            //用于标示全局搜索
            isSearch: false,
            //
            sortedSecondClassObj: {},
            //选择全部商品
            selectAll: selectAll,
            //选择首页一级菜单
            selectHomeFirstClass: selectHomeFirstClass,
            //选中首页二级菜单
            tapedHomeSecondClass: tapedHomeSecondClass,
            //侧边栏菜单打开时的一些默认配置和操作
            sideMenuOnOpened: sideMenuOnOpened,
            //选中筛选一级菜单
            selectFiterFirstClass: selectFiterFirstClass,
            //选中筛选二级菜单
            tapedSortedSecondClass: tapedSortedSecondClass,
            //取消按钮
            cancelOption: cancelOption,
            //确认按钮
            sureOption: sureOption,
            //重置侧边栏
            // resetSideMenu: resetSideMenu
        };
        var selectedObj = {
            oneclass: '2',
            secondClass: [],
            minPrice: '',
            maxPrice: ''
        };
        //全部商品
        function selectAll(event) {
            sideMenuObj.isSearch = true;
            $rootScope.hideTabs = true;
            if (sideMenuObj.is_integral === 0){
                //广播给 homePage
                $scope.$broadcast("home_sortedView","");
            }else {
                //广播给 integralStore
                $scope.$broadcast("integral_sortedView","");
            }
        }
        
        function selectHomeFirstClass(event,key) {
            console.log(key);
            // selectedFirstClassID = key;
            selectedObj.oneclass = key;
            setSecondClassMenu(key);
        }
        function tapedHomeSecondClass(event,item) {
            
            selectedObj.secondClass = [];
            selectedObj.secondClass.push(item.id);
            cftStore.setObject("selectedObj",selectedObj);
            console.log(cftStore.getObject("selectedObj"));
            $rootScope.hideTabs = true;
            if (sideMenuObj.is_integral === 0){
                $scope.$broadcast("home_sortedView",cftStore.getObject("selectedObj").secondClass);
            }else {
                $scope.$broadcast("integral_sortedView",cftStore.getObject("selectedObj").secondClass);
            }
        }
        //通过一级分类的键获取二级分类数据
        function setSecondClassMenu(num) {
            sideMenuObj.headTitle = "二级分类";
            $scope.sideMenuObj.menuSecondClasses = sideMenuObj.sortedSecondClassObj[num].childData;
            var secondClasses = angular.element(document.querySelector("#secondClasses")).children();
            secondClasses.removeClass("active");
        }
        
        //is_integral; 0 普通商品首页 1 积分首页; is_allGoods: 0 全部普通商品 1 全部积分商品
        function sideMenuOnOpened(is_integral,is_allGoods) {
            sideMenuObj.is_allGoods = is_allGoods;
            sideMenuObj.is_integral = is_integral;
            sideMenuObj.sortedClassKeys = Object.keys(sideMenuObj.sortedSecondClassObj);
            if (!is_allGoods){
                console.log("首页or积分首页");
                sideMenuObj.headTitle = "一级分类";
            }else {
                cancelOption();
                if (sideMenuObj.isSearch){
                    selectedObj.oneclass = '2';
                    selectedObj.secondClass = [];
                    selectedObj.minPrice = '';
                    selectedObj.maxPrice = '';
                    cftStore.setObject("selectedObj",selectedObj);
                }else {
                    selectedObj = cftStore.getObject("selectedObj");
                }
                sideMenuObj.filterObj.minPrice = selectedObj.minPrice;
                sideMenuObj.filterObj.maxPrice = selectedObj.maxPrice;
                setSecondClassMenu(selectedObj.oneclass);
                
                setTimeout(function () {
                    
                    //打开时先获取本地选中对象
                    setSecondClassMenu(selectedObj.oneclass);
                    //将所有一级菜单重置
                    var firstClasses = angular.element(document.getElementById("sortedFirstClass")).children();
                    firstClasses.removeClass("active");
                    //设置一级菜单
                    angular.forEach(firstClasses,function (value,key) {
                        //转为ng元素
                        var ngEle = angular.element(value);
                        
                        if (ngEle.hasClass(selectedObj.oneclass))
                            ngEle.addClass("active");
                        
                    });
                    var secondClasses = angular.element(document.getElementById("secondClasses")).children();
                    secondClasses.removeClass("active");
                    //设置二级菜单
                    for (var className in selectedObj.secondClass){
                        if (selectedObj.secondClass.hasOwnProperty(className)){
                            console.log("className: "+ className);
                            angular.forEach(secondClasses,function (value,key) {
                                var ngEle = angular.element(value);
                                console.log(ngEle.hasClass(selectedObj.secondClass[Number(className)]));
                                if (ngEle.hasClass(selectedObj.secondClass[Number(className)])){
                                    ngEle.addClass("active");
                                }
                            });
                        }
                    }
                    
                    
                },10);
            }
            
            
        }
        
        
        //2.全部商品 筛选分类逻辑
        function selectFiterFirstClass(event,key) {
            
            selectedObj.secondClass = [];
            var firstClasses = angular.element(document.getElementById("sortedFirstClass")).children();
            firstClasses.removeClass("active");
            var target = angular.element(event.target);
            target.addClass("active");
            setSecondClassMenu(key);
            //修改本地的一级选中
            selectedObj.oneclass = key;
        }
        
        function tapedSortedSecondClass(event,item) {
            var target = angular.element(event.target);
            if (target.hasClass("active")){
                target.removeClass("active");
                selectedObj.secondClass.cftRemove(item.id);
            }else {
                console.log(target);
                target.addClass("active");
                selectedObj.secondClass.push(item.id);
                // sideMenuObj.filterObj.sortedSecondIds.push(item.id);
            }
        }
        function cancelOption() {
            selectedObj = cftStore.getObject("selectedObj");
            var secondClasses = angular.element(document.querySelector("#secondClasses")).children();
            secondClasses.removeClass("active");
        }
        function sureOption() {
            selectedObj.minPrice = sideMenuObj.filterObj.minPrice;
            selectedObj.maxPrice = sideMenuObj.filterObj.maxPrice;
            sideMenuObj.isSearch = false;
            cftStore.setObject("selectedObj",selectedObj);
            sideMenuObj.filterObj.sortedSecondIds =cftStore.getObject("selectedObj").secondClass;
            $scope.$broadcast("sureSorted",sideMenuObj.filterObj);
        }


        //全局提示的弹窗
        $scope.popTipsShow = function (msg) {
            $ionicLoading.show({
                template: msg,
                duration: 800,
                noBackdrop: true
            }).then(function(){
                console.log("打开提示弹窗");
            });
        };
        
    }]);

