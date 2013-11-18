using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBlocks.Interfaces
{
    public interface IBlock
    {
        int Id { get; set; }
        string Class { get; set; }
        Dictionary<string, string> Attributes { get; set; }
        bool IsTemplateBlock { get; set; }
        bool IsDeleted { get; set; }
        int SortOrder { get; set; }
        string __type { get; set; }
    }
}
