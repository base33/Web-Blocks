using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Models;

namespace WebBlocks.Interfaces
{
    public interface IContainerRenderer
    {
        void Render(IContainer container, HtmlHelper<RenderModel> html);
    }
}