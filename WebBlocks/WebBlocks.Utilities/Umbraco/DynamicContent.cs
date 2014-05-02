using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using umbraco.BusinessLogic;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace WebBlocks.Utilities.Umbraco
{
    public class DynamicContent : DynamicObject, IPublishedContent
    {
        protected IContent content;
        protected User user = null;
        protected DynamicContent parent = null;

        /// <summary>
        /// Create a new dynamic instance of Content
        /// </summary>
        /// <param name="id"></param>
        public DynamicContent(int id)
        {
            content = UmbracoContext.Current.Application.Services.ContentService.GetById(id);
        }

        public DynamicContent(IContent content)
        {
            this.content = content;
        }

        public IEnumerable<IPublishedContent> Children
        {
            get 
            {
                List<IPublishedContent> children = new List<IPublishedContent>();
                foreach(Content c in content.Children())
                    children.Add(new DynamicContent(c));
                return children;
            }
        }

        public DateTime CreateDate
        {
            get { return content.CreateDate; }
        }

        public int CreatorId
        {
            get { return content.CreatorId; }
        }

        public string CreatorName
        {
            get 
            {
                if (user == null)
                    user = new User(content.CreatorId);
                return user != null ? user.Name : ""; 
            }
        }

        public string DocumentTypeAlias
        {
            get { return content.ContentType.Alias; }
        }

        public int DocumentTypeId
        {
            get { return content.ContentType.Id; }
        }

        public IPublishedContentProperty GetProperty(string alias)
        {
            Property property = content.Properties.FirstOrDefault(c => c.Alias == alias);
            return property != null ? new DynamicContentProperty(property) : null;
        }

        public int Id
        {
            get { return content.Id; }
        }

        public PublishedItemType ItemType
        {
            get { return PublishedItemType.Content; }
        }

        public int Level
        {
            get { return content.Level; }
        }

        public string Name
        {
            get { return content.Name; }
        }

        public IPublishedContent Parent
        {
            get 
            { 
                if(parent == null)
                    parent = new DynamicContent(content.Parent());
                return parent;
            }
        }

        public string Path
        {
            get { return content.Path; }
        }

        public ICollection<IPublishedContentProperty> Properties
        {
            get
            {
                return content.Properties.Select(p => new DynamicContentProperty(p)).ToArray();
            }
        }

        public int SortOrder
        {
            get { return content.SortOrder; }
        }

        public int TemplateId
        {
            get { return content.Template.Id; }
        }

        public DateTime UpdateDate
        {
            get { return content.UpdateDate; }
        }

        public string Url
        {
            get { return umbraco.library.NiceUrl(content.Id) ?? ""; }
        }

        public string UrlName
        {
            get { return content.Name.Replace(" ", "-"); }
        }

        public Guid Version
        {
            get { return content.Version; }
        }

        public int WriterId
        {
            get { return content.WriterId; }
        }

        public string WriterName
        {
            get { return content.WriterId.ToString(); }
        }

        public object this[string propertyAlias]
        {
            get { return content.Properties.FirstOrDefault(p => p.Alias == propertyAlias).Value; }
        }

        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            if (!base.TryGetMember(binder, out result))
            {
                Property property = content.Properties.FirstOrDefault(p => p.Alias == binder.Name);
                result = property != null ? property.Value : "";
            }
            return true;
        }


        public IEnumerable<IPublishedContent> ContentSet
        {
            get { return new List<IPublishedContent> { this }; }
        }

        public global::Umbraco.Core.Models.PublishedContent.PublishedContentType ContentType
        {
            get { return PublishedContentType.Get(PublishedItemType.Content, ContentType.Alias); }
        }

        public int GetIndex()
        {
            return content.Id;
        }

        public IPublishedContentProperty GetProperty(string alias, bool recurse)
        {
            var currentContent = content;
            do
            {
                var property = currentContent.Properties.FirstOrDefault(c => c.Alias == alias);

                if(property != null && property.Value != null)
                    return new DynamicContentProperty(property);
                else
                    currentContent = content.Parent();
            } while (currentContent.Level > -1 && recurse);

            return null;
        }

        public bool IsDraft
        {
            get { return true; }
        }
    }
}