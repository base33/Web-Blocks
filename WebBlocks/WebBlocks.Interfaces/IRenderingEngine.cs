using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using umbraco.cms.businesslogic.macro;
using umbraco.NodeFactory;

namespace WebBlocks.BusinessLogic.Interfaces
{
    public interface IRenderingEngine
    {
        MacroModel Macro { get; set; }
        Node CurrentNode { get; set; }

        string Render(HtmlHelper html);
    }
}
