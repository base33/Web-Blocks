module WebBlocks 
{
    export module LayoutBuilder {

        export class LayoutBuilder {
            public Containers: any = {};                            //array of containers that are on the page
            public RecycleBin: Array<RecycleBinBlock> = new Array<RecycleBinBlock>();   //array of blocks added to the recycle bin
            public BlockStorage: Array<BlockStorageBlock> = new Array<BlockStorageBlock>(); //array of blocks added to the block storage
        }

        export class Container {
            public Name: string = "";
            public WysiwygClass: string = "";                            //the class to set on any wysiwyg in the container
            public Blocks: Array<Block> = new Array<Block>();
        }

        export class Block {
            public Id: number = 0;                                      //the id of the wysiwyg or block
            public Name: string = "";                                    //the name of the block (normally shown in recycle bin or block storage)
            public SortOrder: number = 0;                               //the sort order
            public IsTemplateBlock: boolean = false;                        //whether the block is one from the template
            public TemplateContainer: string = "";
            public IsDeletedBlock: boolean = false;                         //whether the block has been deleted
            public ViewModel: BlockViewModel = new BlockViewModel();
            public __type: string = "Unknown";
        }

        export class NodeBlock extends Block {
            public constructor() {
                super();
                this.__type = "NodeBlock"
            }
        }

        export class WysiwygBlock extends Block {
            public Content: string = "";                                 //the content of the wysiwyg

            public constructor() {
                super();
                this.__type = "WysiwygBlock"
            }
        }

        export class BlockViewModel {
            public Tag: string = "";
            public Attributes: Array<BlockViewElementAttribute> = new Array<BlockViewElementAttribute>();    //any attributes to render
            public Classes: string = "";                                 //any classes to render
            public Html: string = "";                                    //inner html
            public ShouldRerender: boolean = false;                         //flag to rerender the view (used by the wbBlock directive)
            public ShouldCompile: boolean = false;
        }

        export class BlockViewElementAttribute {
            public Name: string = "";                                    //name of the attribute
            public Value: string = "";                                   //value of the attribute

            public constructor(name: string, value: string) {
                this.Name = name;
                this.Value = value;
            }
        }

        export class BlockStorageBlock {
            public constructor(
                public Block: Block,
                public Message: string,
                public BlockHistory: BlockHistory) {
            }
        }

        export class RecycleBinBlock {
            public constructor(
                public Block: Block,
                public Message: string,
                public BlockHistory: BlockHistory) {
            }
        }

        export class BlockHistory {
            public constructor(
                public LastContainer: string) {

            }
        }

        export class BlockType {
            public static Wysiwyg: string = "WysiwygBlock";
            public static Node: string = "NodeBlock"

            public static IsInstanceOf(block: WebBlocks.LayoutBuilder.Block, blockType: string) {
                return block.__type == blockType;
            }
        };

        export class TypedBlockConverter {
            public static TypeIt(block: Block) : Block {
                var typedBlock = block.__type == BlockType.Wysiwyg ?
                    new WysiwygBlock() :
                    new NodeBlock();

                typedBlock.Id = block.Id;
                typedBlock.Name = block.Name;
                typedBlock.SortOrder = block.SortOrder;
                typedBlock.IsDeletedBlock = block.IsDeletedBlock;
                typedBlock.IsTemplateBlock = block.IsTemplateBlock;
                typedBlock.ViewModel = block.ViewModel;
                typedBlock.TemplateContainer = block.TemplateContainer;

                if (typedBlock instanceof WysiwygBlock)
                    typedBlock.Content = (<WysiwygBlock>block).Content;

                return typedBlock;
            }

            public static TypeAll(blocks: Array<Block>) : Array<Block> {
                var typedBlocks = new Array<Block>();
                for (var i = 0; i < blocks.length; i++) {
                    typedBlocks.push(TypedBlockConverter.TypeIt(blocks[i]));
                }
                return typedBlocks;
            }
        }
    }//end of WebBlocks.LayoutBuilder
    

    export module UI {

        export class UIState {
            public LayoutBuilder: LayoutBuilderState = new LayoutBuilderState(true);
            public IframeEditor: IframeEditorState = new IframeEditorState(false);

            public constructor(uiState: UIState) {
                Utils.PropertyHelper.CopyProperties(uiState, this);
            }
        }


        export class LayoutBuilderState {
            public Visible: boolean = false;

            public constructor(visible) {
                this.Visible = visible;
            }
        }

        export class IframeEditorState {
            public Visible: boolean = false;
            public Url: string = "";
            public BlockId: number = 0;

            public constructor(visible) {
                this.Visible = visible;
            }
        }

        export class DraggableBlockModel {
            public Block: WebBlocks.LayoutBuilder.Block;
            public BlockIconClass: string = "";
            public ShouldClone: boolean;
            public LoadContent: boolean;
            public OnDropCallback: (DraggableBlockModel) => void;
        }

        export module Dialogs {
            export class DialogTemplateProvider {
                public static ContextMenuTemplate: string = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.ContextMenuDialog.html";
                public static AddBlockTemplate: string = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.AddBlockDialog.html";
                public static BlockStorageTemplate: string = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.BlockStorageDialog.html";
                public static RecycleBinTemplate: string = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.RecycleBinDialog.html";
            }

            export class DialogOptionsFactory {
                public static BuildContextMenuDialogOptions(contextMenu: ContextMenu, callback: (event: ContextMenuResponse) => { }) : any {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.ContextMenuTemplate,
                        show: true,
                        modalClass: 'wb-context-menu umb-modal',
                        modelData: contextMenu,
                        callback: callback
                    };
                }   

                public static BuildAddBlockDialogOptions(addBlockMenu: AddBlockMenu): any {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.AddBlockTemplate,
                        modelData: addBlockMenu,
                        show: true
                    };
                }
                
                public static BuildBlockStorageDialogOptions(layoutBuilder: WebBlocks.LayoutBuilder.LayoutBuilder): any {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.BlockStorageTemplate,
                        show: true,
                        modelData: layoutBuilder.BlockStorage
                    };
                }

                public static BuildRecycleBinDialogOptions(layoutBuilder: WebBlocks.LayoutBuilder.LayoutBuilder): any {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.RecycleBinTemplate,
                        show: true,
                        modelData: new Dialogs.RecycleBinContext(layoutBuilder.RecycleBin, layoutBuilder.Containers)
                    };
                }
            }

            export class AddBlockMenu {
                public constructor(
                    public rootId: number,
                    public layoutBuilderScope: any) {
                }
            }

            export class ContextMenu {
                public constructor(
                    public Events: Array<ContextMenuEvent> = new Array<ContextMenuEvent>(),
                    public EventData: any = {}) {
                }
            }

            export class ContextMenuEvent {
                public constructor(
                    public Name: string,
                    public IconClass: string) {
                }
            }

            export class ContextMenuResponse {
                public constructor(
                    public Event: string,
                    public EventData: any) {
                }
            }

            export class NavigationViewModel {
                public Parent: NavigationViewModel;         //the parent navigation view model
                public Model: API.Models.NavigationItem;  //the data about the navigation item, such as name, icon, etc
                public DraggableBlock: DraggableBlockModel; //the draggable block to be dropped into a container
                public Children: Array<NavigationViewModel>; //child navigation view models ready to the loaded as navigation view models
            }

            export class RecycleBinContext {
                public constructor(
                    public RecycleBinBlocks: Array<LayoutBuilder.RecycleBinBlock>,
                    public Containers: any) {
                }
            }

            //used in the recycle bin
            export class DeletedTemplateBlockModel {
                public BlockIconClass: string = "";
                public constructor(
                    public Block: LayoutBuilder.Block,
                    public Container: LayoutBuilder.Container
                    ) {
                }
            }

            export class RecycleBinItemViewModel {
                public DraggableBlock: DraggableBlockModel = null;
                public RecycleBinBlock: LayoutBuilder.RecycleBinBlock;
            }

            export class BlockStorageItemViewModel {
                public DraggableBlock: DraggableBlockModel = null;
                public BlockStorageBlock: LayoutBuilder.BlockStorageBlock;
            }
        }               
    }

    export module Utils {
        export class PropertyHelper {
            public static CopyProperties(source: any, target: any): void {
                for (var prop in source) {
                    if (target[prop] !== undefined) {
                        target[prop] = source[prop];
                    }
                    else {
                        console.error("Cannot set undefined property: " + prop);
                    }
                }
            }
        }

        export class MathHelper {
            public static GenerateRandomNumber(min: number, max: number) : number {
                var i = 0;
                do {
                    i = Math.floor((Math.random() * max) + 1);
                } while (i < min && i > max);
                return i;
            }
        }

        export class GuidHelper {
            public static GenerateGuid() : string {
                function s4() : string {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + s4() + s4() +
                        s4() + s4() + s4() + s4();
            }
        }
    }

    export module API {

        //specialised class to get the layout builder preview html and container json
        export class LayoutBuilderPreview {
            public GetPreview(id: number, $http: ng.IHttpService, callback: (preview: Models.LayoutBuilderPreviewModel) => void) {
                WebBlocksAPIClent.GetPagePreviewHtml(id, $http, function (html) {
                    var $previewDOM = $(html);
                    var containersModel = <Array<LayoutBuilder.Container>>JSON.parse($($previewDOM).find("#wbContainerJSON").html());
                    //convert all blocks so that blocks are their respective type
                    LayoutBuilderPreview.typeAllContainerBlocks(containersModel);
                    $($previewDOM).remove("#wbContainerJSON");
                    var webBlocksPreviewHtml = $($previewDOM).find(".wbLayout").html();

                    var layoutBuilderPreviewModel = new Models.LayoutBuilderPreviewModel(webBlocksPreviewHtml, containersModel);
                    callback(layoutBuilderPreviewModel);
                });
            }

            public static typeAllContainerBlocks(containers: any) {
                //loop through all containers and type all blocks
                angular.forEach(containers, function (container: WebBlocks.LayoutBuilder.Container, containerName: string) {
                    container.Blocks = LayoutBuilder.TypedBlockConverter.TypeAll(container.Blocks);
                });
            }
            
        }

        export module Models {
            //The preview html for the web blocks canvas and containers json
            export class LayoutBuilderPreviewModel {
                public constructor(
                    public Html: string,
                    public Containers: Array<WebBlocks.LayoutBuilder.Container>) {
                }
            }

            export class NavigationItem {
                public constructor(
                    public Id: number,
                    public Name: string,
                    public ContentType: string,
                    public IconClass: string,
                    public HasChildren: boolean) {
                }
            } 
        }

        export class WebBlocksAPIClent {
            //gets the full web block preview html for a content page      
            public static GetPagePreviewHtml(id: number, $http: ng.IHttpService, callback: (string) => void) {
                HttpRequest.Get("/umbraco/WebBlocks/WebBlocksApi/GetPagePreview?id=" + id, $http, function (data) {
                    callback(data);
                    //remove preview cookie
                    $http.get('/umbraco/endPreview.aspx');
                });
            }

            public static GetNavigationChildren(id: number, $http: ng.IHttpService, callback: (navigationItems: Array<Models.NavigationItem>) => void) {
                HttpRequest.Get("/umbraco/WebBlocks/WebBlocksApi/GetChildren?id=" + id, $http,(navigationItems: Array<Models.NavigationItem>) => {
                    for (var i = 0; i < navigationItems.length; i++) {
                        navigationItems[i].IconClass = navigationItems[i].IconClass != ".sprTreeFolder" ?
                            navigationItems[i].IconClass :
                            "icon-folder";
                    }
                    callback(navigationItems);
                });
            }
        }

        //$http service wrapper
        export class HttpRequest {
            public static Get(url: string, $http: ng.IHttpService, callback: (any) => void) {
                $http.get(url)
                    .success(function (data, status, headers, config) {
                    callback(data);
                });
            }
        }
    }

}