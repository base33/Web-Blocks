using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Examine;
using WebBlocks.Model;
using WebBlocks.Providers;
using umbraco.BusinessLogic;
using umbraco.NodeFactory;

namespace WebBlocks.Examine
{
    public class Indexer : ApplicationBase
    {
        public Indexer()
        {
            foreach (var indexerSite in ExamineManager.Instance.IndexProviderCollection.ToList())
            {
                indexerSite.GatheringNodeData += SetBuilderWysiwygField;
            }
        }

        /// <summary>
        /// Indexes all wysiwyg blocks in the page containers
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void SetBuilderWysiwygField(object sender, IndexingNodeDataEventArgs e)
        {
            //get the current node id
            int nodeId;

            if (!int.TryParse(e.Fields["id"], out nodeId)) return;

            string wysiwyg = "";

            var containerProvider = new ContainerProvider(nodeId);

            foreach (Container container in containerProvider.Containers)
            {
                string containerContent = String.Join(" ",
                                                      container.Blocks.Where(b => b is WysiwygBlock)
                                                               .Cast<WysiwygBlock>()
                                                               .Select(b => b.Content));

                e.Fields.Add("WBContainer_" + container.Name, containerContent);
                wysiwyg += " " + containerContent;
            }
            e.Fields.Add("WBWysiwyg", wysiwyg);
        }
    }
}