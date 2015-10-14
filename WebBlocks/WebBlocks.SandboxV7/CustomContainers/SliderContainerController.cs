using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Views;
using WebBlocks.Interfaces;
using WebBlocks.Model;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using System.Web.Mvc.Html;
using WebBlocks.Controllers;

namespace Sandbox.Website.CustomContainers
{
    public class SliderContainerController : WebContainerController
    {
        public ActionResult Render()
        {
            return PartialView("SliderContainerRenderer", CurrentBlocks);
        }
    }
}