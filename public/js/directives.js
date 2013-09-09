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
]);

