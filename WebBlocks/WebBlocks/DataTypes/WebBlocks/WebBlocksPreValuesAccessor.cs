using System.Web;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksPreValuesAccessor
    {
        protected WebBlocksPrevalueEditor preValueEditor = null;

        public WebBlocksPreValuesAccessor(WebBlocksPrevalueEditor preValueEditor)
        {
            this.preValueEditor = preValueEditor;
        }

        public int BlockSourceNodeId
        {
            get
            {
                return preValueEditor.BlockSourceNodeId;
            }
        }

        public string RichTextEditorStylesheet
        {
            get { return preValueEditor.RichTextEditorStylesheet; }
        }

        public string BackEndScriptIncludes
        {
            get { return HttpUtility.UrlDecode(preValueEditor.BackEndScriptInclude); }
        }

        public string ProtectedPageUsername
        {
            get { return preValueEditor.ProtectedPageUsername;  }
        }

        public string ProtectedPagePassword
        {
            get
            {
                return preValueEditor.ProtectedPagePassword;
            }
        }
    }
}