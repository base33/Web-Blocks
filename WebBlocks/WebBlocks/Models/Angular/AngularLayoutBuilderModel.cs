using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularLayoutBuilderModel
    {
        public Dictionary<string, Container> Containers { get; set; }
        public Dictionary<string, object> Editors { get; set; }
        public List<AngularRecycleBinBlock> RecycleBin { get; set; }
        public List<AngularBlockStorageBlock> BlockStorage { get; set; }

        public AngularLayoutBuilderModel()
        {
            Containers = new Dictionary<string, Container>();
            RecycleBin = new List<AngularRecycleBinBlock>();
            BlockStorage = new List<AngularBlockStorageBlock>();
            Editors = new Dictionary<string, object>();
        }
    }
}