'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngSanitize', 'LocalStorageModule'])

.config(['$routeProvider', '$compileProvider', 'localStorageServiceProvider', function($routeProvider, $compileProvider, localStorageServiceProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
        localStorageServiceProvider
            .setPrefix('myApp')
            .setNotify(true, true)
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/)
}])

.controller('View1Ctrl', ['$scope', 'localStorageService', function($scope, localStorageService) {
        $scope.model={
            data: []
        };
        var phonebook = localStorageService.get('phonebook');
        if (phonebook != null){
            $scope.model.data = phonebook;
        }

        var createHtmlEntry = function(realName, phoneType, phone){
            return "<contact>" +
                "<category>0</category>" +
                "<person>" +
                "<realName>" + realName + "</realName>" +
                "</person>" +
                "<telephony>" +
                "<number type=\"" + phoneType + "\" prio=\"0\" vanity=\"\">" + phone +
                "</number>" +
                "</telephony>" +
                "</contact>";
        };


        var createXml = function(){
            var contacts = "";
            $scope.model.data.forEach(function(element){
                contacts += createHtmlEntry(element.realname, element.phoneType, element.phone);
            });
            var phonebooks = "<phonebooks><phonebook>" + contacts + "</phonebook></phonebooks>";
            $scope.model.download = "data:text/plain;charset=utf-8," + encodeURIComponent(phonebooks);
        };

        createXml();
        $scope.removeEntry = function(i){
            $scope.model.data.splice(i,1);
        };

        $scope.addData = function() {
            var obj = {
                realname: $scope.view.name,
                phone: $scope.view.phone,
                phoneType: $scope.view.phoneType
            };
            $scope.model.data.unshift(obj);
            $scope.view.name = "";
            $scope.view.phone = "";
            localStorageService.set('phonebook', $scope.model.data);
            createXml()
        };


        $scope.clearData = function(){
            localStorageService.set('phonebook', null);
            $scope.model.data = [];
        };
}]);