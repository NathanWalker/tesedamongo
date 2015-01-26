/*
 * grunt-contrib-uglify
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({

    // Before generating any new files, remove any previously-created files.
    clean: {
      dist: ['public/js/dist']
    },

    // Configuration to be run (and then tested).
    uglify: {
      dist: {
        src: [
          'public/lib/lodash/dist/lodash.compat.min.js',
          'public/lib/jquery/jquery.min.js',
          'public/lib/jquery-ui/ui/minified/jquery.ui.core.min.js',
          'public/lib/jquery-ui/ui/minified/jquery.ui.widget.min.js',
          'public/lib/jquery-ui/ui/minified/jquery.ui.mouse.min.js',
          'public/lib/jquery-ui/ui/minified/jquery.ui.sortable.min.js',
          'public/lib/angular/angular.min.js',
          'public/lib/angular-cookies/angular-cookies.min.js',
          'public/lib/angular-resource/angular-resource.min.js',
          'public/lib/angular-sanitize/angular-sanitize.min.js',
          'public/lib/angular-route/angular-route.min.js',
          'public/lib/angular-touch/angular-touch.min.js',
          'public/lib/angular-ui-utils/modules/highlight/highlight.js',
          'public/js/vendor/ui-bootstrap-custom-tpls-0.10.0.js',
          'public/lib/angular-ui-sortable/src/sortable.js',
          'public/lib/infowrap-ng-table/ng-table.src.js',
          'public/lib/infowrap-isotope/jquery.isotope.js',
          'public/lib/infowrap-angular-isotope/dist/infowrap-angular-isotope.js',
          'public/js/theme/jquery.hotkeys.min.js',
          'public/js/theme/jquery.touchSwipe.js',
          'public/js/theme/functions.js',
          'public/js/fancybox/jquery.fancybox.pack.js',
          'public/js/fancybox/helpers/jquery.fancybox-buttons.js',
          'public/js/fancybox/helpers/jquery.fancybox-media.js',
          'public/js/lvl-uuid.js',
          'public/js/lvl-drag-drop.js',
          'public/js/lvl-file-upload.js',
          'public/js/lvl-xhr-post.js',
          'public/js/app.js',
          'public/js/config.js',
          'public/js/directives.js',
          'public/js/filters.js',
          'public/js/services/app.services.js',
          'public/js/services/global.js',
          'public/js/services/banners.js',
          'public/js/services/slides.js',
          'public/js/services/products.js',
          'public/js/services/users.js',
          'public/js/services/posts.js',
          'public/js/services/videos.js',
          'public/js/services/tags.js',
          'public/js/services/images.js',
          'public/js/services/pages-cache.js',
          'public/js/services/pages.js',
          'public/js/services/specs.js',
          'public/js/services/search.js',
          'public/js/services/softwares.js',
          'public/js/services/appnotes.js',
          'public/js/controllers/app.controllers.js',
          'public/js/controllers/header.js',
          'public/js/controllers/footer.js',
          'public/js/controllers/home.js',
          'public/js/controllers/partners.js',
          'public/js/controllers/register.js',
          'public/js/controllers/login.js',
          'public/js/controllers/banner-edit.js',
          'public/js/controllers/products.js',
          'public/js/controllers/product-edit.js',
          'public/js/controllers/users.js',
          'public/js/controllers/posts.js',
          'public/js/controllers/videos.js',
          'public/js/controllers/tags.js',
          'public/js/controllers/images.js',
          'public/js/controllers/pages.js',
          'public/js/controllers/about.js',
          'public/js/controllers/contact.js',
          'public/js/controllers/specs.js',
          'public/js/controllers/support.js',
          'public/js/controllers/search.js',
          'public/js/controllers/downloads.js',
          'public/js/controllers/appnotes.js',
          'public/js/init.js'
        ],
        dest: "public/js/dist/teseda.min.js"
      }
    }
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean:dist', 'uglify:dist']);

};
