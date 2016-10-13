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
        string Name { get; set; }
        int SortOrder { get; set; }
        bool IsTemplateBlock { get; set; }
        string TemplateContainer { get; set; }
        bool IsDeletedBlock { get; set; }
        string __type { get; set; }
        IBlockViewModel ViewModel { get; set; }
    }
}
