using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Web.Mvc;
using WebBlocks.API;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Controllers
{
    public class WebContainerController : SurfaceController
    {
        internal WebBlocksAPI _webBlocksApi = new WebBlocksAPI();
        internal IEnumerable<IPublishedContent> _currentBlocks = null;

        public bool IsInBuilder
        {
            get
            {
                return WebBlocksUtility.IsInBuilder;
            }
        }

        public IEnumerable<IPublishedContent> CurrentBlocks
        {
            get
            {
                if(_currentBlocks == null)
                {
                    if(WebBlocksUtility.CurrentBlocksContent == null)
                        WebBlocksUtility.CurrentBlocksContent = ControllerContext.RequestContext.RouteData.Values["wbPostBackCurrentBlock"].ToString().Split(',').Select(c => Umbraco.TypedContent(c));
                    _currentBlocks = WebBlocksUtility.CurrentBlocksContent;
                }

                return _currentBlocks;
            }
        }

        public new IPublishedContent CurrentPage
        {
            get
            {
                return base.CurrentPage ?? WebBlocksUtility.CurrentPageContent;
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