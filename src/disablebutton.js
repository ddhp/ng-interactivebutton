'use strict';

angular.module('myapp')
  .directive('disableButton', function () {
    var _type,
        _verifyName = function (scope, name) {
          return (name === scope.name) ? true : false;
        };

    return {
      templateUrl: 'src/interactivebutton.html',
      restrict: 'E',

      scope: {
        name: '@',
        normalText: '@',
        loadingText: '@',
        errorText: '@',
        disableText: '@',
        isDisable: '=', // possibly set from controller
        onClick: '&onClick',
      },

      link: function postLink(scope, element, attrs) {

        // if it's not disabled then it's normal status
        scope.isNormal = !scope.isDisable;
        scope.isLoading = false;
        scope.isBlocking = false; // block interaction when activating
        
        element.on('click', function (e) {
          if (scope.isBlocking || scope.isDisable) return;
          scope.isBlocking = true;
          scope.onClick({name: scope.name, isDisable: true});
        });

        scope.$on('LOADING', function (e, name) {
          if (!_verifyName(scope, name)) return
          scope.isNormal = false;
          scope.isLoading = true;
          scope.$digest();
          var spinner = new Spinner({
            length: 2,
            width: 3,
            radius: 7,
            corners: 1.0,
            color: '#fff',
            top: '10px'
          }).spin();
          element.find('.spin-wrapper').append(spinner.el);
        })

        /**
         * when it's done
         * toggle scope.isDisable if isToggle
         * else just make isLoading falsy
         *
         */
        scope.$on('DONE', function (e, name) {
          if (!_verifyName(scope, name)) return
          scope.isBlocking = false;
          scope.isLoading = false;
          scope.isDisable = scope.isDisable ? false : true;
        });
      },

      controller: function ($timeout, $scope) {
        /**
         * b/c we need $timeout
         * so handle FAILED in controller
         * set status
         * and 3s later
         * go back to normal status
         *
         */
        $scope.$on('FAILED', function (e) {
          if (!_verifyName(scope, name)) return
          $scope.isBlocking = false;
          $scope.isLoading = false;
          $scope.isError = true;
          $timeout(function () {
            $scope.isError = false;
            $scope.isNormal = true;
          }, 3000)
        });
      }
      // },
      //
      // template: '<a class="btn btn-lg btn-block btn-primary" ng-class="{\'disabled\':isDisable, \'btn-danger\': isError}">'
      //   + '<div ng-show="isNormal">'
      //   + '<i class="fa fa-star-o"></i>{{normalText}}'
      //   + '</div>'
      //   + '<div ng-show="isLoading">'
      //   + '<div class="spin-wrapper">'
      //   + '</div>'
      //   + '{{loadingText}}'
      //   + '&nbsp;'
      //   + '</div>'
      //   + '<div ng-show="isDisable">{{disableText}}</div>'
      //   + '<div ng-show="isError">{{errorText}}</div>'
    };
  });
