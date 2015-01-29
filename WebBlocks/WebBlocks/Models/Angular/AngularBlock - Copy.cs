using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class AngularBlock
    {
        public int Id = 0;                                      //the id of the wysiwyg or block
        public string Name  = "";                                    //the name of the block (normally shown in recycle bin or block storage)
        public int SortOrder = 0;                               //the sort order
        public bool IsTemplateBlock = false;                        //whether the block is one from the template
        public bool IsDeletedBlock = false;                         //whether the block has been deleted
        public AngularBlockViewModel ViewModel = new AngularBlockViewModel();
        public string __type = "Unknown";
        public string Content = ""; //TODO: create angular node block and angular wysiwyg block


        public static AngularBlock CreateWysiwygBlock()
        {
            return new AngularBlock() { __type = "WysiwygBlock" };
        }

        public static AngularBlock CreateNodeBlock()
        {
            return new AngularBlock() { __type = "NodeBlock" };
        }
    }
}