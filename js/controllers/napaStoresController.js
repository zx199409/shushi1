/**
 * Created by qingyun on 16/11/30.
 */
angular.module('cftApp.napaStores',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.napaStores',{
        url:'/napaStores',
        views:{
            'tabs-napaStores':{
                templateUrl:'napaStores.html',
                controller:'napaStoresController'
            }
        }
    });
}]).controller('napaStoresController',['$scope','HttpFactory','$ionicModal',function ($scope,HttpFactory,$ionicModal) {
    $scope.items = ['1','2','3'];
    var napaObj = $scope.napaObj = {
        storesData: {}
    };

    $scope.napaStores = {
        changeAddress:changeAddress,
        text:'北京'

    };

    function changeAddress(event) {

        if (event.target !== event.currentTarget){
            var text = angular.element(event.target).parent('.radio')[0].innerText;
            console.log(text);
            $scope.napaStores.text = text;
            //发送网络请求，将选项内容发回去
            var params = {text:$scope.napaStores.text};
            // HttpFactory.getData("/api/franchise",params)
            //     .then(function (result) {
            //         console.log(result["data"]);
            //         napaObj.storesData = result["data"];
            //     },function (err) {
            //
            //     });
            $scope.modal.hide();
        }


    }

    $ionicModal.fromTemplateUrl('choiceAddressModal.html',{
        scope:$scope,
        animation: 'fade-out',
        focusFirstInput:true,
        backdropClickToClose:true
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.chooseLocation = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function () {

    };

    //当我们用完模型时，清除它！
    $scope.$on('$destroy', function() {
        console.log(2222);
        $scope.modal.remove();
    });




    var params = {nums:5};
    HttpFactory.getData("/api/franchise",params)
        .then(function (result) {
            console.log(result["data"]);
            napaObj.storesData = result["data"];
        },function (err) {
            
        });
}]);