using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web.Mvc;
using WebBlocks.API;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Controllers
{
    public abstract class WebBlockController : SurfaceController
    {
        internal WebBlocksAPI _webBlocksApi = new WebBlocksAPI();
        internal IPublishedContent _currentBlock = null;

        public bool IsInBuilder
        {
            get
            {
                return WebBlocksUtility.IsInBuilder;
            }
        }

        public IPublishedContent CurrentBlock
        {
            get
            {
                if(_currentBlock == null)
                {
                    if(WebBlocksUtility.CurrentBlockContent == null)
                        WebBlocksUtility.CurrentBlockContent = Umbraco.TypedContent(ControllerContext.RequestContext.RouteData.Values["wbPostBackCurrentBlock"]);
                    _currentBlock = WebBlocksUtility.CurrentBlockContent;
                }
                return WebBlocksUtility.CurrentBlockContent;
            }
        }

        public new IPublishedContent CurrentPage
        {
            get
            {
                return base.CurrentPage ?? WebBlocksUtility.CurrentBlockContent;
            }
        }

        public string BlockElementType
        {
            get
            {
                return _webBlocksApi.BlockElement;
            }
            set
            {
                _webBlocksApi.BlockElement = value;
            }
        }

        public Dictionary<string, string> BlockElementAttributes
        {
            get
            {
                return _webBlocksApi.BlockAttributes;
            }
        }

        public List<string> BlockElementClasses
        {
            get
            {
                return _webBlocksApi.CssClasses;
            }
        }

        public IContainer CurrentContainer
        {
            get
            {
                return _webBlocksApi.CurrentContainer;
            }
        }
    }
}