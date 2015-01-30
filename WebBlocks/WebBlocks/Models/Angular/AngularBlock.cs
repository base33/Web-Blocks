using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularBlock : IBlock
    {
        public string __type { get; set; }
        public int Id { get; set; }                                   //the id of the wysiwyg or block
        public string Name { get; set; }                                 //the name of the block (normally shown in recycle bin or block storage)
        public int SortOrder { get; set; }                               //the sort order
        public bool IsTemplateBlock { get; set; }                       //whether the block is one from the template
        public string TemplateContainer { get; set; }                   //if this is a template block, where was it originally
        public bool IsDeletedBlock { get; set; }                        //whether the block has been deleted
        public IBlockViewModel ViewModel { get; set; }

        public AngularBlock()
        {
            __type = "unknown";
            Id = 0;
            Name = "";
            SortOrder = 0;
            IsTemplateBlock = false;
            TemplateContainer = "";
            IsDeletedBlock = false;
            ViewModel = new AngularBlockViewModel();
        }
    }
}