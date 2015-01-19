'use strict';

/**
 * @ngdoc function
 * @name videoPassApp.controller:VideodetailctrlCtrl
 * @description
 * # VideodetailctrlCtrl
 * Controller of the videoPassApp
 */
angular.module('videoPassApp')
  .controller('VideodetailCtrl', ['$scope', '$rootScope', '$stateParams', '$http', 'apiService', '$location', 'subscribeType', function ($scope, $rootScope, $stateParams, $http, apiService, $location, subscribeType) {
    var videoId;

    $scope.state = $stateParams;
    $scope.videoId = videoId = $stateParams.videoId;
    $scope.absUrl = $location.absUrl();
    $scope.type = subscribeType.check();

    $http(apiService.genRequest('GET', 'videos/' + videoId))
    .success(function (data) {
      $scope.video = data;
      if (data.seriesIds.length > 0) {
        $scope.isSeries = true;
        $http(apiService.genRequest('GET', 'series/' + data.seriesIds[0]))
        .success(function (data) {
          $scope.episodes = data.episodes;
        });
      }
      // broadcast to inform PlayerCtrl when detail is loaded
      $scope.$broadcast('DETAIL_LOADED', $scope);
    });

    // fake series and sameGenre
    $http(apiService.genRequest('GET', 'videos/' + videoId + '/recommend'))
    .success(function (data) {
      $scope.sections = data.recommends.sections;
    });

    // check type of each recommends
    // logic might change in the future
    $scope.checkType = function (title) {
      if (/見放題/.test(title)) {
        return 'unlimited';
      } else if (/無料/.test(title)) {
        return 'free';
      } else if (/レンタル/.test(title)) {
        return 'ppv';
      } else {
        throw new Error('type not matched, stg went wrong');
      }
    };

    $scope.favLogic = function (isDisable) {
      // do correspondent depends on isDisable
      $rootScope.$broadcast('LOADING');
      $http(apiService.genRequest('POST', 'users/me/favorites/videos/' + $scope.video.id))
      .success(function (data) {
        console.log('successfully add to favorites');
        $rootScope.$broadcast('DONE');
        toastr.success('Video ' + $scope.video.name + ' successfully added to favorite')
      })
      .error(function (error) {
        $rootScope.$broadcast('FAILED', error);
        alert(JSON.stringify(error));
      });
    }
  }]);
