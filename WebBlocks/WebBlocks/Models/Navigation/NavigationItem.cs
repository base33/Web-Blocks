using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Navigation
{
    public class NavigationItem
    {
        public int Id { get; set; }
        public string Guid { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
        public string IconClass { get; set; }
        public bool HasChildren { get; set; }
    }
}