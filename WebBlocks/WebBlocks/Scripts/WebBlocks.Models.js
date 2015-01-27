var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WebBlocks;
(function (WebBlocks) {
    // Class
    var Container = (function () {
        // Constructor
        function Container() {
            this.Blocks = new Array();
        }
        Container.prototype.AddBlock = function (block) {
            if (!CollectionHelper.Exists(this.Blocks, function (a) {
                return a.Id == block.Id;
            }))
                this.Blocks.push(block);
            else if (confirm("This block has already been added.  Are you sure you wish to add the block again?"))
                this.Blocks.push(block);
        };
        Container.prototype.AlertTypes = function () {
            for (var i = 0; i < this.Blocks.length; i++) {
                alert(this.Blocks[i].__type);
            }
        };
        return Container;
    })();
    WebBlocks.Container = Container;
    var Block = (function () {
        function Block() {
            this.Id = 0;
            this.SortOrder = 1;
            this.IsTemplateBlock = false;
            this.__type = "";
            this.IsDeleted = false;
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
    var ContainerPermissionsResult = (function () {
        function ContainerPermissionsResult() {
            this.Valid = false;
            this.Type = "";
            this.DocTypes = [];
        }
        return ContainerPermissionsResult;
    })();
    WebBlocks.ContainerPermissionsResult = ContainerPermissionsResult;
    var CollectionHelper = (function () {
        function CollectionHelper() {
        }
        CollectionHelper.Remove = function (array, obj) {
            var temp = new Array();
            for (var i = 0; i < this.length; i++) {
                if (this[i] != obj)
                    temp.push(this[i]);
            }
            return temp;
        };
        CollectionHelper.Exists = function (array, method) {
            for (var i = 0; i < this.length; i++) {
                if (method(this[i]))
                    return true;
            }
            return false;
        };
        return CollectionHelper;
    })();
    WebBlocks.CollectionHelper = CollectionHelper;
})(WebBlocks || (WebBlocks = {}));
//# sourceMappingURL=WebBlocks.Models.js.map