using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularBlockViewModel : IBlockViewModel
    {
        public string Tag { get; set; }
        public string Classes { get; set; }                                //any classes to render
        public string Html { get; set; }                                   //inner html
        public bool ShouldRerender { get; set; }
        public List<IBlockElementAttribute> Attributes { get; set; }    //any attributes to render

        public AngularBlockViewModel()
        {
            Tag = "div";
            Classes = "";
            Html = "";
            ShouldRerender = false;
            Attributes = new List<IBlockElementAttribute>();
        }
    }
}