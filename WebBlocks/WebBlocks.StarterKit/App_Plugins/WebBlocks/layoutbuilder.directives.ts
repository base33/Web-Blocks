/// <reference path="layoutbuilder.models.ts" />

angular.module("umbraco.directives").directive("wbElement", function ($compile) {
    return {
        replace: false,
        transclude: false,
        link: function (scope, elem, attr: any) {
            var block = <WebBlocks.LayoutBuilder.Block>scope.$eval(attr.wbBlockModel);
            var container = <WebBlocks.LayoutBuilder.Container>scope.$parent.$eval(attr.wbContainerModel);
            scope.gridDefinitions = scope.$eval(attr.gridDefinitions);

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

                var innerContent;
                if (block instanceof (WebBlocks.LayoutBuilder.ElementBlock)) {
                    blockClasses = "wbElement " + block.ViewModel.Classes;
                    scope.block = block;
                    block["Previews"] = [];
                    innerContent = "<div wb-element ui-sortable='getSortableOptionsForBlock(child)' ng-model='child.Children' wb-block-model='child' ng-repeat='child in block.Children' grid-definitions='gridDefinitions'></div>" +
                        "<div class='wbAdd'><span ng-show='block.ViewModel.EnableAddBlock'>+ block</span></div>" + 
                        "<div class='wbAddContainer' ng-show='block.ViewModel.EnableAddGrid'><div wb-add-grid block='block' block-list='block.Children' grid-definitions='gridDefinitions'></div></div>" +
                        "<div wb-element-preview ng-click='child.onSelect()' ng-model='block.Preview' wb-block-model='child' ng-repeat='child in block.Previews track by $index' grid-definitions='gridDefinitions'></div>";
                }
                else {
                    innerContent = block.ViewModel.Html;
                }

                //add all block classes
                elem.addClass(blockClasses);



                if (block.ViewModel.ShouldCompile == true) {
                    scope.block = block;
                    var compiledContent = $compile(innerContent)(scope);
                    //empty the block element
                    $(elem).empty();
                    //add the block content to the block
                    $(elem).append(compiledContent);
                }
                else {
                    //empty the block element
                    $(elem).empty();
                    //add the block content to the block
                    $(elem).append(innerContent);
                }
                if (!(block instanceof WebBlocks.LayoutBuilder.ElementBlock) && block.ViewModel.ShouldForceRerender) {
                    setTimeout(function () {
                        $(elem).click(); //trigger rerender
                    }, 150);
                }
                //disable all buttons, submits, and anchortag
                $(elem).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                    e.preventDefault();
                    return false;
                });

                scope.getSortableOptionsForBlock = function (child) {
                    return child instanceof WebBlocks.LayoutBuilder.ElementBlock
                        ? {
                            handle: ":not(.wbAdd)",
                            modelData: child.Children,
                            over: function (e, ui) {
                                //TODO: highlight the current box
                            },
                            update: function (e, ui) {
                            },
                            stop: function (e, ui) {
                            }
                        }
                        : {
                            disabled: true
                        };
                };
            }

            function bindEvents() {
                //prevent default right click context menu
                elem.bind("contextmenu", function () {
                    return false;
                });
            }
        }
    };
})

angular.module("umbraco.directives").directive("wbElementPreview", function ($compile) {
    return {
        replace: false,
        transclude: false,
        link: function (scope, elem, attr: any) {
            var block = <WebBlocks.LayoutBuilder.Block>scope.$eval(attr.wbBlockModel);
            var container = <WebBlocks.LayoutBuilder.Container>scope.$parent.$eval(attr.wbContainerModel);
            scope.gridDefinitions = scope.$eval(attr.gridDefinitions);

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

                var innerContent;
                if (block instanceof (WebBlocks.LayoutBuilder.ElementBlock)) {
                    blockClasses = "wbElement " + block.ViewModel.Classes;
                    scope.block = block;
                    block["Previews"] = [];
                    innerContent = "<div wb-element-preview ng-click='child.onSelect()' ng-model='child.Children' wb-block-model='child' ng-repeat='child in block.Children' grid-definitions='gridDefinitions'></div>";
                }
                else {
                    innerContent = block.ViewModel.Html;
                }

                //add all block classes
                elem.addClass(blockClasses);



                if (block.ViewModel.ShouldCompile == true) {
                    scope.block = block;
                    var compiledContent = $compile(innerContent)(scope);
                    //empty the block element
                    $(elem).empty();
                    //add the block content to the block
                    $(elem).append(compiledContent);
                }

                if (!(block instanceof WebBlocks.LayoutBuilder.ElementBlock) && block.ViewModel.ShouldForceRerender) {
                    setTimeout(function () {
                        $(elem).click(); //trigger rerender
                    }, 150);
                }
                //disable all buttons, submits, and anchortag
                $(elem).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                    e.preventDefault();
                    return false;
                });
            }

            function bindEvents() {
                //prevent default right click context menu
                elem.bind("contextmenu", function () {
                    return false;
                });
            }
        }
    };
})

angular.module("umbraco.directives").directive("wbAddGrid", function () {
    return {
        replace: true,
        scope: {
            gridDefinitions: '=',
            blockList: '=',
            block: '='
        },
        transclude: false,
        template:   `<div class='wbAdd'>
                        <span ng-click='showGridSelector()'>+</span>
                    </div>`,
        link: function (scope, elem, attr: any) {
            scope.gridDefinitions = scope.gridDefinitions;//scope.$eval(attr.gridDefinitions);
            scope.blockList = scope.blockList;//scope.$eval(attr.blockList);
            scope.block = scope.block;

            scope.showGridSelector = () => {
                if (scope.block.Previews != undefined && scope.block.Previews != null && scope.block.Previews.length > 0) {
                    scope.block.Previews = [];
                    return;
                }
                scope.block["Previews"] = [];
                for (var gridDefinition of scope.gridDefinitions) {
                    scope.block.Previews.push(createElement(gridDefinition, true, true));
                }
            }

            scope.addGrid = (gridDefinition, previewMode) => {
                var block = createElement(gridDefinition, true, previewMode);
                scope.blockList.push(block);
                scope.showOptions = false;
            }

            function createElement(gridDefinition: WebBlocks.LayoutBuilder.IGridDefinition, firstElement: boolean, previewMode: boolean, onSelectCallback = null) : WebBlocks.LayoutBuilder.ElementBlock {
                var block = new WebBlocks.LayoutBuilder.ElementBlock();
                block.Name = gridDefinition.Alias != undefined ? gridDefinition.ClassName : gridDefinition.Alias;
                block.Class = gridDefinition.ClassName + (previewMode ? " preview-element" + (firstElement ? " preview-row" : "") : "");
                block.ViewModel.Classes = gridDefinition.ClassName + (previewMode ? " preview-element" + (firstElement ? " preview-row" : "") : "");
                block.ViewModel.ShouldCompile = true;
                block.ViewModel.EnableAddBlock = gridDefinition.AllowNonElementBlocks;
                block.ViewModel.EnableAddGrid = gridDefinition.AllowedChildGrids != null && gridDefinition.AllowedChildGrids.length > 0;
                
                if (firstElement && previewMode) {
                    onSelectCallback = ((gridDefinition, scope) => {
                        return () => {
                            scope.addGrid(gridDefinition, false);
                            scope.block.Previews = [];
                        };
                    })(gridDefinition, scope);
                }

                //on select block
                block["onSelect"] = onSelectCallback;

                for (var child of gridDefinition.GridDefinitions) {
                    block.Children.push(createElement(child, false, previewMode, onSelectCallback));
                }

                

                return block;
            }
        }
    }
})

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