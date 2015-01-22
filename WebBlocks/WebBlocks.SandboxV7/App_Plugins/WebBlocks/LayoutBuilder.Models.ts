module WebBlocks 
{
    export class LayoutBuilder
    {
        public Containers: Array<Container>;                   //array of containers that are on the page
        public RecycleBin: Array<Block>;                       //array of blocks added to the recycle bin
        public BlockStorage: Array<Block>;                     //array of blocks added to the block storage

        public constructor() {
            this.Containers = new Array<Container>();
            this.RecycleBin = new Array<Block>();
            this.BlockStorage = new Array<Block>();
        }
    }

    export class Container {
        public WysiwygClass: string;                            //the class to set on any wysiwyg in the container
        public Blocks: Array<Block>;
    }

    export class Block {
        public Id: number;                                      //the id of the wysiwyg or block
        public Name: string;                                    //the name of the block (normally shown in recycle bin or block storage)
        public SortOrder: number;                               //the sort order
        public IsTemplateBlock: boolean;                        //whether the block is one from the template
        public IsDeletedBlock: boolean;                         //whether the block has been deleted
        public ViewModel: BlockViewModel;
        public __type: string;
    }

    export class NodeBlock extends Block {
        public constructor()
        {
            super();
            this.__type = "NodeBlock"
        }
    }

    export class WysiwygBlock extends Block {
        public Content: string;                                 //the content of the wysiwyg

        public constructor() {
            super();
            this.__type = "WysiwygBlock"
        }
    }

    export class BlockViewModel {
        public Tag: string;
        public Attributes: Array<BlockViewElementAttribute>;    //any attributes to render
        public Classes: string;                                 //any classes to render
        public ShouldRerender: boolean;                         //flag to rerender the view (used by the wbBlock directive)
    }

    export class BlockViewElementAttribute {
        public Name: string;                                    //name of the attribute
        public Value: string;                                   //value of the attribute
    }
}