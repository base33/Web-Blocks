//angular.module("umbraco.directives").directive("wbBlock", function ($compile) {
//    return {
//        terminal: true, // prevent ng-repeat from compiled twice
//        priority:1001,
//        link: function (scope, element, attrs) {
//            var block = scope.$eval(attrs.dynamicmodel);
//            attrs.$set('dynamicmodel', null);
//            attrs.$set('wbBlock', null);
//            attrs.$set('ngModel', block);

//            for (var i = 0; i < block.element.attrs.length; i++) {
//                var attribute = block.element.attrs[i];
//                attrs.$set(attribute.name, attribute.value);
//            }
//            $compile(element)(scope);
//        }
//    };
//});

angular.module("umbraco.directives").directive("wbBlock", function ($compile) {
    return {
        replace: false,
        transclude: false,
        link: function (scope, elem, attr: any) {
            var block = <WebBlocks.LayoutBuilder.Block>scope.$eval(attr.ngModel);
            var container = <WebBlocks.LayoutBuilder.Container>scope.$parent.$eval(attr.wbContainerModel);

            render();
            bindEvents();

            setInterval(function () {
                if (block.ViewModel.ShouldRerender == true) {
                    block.ViewModel.ShouldRerender = false;
                    scope.$apply(function () {
                        render();
                    });
                }
            }, 400);
            //scope.$watch(function () {
            //    return block.ViewModel.ShouldRerender;
            //},
            //function (shouldRenderValue, oldShouldRenderValue) {
            //    if (block.ViewModel.ShouldRerender == true) {
            //        block.ViewModel.ShouldRerender = false;
            //        render();
            //    }
            //});

            function render() {
                //scope.$apply(function () {
                    var requiredAttributes = ["wb-block", "wb-on-double-click", "wb-on-double-tap", "wb-on-right-click", "wb-on-touch-hold", "wb-container-model", "ng-model", "ng-repeat"];
                    $.each($(elem)[0].attributes, function () {
                        // this.attributes is not a plain object, but an array
                        // of attribute nodes, which contain both the name and value
                        if (this.specified && requiredAttributes.indexOf(this.name) < 0) {
                            elem.removeAttr(this.name)
                        }
                    });

                    //assign all block attributes
                    for (var i = 0; i < block.ViewModel.Attributes.length; i++) {
                        var attribute = block.ViewModel.Attributes[i];
                        attr.$set(attribute.Name, attribute.Value);
                    }

                    attr.$set("class", "");
                    var blockClasses = block.ViewModel.Classes;
                    if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
                        blockClasses = "wbWysiwyg " + container.WysiwygClass +
                            ((block.ViewModel.Html == "<p>&nbsp;</p>" || block.ViewModel.Html == "<p></p>" || block.ViewModel.Html == "") ? " wbWysiwygOff" : "");
                    }

                    //add all block classes
                    elem.addClass(blockClasses);
                    
                    block.ViewModel.Html = block.ViewModel.Html.substr(0, 16) == "Block Exception:" ?
                        "<p>" + block.ViewModel.Html + "<p>" :
                        block.ViewModel.Html;
                    
                    var innerContent = $(block.ViewModel.Html);  

                    //empty the block element
                    $(elem).empty();
                    //add the block content to the block
                    $(elem).append(innerContent);

                    if (block.ViewModel.ShouldCompile == true) {
                        $compile(innerContent)(scope);
                    }
                    if (block.ViewModel.ShouldForceRerender) {
                        setTimeout(function () {
                            $(elem).click(); //trigger rerender
                        }, 150);
                    }
                    //disable all buttons, submits, and anchortag
                    $(elem).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                        e.preventDefault();
                        return false;
                    });
                //});
            }

            function bindEvents() {
                //bind block to double click event
                if (attr.wbOnDoubleClick) {
                    elem.bind("dblclick", function ($event) {
                        scope.$eval(attr.wbOnDoubleClick)(elem, block, container);
                    });
                }

                //bind to the mouse down right click event
                elem.bind("mousedown", function ($event) {
                    if ($event.which == 3) {
                        $event.preventDefault();
                        scope.$eval(attr.wbOnRightClick)(elem, block, container);
                        return false;
                    }
                });
                elem.bind("taphold", function ($event) {
                    if ($event.which == 3) {
                        $event.preventDefault();
                        scope.$eval(attr.wbOnTouchHold)(elem, block, container);
                        return false;
                    }
                });
                //prevent default right click context menu
                elem.bind("contextmenu", function () {
                    return false;
                });
            }
        }
    };
});

angular.module('umbraco.directives').directive('wbSticky', function () {
    return {
        link: function (scope, elem, attr) {
            var originalOffset = parseInt($(elem).css("top").replace("px", ""));

            var scrollableWindow = getFirstParentWithClass(elem, "umb-scrollable");

            $(scrollableWindow).scroll(function (e) {
                var x = $(this).scrollTop();
                var position = x > originalOffset ? x : originalOffset;
                $(elem).css("top", position.toString() + "px")
            });

            function getFirstParentWithClass(e, cssClass) {
                if ($(e).hasClass(cssClass)) {
                    return e;
                }
                return getFirstParentWithClass($(e).parent(), cssClass);
            }
        }
    }
});

//goes on to the parent - for some reason attribute directives doesn't work on iframe elements (?)
angular.module('umbraco.directives').directive('wbIframeOnLoad', function ($parse) {
    return {
        link: function (scope, elem, attr) {
            var iframeOnLoad = $parse((<any>attr).wbIframeOnLoad);
            var iframeElement = $(elem).find("iframe")[0];
            $(iframeElement).on('load', function () {
                var params = {
                    $element: iframeElement
                };
                iframeOnLoad(scope, params);
            });
        }
    }
});


//angular.module("umbraco.directives").directive("wbOnClick", function () {
//    return {
//        link: function (scope, elem, attr) {
//            elem.bind("click", function($event) {
//                scope.$eval(attr.wbOnClick)(attr.wbblockdata)
//            });
//        }
//    }
//});



/////
//// wb-prevent-default-on-click attribute:- prevents hyperlinks within the div
/////
//angular.module("umbraco.directives").directive("wbPreventDefaultOnClick", function () {
//    return {
//        restrict: "A",
//        replace: true,
//        template: "",
//        link: function (scope, elem, attrs) {
//            $(elem).find("a").on("click", function (e) {
//                e.preventDefault();
//                return false;
//            });
//        }
//    };
//});