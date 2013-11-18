using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using umbraco.cms.businesslogic.macro;
using umbraco.MacroEngines;
using umbraco.NodeFactory;
using WebBlocks.BusinessLogic.Interfaces;

namespace WebBlocks.Views.RenderingEngines
{
    public class RazorMacroRenderingEngine : IRenderingEngine
    {
        protected MacroModel macro = null;
        protected Node currentNode = null;
        public MacroModel Macro
        {
            get { return macro; }
            set { macro = value; }
        }
        public Node CurrentNode
        {
            get { return currentNode; }
            set { currentNode = value; }
        }

        public string Render(HtmlHelper html)
        {
            RazorMacroEngine macroEngine = new RazorMacroEngine();

            return macroEngine.Execute(Macro, CurrentNode);
        }
    }
}