using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class ExcludedBlocks : IContainerPermissions
    {
        protected List<string> blockTypes = new List<string>();


        public List<string> BlockTypes
        {
            get { return blockTypes; }
            set { blockTypes = value; }
        }

        public ExcludedBlocks(params string[] excludedBlocks)
        {
            foreach (string excludedBlock in excludedBlocks)
            {
                BlockTypes.Add(excludedBlock);
            }
        }

        public string[] AsStringArray()
        {
            return blockTypes.ToArray();
        }
    }
}