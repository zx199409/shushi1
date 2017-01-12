/**
 * Created by qingyun on 16/12/2.
 */
angular.module('cftApp.httpFactory',[]).factory('HttpFactory',['$http','$q',function ($http,$q) {
    return {
        getData:function (url,params,type) {
            if (url){
                url = ROOT_URL + url;
                var promise = $q.defer();
                type = type ? type:"GET";
                params = params ? params:{};
                $http({
                    url:url,
                    method:type,
                    params:params,
                    timeout:20000
                }).then(function (reslut) {
                    reslut =reslut.data;
                    // reslut = reslut[Object.keys(reslut)[0]];
                    promise.resolve(reslut);
                },function (err) {
                    promise.reject(err);
                });
                return promise.promise;
            }
        }
    };
}]);