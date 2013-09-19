angular
	.module("lvl.directives.fileupload", ['lvl.services'])
	.directive('lvlFileUpload', ['uuid', 'fileUploader', function(uuid, fileUploader) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				chooseFileButtonText: '@',
				uploadFileButtonText: '@',
				uploadUrl: '@',
				maxFiles: '@',
				maxFileSizeMb: '@',
				autoUpload: '@',
				getAdditionalData: '&',
				onProgress: '&',
				onDone: '&',
				onError: '&'
			},
			template: '<span style="position:relative;">' +
						'<input type="file" style="opacity:0;position:absolute; z-index:0;" />' +
						'<label class="btn lvl-choose-button" ng-click="choose()" style="margin-left: 135px;">{{chooseFileButtonText}}</label>' +
						'<button class="btn lvl-upload-button" ng-show="showUploadButton" ng-click="upload()">{{uploadFileButtonText}}</button>' +
					  '</span>',
			compile: function compile(tElement, tAttrs, transclude) {
				var fileInput = angular.element(tElement.children()[0]);
				var fileLabel = angular.element(tElement.children()[1]);

				if (!tAttrs.maxFiles) {
					tAttrs.maxFiles = 1;
					fileInput.removeAttr("multiple")
				} else {
					fileInput.attr("multiple", "multiple");
				}

				if (!tAttrs.maxFileSizeMb) {
					tAttrs.maxFileSizeMb = 50;
				}

				var fileId = uuid.new();
				fileInput.attr("id", fileId);
				fileLabel.attr("for", fileId);

				return function postLink(scope, el, attrs, ctl) {
					scope.files = [];
					scope.showUploadButton = false;

					el.bind('change', function(e) {
						if (!e.target.files.length) return;

						scope.files = [];
						var tooBig = [];
						if (e.target.files.length > scope.maxFiles) {
							raiseError(e.target.files, 'TOO_MANY_FILES', "Cannot upload " + e.target.files.length + " files, maxium allowed is " + scope.maxFiles);
							return;
						}

						for (var i = 0; i < scope.maxFiles; i++) {
							if (i >= e.target.files.length) break;

							var file = e.target.files[i];
							scope.files.push(file);

							if (file.size > scope.maxFileSizeMb * 1048576) {
								tooBig.push(file);
							}
						}

						if (tooBig.length > 0) {
							raiseError(tooBig, 'MAX_SIZE_EXCEEDED', "Files are larger than the specified max (" + scope.maxFileSizeMb + "MB)");
							return;
						}

						if (scope.autoUpload && scope.autoUpload.toLowerCase() == 'true') {
							scope.upload();
						} else {
							scope.$apply(function() {
								scope.showUploadButton = true;
							})
						}
					});

					scope.upload = function() {
						var data = null;
						if (scope.getAdditionalData) {
							data = scope.getAdditionalData();
						}

						fileUploader
							.post(scope.files, data)
							.to(scope.uploadUrl)
							.then(function(ret) {
								scope.onDone({files: ret.files, data: ret.data});
							}, function(error) {
								scope.onError({files: scope.files, type: 'UPLOAD_ERROR', msg: error});
							},  function(progress) {
								scope.onProgress({percentDone: progress});
							});

						resetFileInput();
					};

					function raiseError(files, type, msg) {
						scope.onError({files: files, type: type, msg: msg});
						resetFileInput();
					}

					function resetFileInput() {
						var parent = fileInput.parent();

						fileInput.remove();
						fileInput = angular.element("<input type='file'/>");

						var inputId = uuid.new();
						fileInput.attr('id', inputId);
						fileInput.attr('style', 'opacity:0;position:absolute; z-index:0;');
						fileLabel.attr("for", inputId);

						if (scope.maxFiles > 1) {
							fileInput.attr('multiple', 'multiple');
						}

						angular.element(fileInput).insertBefore(fileLabel);
					}
				}
			}
		}
	}]);
