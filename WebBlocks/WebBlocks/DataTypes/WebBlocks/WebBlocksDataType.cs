using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.cms.businesslogic.datatype;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksDataType : AbstractDataEditor
    {
        private WebBlocksPrevalueEditor webBlocksPrevalueEditor;
        private WebBlocksPreValueRepository webBlocksPrevalueRepository = null;
        private WebBlocksCustomControl webBlocksControl;

        public override Guid Id
        {
            get
            {
                return new Guid("849f2844-33c5-45d6-870c-87aa7e51d55e");
            }
        }

        public WebBlocksDataType()
        {
            webBlocksControl = new WebBlocksCustomControl();
            webBlocksPrevalueEditor = webBlocksPrevalueEditor ?? (webBlocksPrevalueEditor = new WebBlocksPrevalueEditor(this, webBlocksPrevalueRepository));
            RenderControl = webBlocksControl;
            webBlocksControl.Init += WebBlocks_Init;
            DataEditorControl.OnSave += DataEditorControlOnOnSave;
            webBlocksControl.PreValueEditor = webBlocksPrevalueEditor;
        }

        protected void WebBlocks_Init(object sender, EventArgs e)
        {
            webBlocksPrevalueRepository = new WebBlocksPreValueRepository(this.DataTypeDefinitionId);
            webBlocksControl.value = base.Data.Value ?? "";
        }

        private void DataEditorControlOnOnSave(EventArgs eventArgs)
        {
            base.Data.Value = webBlocksControl.value;
        }

        public override string DataTypeName
        {
            get { return "Web Blocks: Builder"; }
        }

        public override umbraco.interfaces.IDataPrevalue PrevalueEditor
        {
            get { return webBlocksPrevalueEditor; }
        }
    }
}