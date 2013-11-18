using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class AllowedBlocks : IContainerPermissions
    {
        protected List<string> blockTypes = new List<string>();

        public List<string> BlockTypes { get { return blockTypes; } set { blockTypes = value; } }

        public AllowedBlocks(params string[] allowedBlocks)
        {
            foreach (string allowedBlock in allowedBlocks)
            {
                BlockTypes.Add(allowedBlock);
            }
        }

        public string[] AsStringArray()
        {
            return blockTypes.ToArray();
        }
    }
}