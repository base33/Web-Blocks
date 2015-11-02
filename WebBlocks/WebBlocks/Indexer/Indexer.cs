using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Examine.Providers;
using umbraco.interfaces;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;
using WebBlocks.Interfaces;
using WebBlocks.Models.Angular;
using WebBlocks.Providers;

namespace WebBlocks.Indexer
{
    public static class Indexer
    {
        public static void IndexWebBlocks(BaseIndexProvider indexProvider)
        {
            indexProvider.GatheringNodeData += indexProvider_GatheringNodeData;
        }

        private static void indexProvider_GatheringNodeData(object sender, Examine.IndexingNodeDataEventArgs e)
        {
            try
            {
                if (!e.Fields.ContainsKey("nodeTypeAlias")) return;

                IContent content = ApplicationContext.Current.Services.ContentService.GetById(e.NodeId);
                if (content == null) return;

                Dictionary<string, string> fieldsToAdd = new Dictionary<string, string>();

                foreach (var property in e.Fields)
                {
                    PropertyType propertyType;
                    if ((propertyType = content.PropertyTypes.FirstOrDefault(p => p.Alias == property.Key)) != null &&
                        propertyType.PropertyEditorAlias == "MentorWebBlocks.LayoutBuilder")
                    {
                        var layoutBuilderProvider = new LayoutBuilderProvider(property.Value);

                        string overallIndexData = "";

                        foreach (var container in layoutBuilderProvider.LayoutBuilder.Containers)
                        {
                            overallIndexData += container.Value.Blocks
                                .OfType<WysiwygBlock>()
                                .Aggregate("", (s, block) => s + " " + umbraco.library.StripHtml(block.Content));
                        }

                        if (!string.IsNullOrEmpty(overallIndexData))
                            fieldsToAdd.Add(string.Format("{0}_Wysiwyg", propertyType.Alias), overallIndexData);
                    }
                }

                fieldsToAdd.ForEach(k => e.Fields.Add(k.Key, k.Value));
            }
            catch (Exception)
            {
                int i = 0;
            }
            
        }
    }
}