using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using WebBlocks.Controllers;

namespace WebBlocks.SandboxV7.Controllers
{
    public class WebBlockControllerTestController : WebBlockController
    {
        public ActionResult Render()
        {
            BlockElementClasses.Add("heyhey");
            BlockElementType = "hoyhoy";
            BlockElementAttributes.Add("wb-video", "something");
            
            return PartialView("WebBlockControllerTest/WebBlockControllerTest", new TestModel
            {
                Name = CurrentBlock.Name
            });

        }

        public ActionResult HandleSubmit(TestModel model)
        {
            model.Name = model.Name;
            return Redirect(CurrentBlock.Url);
        }
    }

    public class TestModel
    {
        public string Name = "YAYYYYYY";
    }
}