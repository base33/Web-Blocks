using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.SandboxV7
{
    public class MemberRoleProvider : Umbraco.Web.Security.Providers.MembersRoleProvider
    {
        public override string[] GetRolesForUser(string username)
        {
            MembershipProvider provider = new MembershipProvider();
            var member = provider.GetUser(username, false);
            var roles = base.GetRolesForUser(member.UserName);
            return roles;
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            MembershipProvider provider = new MembershipProvider();
            var member = provider.GetUser(username, false);

            return base.IsUserInRole(member.UserName, roleName);
        }
    }
}