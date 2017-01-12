/**
 * Created by Administrator on 2016/12/7.
 */
angular.module('cftApp.receiptAddress',[])
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider.state('tabs.receiptAddress',{
            url:'/receiptAddress',
            views:{
                'tabs-personal':{
                    templateUrl:'receiptAddress.html',
                    controller:'receiptAddressController'
                }
            }
        });
    }])
    .controller('receiptAddressController',['$scope','$rootScope','$ionicPopup','HttpFactory','$ionicModal',function ($scope,$rootScope,$ionicPopup,HttpFactory,$ionicModal) {
        //隐藏tabs-bar
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = true;
        });
        //初始化收货地址数据
        var addressObj = $scope.addressObj = {
            adreessListDatas: [],
            addressModal: {
                vname: '',
                tel: '',
                province: '',
                city: '',
                address: '',
                code: ''
            },
            addAddress: addAddress,
            cancelAdd: cancelAdd,
            saveAddress: saveAddress,

            closeModal:closeModal,
            openModal:openModal,
            changeDefault:changeDefault,
            showConfirm:showConfirm,
            // doRefresh: doRefresh, //下拉刷新
            // loadMore: loadMore//加载更多
        };

        $scope.addressOptionObj={};
        //引入外部的编辑地址模态
        $ionicModal.fromTemplateUrl('editAddressModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        //打开模态
        function openModal(option,index) {
            if(option == 'edit'){
                console.log(index);
                $scope.addressOptionObj = addressObj.adreessListDatas[index];
                $scope.addressOptionObj.title="编辑收货地址";
            }else{
                $scope.addressOptionObj = {
                    vname: '',
                    tel: '',
                    province: '',
                    city: '',
                    address: '',
                    code: ''
                };
                $scope.addressOptionObj.title = "新增收货地址"
            }
            $scope.modal.show();
        }
        //关闭模态
        function cancelAdd() {
            $scope.modal.hide();
        }
        function closeModal() {
            $scope.modal.hide();
        }
        //当销毁controller时会清除模态modal
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        //实现单选的选择
        function changeDefault(index) {
            for (var i = 0;i<$scope.addressObj.adreessListDatas.length;i++){
                $scope.addressObj.adreessListDatas[i].default = false;
            }
            $scope.addressObj.adreessListDatas[index].default = true;
            console.log(index);
        }
        //保存收货地址
        function saveAddress() {
            addressObj.closeModal();
            var addressParams = addressObj.addressModal;
            //临时变量
            addressParams = $scope.addressOptionObj;

            addressParams.province = "河南省";
            addressParams.city = "郑州市";
            addressParams.sessid = 114;
            console.log(addressParams);
            HttpFactory.getData("/api/uAddress",addressParams,"POST")
                .then(function (result) {
                    if (result.status == "0"){
                        console.log("地址保存成功");
                        //成功提示
                        requestAddesses();
                    }else {
                        //错误提示
                        console.log("地址保存失败");
                        console.log(result);
                    }
                },function (err) {

                });
        }

        function addAddress() {
            $scope.openModal();
        }

        //首先请求收货地址列表
        requestAddesses();
        function requestAddesses() {
            var params = {
                sessid:114
            };

            //列出收货地址的请求

            setTimeout(function () {
                    HttpFactory.getData("/api/uAddress",params,"GET")
                        .then(function (result) {
                            $scope.addressObj.adreessListDatas = result["addressData"];
                            $scope.addressObj.adreessListDatas[0].default=true;
                            console.log($scope.addressObj.adreessListDatas);
                        },function (err) {

                        });
            },300);


        }
        function showConfirm(index) {
            var myPopup = $ionicPopup.show({
                cssClass:'myOrder',
                template:'确认要删除该地址吗？',
                scope: $scope,
                buttons: [
                    { text: '取消',
                        type: ''
                    },
                    {
                        text: '确定',
                        type: '',
                        onTap: function(e) {
                            var id=addressObj.adreessListDatas[index].id;
                            // console.log(id);
                            //删除收货地址的网络请求
                            HttpFactory.getData("/api/uAddress",{id:id,sessid:114},"DELETE")
                                .then(function (result) {

                                    addressObj.adreessListDatas.splice(index ,1);
                                    if(addressObj.adreessListDatas.length >= 1){
                                        addressObj.adreessListDatas[0].default=true;
                                    }
                                    console.log('_______________');
                                    console.log(result);
                                    if (result['status'] == '0'){
                                        //刷新收货地址
                                        //成功提示？
                                    }else {
                                        //错误提示
                                    }
                                },function (err) {

                                });
                        }
                    }
                ]
            });
        }


    }]);