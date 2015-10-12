using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;

namespace WebBlocks.SandboxV7.Controllers
{
    public class WebBlockControllerTestController : SurfaceController
    {
        public ActionResult Render()
        {
            return PartialView("WebBlockControllerTest/WebBlockControllerTest", new TestModel());
        }
    }

    public class TestModel
    {
        public string Name = "YAYYYYYY";
    }
}