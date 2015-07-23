using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebBlocks.SandboxV7.Models
{
	public class LoginViewModel
	{
		[Display(Name="Username")]
		public string Username { get; set; }

		[Display(Name = "Password")]
		public string Password { get; set; }

		public string RedirectUrl { get; set; }
	}
}