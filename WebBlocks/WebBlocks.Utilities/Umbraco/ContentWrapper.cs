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
    public class ContentWrapper : DynamicObject, IPublishedContent
    {
        protected IContent content;
        protected User user = null;
        protected ContentWrapper parent = null;

        public ContentWrapper(IContent content)
        {
            this.content = content;
            this._properties = content.Properties.Select(
                p =>
                    new ContentPropertyWrapper(p, content.PropertyTypes.FirstOrDefault(pt => pt.Alias == p.Alias),
                        ContentType))
                .ToDictionary(c => c.Alias, c => (IPublishedProperty) c, StringComparer.OrdinalIgnoreCase);
        }

        public IEnumerable<IPublishedContent> Children
        {
            get
            {
                List<IPublishedContent> children = new List<IPublishedContent>();
                foreach (Content c in content.Children())
                    children.Add(new ContentWrapper(c));
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
                if (parent == null)
                    parent = new ContentWrapper(content.Parent());
                return parent;
            }
        }

        public string Path
        {
            get { return content.Path; }
        }

        public ICollection<IPublishedProperty> Properties
        {
            get
            {
                return _properties.Values;
            }
        }

        protected Dictionary<string, IPublishedProperty> _properties;

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
            get { return PublishedContentType.Get(PublishedItemType.Content, content.ContentType.Alias); }
        }

        public int GetIndex()
        {
            return content.Id;
        }

       

        public bool IsDraft
        {
            get { return true; }
        }



        public IPublishedProperty GetProperty(string alias)
        {
            IPublishedProperty property;

            return _properties.TryGetValue(alias, out property) ? property : null;
        }

        public IPublishedProperty GetProperty(string alias, bool recurse)
        {
            var value = GetProperty(alias);
            if (!recurse)
                return value;

            if (Parent != null && Level > -1 && value == null)
                return Parent.GetProperty(alias, true);
           
            return value;
        }
    }
}