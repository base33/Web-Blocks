using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class AngularBlockViewModel
    {
        public string Tag = "";
        public List<AngularElementAttribute> Attributes = new List<AngularElementAttribute>();    //any attributes to render
        public string Classes = "";                                 //any classes to render
        public string Html = "";                                    //inner html
        public bool ShouldRerender = false; 
    }
}