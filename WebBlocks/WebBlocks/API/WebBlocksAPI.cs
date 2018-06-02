using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.Cache;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.API
{
    public class WebBlocksAPI
    {
        public string BlockElement
        {
            get
            {
                return CacheHelper.Get<string>("wbBlockElement");
            }
            set { CacheHelper.Add("wbBlockElement", value); }
        }

        public Dictionary<string, string> BlockAttributes
        {
            get
            {
                return CacheHelper.Get <Dictionary<string, string>> ("wbBlockAttributes");
            }
            set { CacheHelper.Add("wbBlockAttributes", value); }
        }

        public IBlock Block {
            get
            {
                return CacheHelper.Get<IBlock>("wbBlockAngular");
            }
            set { CacheHelper.Add("wbBlockAngular", value); }
        }

        public IBlock ParentBlock
        {
            get
            {
                return CacheHelper.Get<IBlock>("wbParentBlockAngular");
            }
            set { CacheHelper.Add("wbParentBlockAngular", value); }
        }

        public List<string> CssClasses
        {
            get 
            {
                return CacheHelper.Get<List<string>>("wbCssClasses"); 
            }
            set { CacheHelper.Add("wbCssClasses", value); }
        }

        public IContainer CurrentContainer
        {
            get
            {
                return WebBlocksUtility.CurrentContainer;
            }
        }
    }
}