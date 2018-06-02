using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class Builder
    {
        public List<IBlock> Blocks { get; set; } = new List<IBlock>();
        protected IBlock CurrentBlock { get; set; }

        protected Builder()
        {

        }

        public static Builder Create()
        {
            return new Builder();
        }

        public Builder ElementBlock(string @class)
        {
            CurrentBlock = new ElementBlock()
            {
                Class = @class
            };
            Blocks.Add(CurrentBlock);
            return this;
        }

        public Builder WithChildren(Builder b)
        {
            (CurrentBlock as ElementBlock).Children.AddRange(b.Blocks);
            return this;
        }

        public Builder ContentBlock(int nodeId)
        {
            Blocks.Add(new ContentBlock(nodeId));
            return this;
        }

        public Builder WysiwygBlock(int id)
        {
            Blocks.Add(new WysiwygBlock(id));
            return this;
        }

        public List<IBlock> ToList()
        {
            return Blocks;
        }
    }
}