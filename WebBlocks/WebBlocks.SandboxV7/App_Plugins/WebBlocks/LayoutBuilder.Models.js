var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WebBlocks;
(function (WebBlocks) {
    var LayoutBuilder = (function () {
        function LayoutBuilder() {
            this.Containers = new Array();
            this.RecycleBin = new Array();
            this.BlockStorage = new Array();
        }
        return LayoutBuilder;
    })();
    WebBlocks.LayoutBuilder = LayoutBuilder;

    var Container = (function () {
        function Container() {
        }
        return Container;
    })();
    WebBlocks.Container = Container;

    var Block = (function () {
        function Block() {
        }
        return Block;
    })();
    WebBlocks.Block = Block;

    var NodeBlock = (function (_super) {
        __extends(NodeBlock, _super);
        function NodeBlock() {
            _super.call(this);
            this.__type = "NodeBlock";
        }
        return NodeBlock;
    })(Block);
    WebBlocks.NodeBlock = NodeBlock;

    var WysiwygBlock = (function (_super) {
        __extends(WysiwygBlock, _super);
        function WysiwygBlock() {
            _super.call(this);
            this.__type = "WysiwygBlock";
        }
        return WysiwygBlock;
    })(Block);
    WebBlocks.WysiwygBlock = WysiwygBlock;

    var BlockViewModel = (function () {
        function BlockViewModel() {
        }
        return BlockViewModel;
    })();
    WebBlocks.BlockViewModel = BlockViewModel;

    var BlockViewElementAttribute = (function () {
        function BlockViewElementAttribute() {
        }
        return BlockViewElementAttribute;
    })();
    WebBlocks.BlockViewElementAttribute = BlockViewElementAttribute;
})(WebBlocks || (WebBlocks = {}));
