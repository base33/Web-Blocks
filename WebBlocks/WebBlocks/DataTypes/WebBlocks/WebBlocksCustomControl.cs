using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksCustomControl : PlaceHolder
    {
        protected object InternalValue = null;

        public object value { get { return builder.value; } set { InternalValue = value; } }
        public WebBlocksPrevalueEditor PreValueEditor { get; set; }

        public WebBlocks builder;


        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            builder = (WebBlocks)Page.LoadControl("~/usercontrols/webblocks/webblocks.ascx");
            builder.value = InternalValue;
            builder.PreValueRepository = new WebBlocksPreValueRepository(PreValueEditor.DataTypeDefinitionId);

            Controls.Add(builder);
        }
    }
}