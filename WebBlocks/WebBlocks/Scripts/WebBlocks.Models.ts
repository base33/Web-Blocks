module WebBlocks {

    // Class
    export class Container {
        public Name: string;
        public Blocks: Array<Block>;

        public AddBlock(block: Block): void {
            if (!CollectionHelper.Exists(this.Blocks, a => { return a.Id == block.Id }))
                this.Blocks.push(block);
            else if (confirm("This block has already been added.  Are you sure you wish to add the block again?"))
                this.Blocks.push(block);
        }

        public AlertTypes(): void {
            for (var i = 0; i < this.Blocks.length; i++) {
                alert(this.Blocks[i].__type);
            }
        }

        // Constructor
        constructor()
        {
            this.Blocks = new Array<Block>();
        }
    }

    export class Block {
        public Id: number;
        public SortOrder: number;
        public IsTemplateBlock: boolean;
        public IsDeleted: boolean;
        public __type: string;

        public constructor() {
            this.Id = 0;
            this.SortOrder = 1;
            this.IsTemplateBlock = false;
            this.__type = "";
            this.IsDeleted = false;
        }
    }

    export class NodeBlock extends Block {
        constructor() {
            super();
            this.__type = "NodeBlock";
        }
    }

    export class WysiwygBlock extends Block {
        public Content: string;

        constructor() {
            super();
            this.__type = "WysiwygBlock";
        }
    }

    export class ContainerPermissionsResult {
        public Valid: boolean = false;
        public Type: string = "";
        public DocTypes: string[] = [];
    }

    export class CollectionHelper {
        public static Remove<T>(array: Array<T>, obj: T): Array<T> {
            var temp: T[] = new Array<T>();
            for (var i = 0; i < this.length; i++) {
                if (this[i] != obj)
                    temp.push(this[i]);
            }
            return temp;
        }

        public static Exists<T>(array: Array<T>, method: (a: T) => boolean): boolean {
            for (var i = 0; i < this.length; i++) {
                if (method(this[i]))
                    return true;
            }
            return false;
        }
    }

}

