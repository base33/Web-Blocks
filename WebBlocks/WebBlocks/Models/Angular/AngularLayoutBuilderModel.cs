using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularLayoutBuilderModel
    {
        public Dictionary<string, AngularContainer> Containers { get; set; }
        public List<AngularRecycleBinBlock> RecycleBin { get; set; }
        public List<AngularBlockStorageBlock> BlockStorage { get; set; }

        public AngularLayoutBuilderModel()
        {
            Containers = new Dictionary<string, AngularContainer>();
            RecycleBin = new List<AngularRecycleBinBlock>();
            BlockStorage = new List<AngularBlockStorageBlock>();
        }
    }
}