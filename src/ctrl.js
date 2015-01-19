'use strict';

angular.module('myapp', [])
  .controller('MyCtrl', function ($rootScope, $scope, $timeout) {

    $scope.onDefaultClick = function (name) {
      $scope.$broadcast('LOADING', name);
      $timeout(function () {
        $scope.$broadcast('DONE', name);
      }, 2000)
    }

    $scope.onDisableClick = function (name, status) {
      $rootScope.$broadcast('LOADING', name);
      $timeout(function () {
        $rootScope.$broadcast('DONE', name);
      }, 2000)
    }

    $scope.onToggleClick = function (name, status) {
      /**
       * u might want to do diffrent behavior
       * depends on 'status'
       *
       */
      // if (status) {
      //  do()
      // } else {
      //  dosomethingelse()
      // }
      $rootScope.$broadcast('LOADING', name);
      $timeout(function () {
        $rootScope.$broadcast('DONE', name);
      }, 2000)
    }

  });
