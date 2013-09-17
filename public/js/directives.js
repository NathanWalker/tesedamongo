window.angular.module("App.directives", []).directive('scrollTopLink', [
  '$location', '$rootScope', function($location, $rootScope) {
    var link;
    link = function(scope, element, attrs) {
      return element.bind('click', function() {
        $rootScope.safeApply(function() {
          return $location.hash('');
        });
        $('html, body').animate({
          scrollTop: 0
        }, 500);
        return false;
      });
    };
    return {
      restrict: 'A',
      link: link
    };
  }
]).directive("nwFancyboxMedia", [
  "$timeout", function($timeout) {
    var link;
    link = function(scope, element, attrs) {
      return element.fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        prevEffect: 'none',
        nextEffect: 'none',
        arrows: false,
        helpers: {
          media: {}
        }
      });
    };
    return {
      restrict: 'A',
      link: link
    };
  }
]).directive('tesedaIsotope', [
  '$timeout', function($timeout) {
    var link;
    link = function(scope, element, attrs) {
      var $container, filter_projects, init;
      $container = void 0;
      filter_projects = function(tag) {
        $container.isotope({
          filter: tag
        });
        $("#portfolio li.active").removeClass("active");
        return $("#portfolio-filter").find("[data-filter='" + tag + "']").parent().addClass("active");
      };
      init = function() {
        $container = $("#portfolio-items");
        if ($container.length) {
          $(".project").each(function() {
            var $this, classes, i, tags, _results;
            $this = $(this);
            tags = $this.data("tags");
            if (tags) {
              classes = tags.split(",");
              i = classes.length - 1;
              _results = [];
              while (i >= 0) {
                $this.addClass(classes[i]);
                _results.push(i--);
              }
              return _results;
            }
          });
          $container.isotope({
            itemSelector: ".project",
            layoutMode: "fitRows"
          });
          return $("#portfolio-filter li a").bind('click', function() {
            var selector;
            selector = $(this).attr("data-filter");
            filter_projects(selector);
            return false;
          });
        }
      };
      return $timeout(function() {
        return init();
      }, 400);
    };
    return {
      restrict: "A",
      link: link
    };
  }
]).directive('tagManager', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        controller:'TagsCtrl',
        scope: {},
        template:
            '<div>' +
            '<ul class="tags">' +
                '<li ng-repeat="(idx, tag) in tags" data-lvl-draggable="true" data-tag-id="{{tag._id}}"><a data-ng-click="selectTag(tag)">{{tag.name}}</a></li>' +
            '</ul>' +
            '<div data-ng-if="$root.global.isModerator()" style="margin-top:10px;"><form class="form-horizontal"><input type="text" placeholder="Add a category..." ng-model="activeTag.name"/>' +
            '<input type="submit" class="btn" data-ng-click="create(activeTag)" value="Add"/></form>' +
            '<div data-lvl-drop-target="true" data-on-drop="dropped(dragEl, dropEl)" data-icon="&#x29;"></div>' +
            '</div>' +
            '</div>',
        link: function ( scope, el ) {
            var input = angular.element( el.children()[1] );

            scope.selectTag = function(tag) {
              $rootScope.$broadcast('tag:selected', tag);
            };

            scope.dropped = function(dragEl, dropEl) { // function referenced by the drop target
              var drop = angular.element(dropEl);
              var drag = angular.element(dragEl);

              $rootScope.$broadcast('tag:remove', drag.attr('data-tag-id'));
            };

            // Capture all keypresses
            input.bind( 'keypress', function ( event ) {
                // But we only care when Enter was pressed
                if ( event.keyCode == 13 ) {
                    // There's probably a better way to handle this...
                    $rootScope.safeApply(function(){
                      scope.create(s.activeTag);
                    });
                }
            });
        }
    };
}]);

