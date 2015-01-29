using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class AngularLayoutBuilderModel
    {
        public Dictionary<string, AngularContainer> Containers { get; set; }
        public List<AngularBlock> RecycleBin { get; set; }
        public List<AngularBlock> BlockStorage { get; set; }

        public AngularLayoutBuilderModel()
        {
            Containers = new Dictionary<string, AngularContainer>();
            RecycleBin = new List<AngularBlock>();
            BlockStorage = new List<AngularBlock>();
        }
    }
}