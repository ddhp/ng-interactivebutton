'use strict';

/**
 * @ngdoc directive
 * @name myapp.directive:interactiveButton
 * @description
 * # interactiveButton
 *
 * needed files:
 *  - views/interacticebutton.html
 *  - styles/_interactivebutton.scss
 *
 *
 * @concept
 *  business logic still handled in controller
 *  this directive only dispose 
 *  user interactive event and controller callback event
 *
 * @preparation
 *  - setup controller
 *    - isDisable: disable status
 *    - behavior callbacks: functions which handle behavior,
 *      assign them at view, functions should fire these events:
 *        - LOADING
 *        - DONE
 *        - FAILED
 *  
 *  - setup controller level view
 *    - give below parameters at view file, e.g
 *      <interactive-button
 *      normal-text="normal status"
 *      loading-text="loading status"
 *      disable-text="disable status"
 *      error-text="error status"
 *      // toggle status instead of same behavior
 *      is-disable=false
 *      is-toggle=true 
 *      is-on=true
 *      // onclick callback in controller
 *      on-click="onClickCallback" 
 *      ></interactive-button>
 */

angular.module('myapp')
  .directive('toggleButton', function () {
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
        offText: '@',
        isOff: '=', // possibly set from controller
        onClick: '&onClick',
      },

      link: function postLink(scope, element, attrs) {

        // if it's not off then it's normal status
        scope.isNormal = !scope.isOff;
        scope.isLoading = false;
        scope.isBlocking = false; // block interaction when activating
        
        element.on('click', function (e) {
          if (scope.isBlocking) return;
          scope.isBlocking = true;
          // toggle the value
          var value = scope.isOff ? false : true;
          scope.onClick({name: scope.name, isOff: value});
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
          scope.isOff = scope.isOff ? false : true;
          scope.isNormal = scope.isOff ? false : true;
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