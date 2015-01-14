using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;

namespace WebBlocks.SandboxV6.SurfaceControllers
{
    public class ContactFormSurfaceController : SurfaceController
    {
        /// <summary>
        /// Renders the Contact Form
        /// @Html.Action("RenderContactForm","ContactFormSurface");
        /// </summary>
        /// <returns></returns>
        [ActionName("RenderContactForm")]
        public ActionResult RenderContactForm()
        {
            return PartialView("ContactForm_SurfaceController", new ContactFormModel());
        }

        [HttpPost]
        [ActionName("HandleContactForm")]
        public ActionResult HandleContactForm(ContactFormModel model)
        {
            if (!ModelState.IsValid)
            {
                //Not valid - so lets return the user back to the view with the data they entered still prepopulated
                return CurrentUmbracoPage();
            }

            //send email

            TempData["IsSuccessful"] = true;

            //All done - lets redirect to the current page & show our thanks/success message
            return RedirectToCurrentUmbracoPage();
        }
    }

    public class ContactFormModel
    {
        [Required]
        public string Name;
        [Required]
        public string Email;
        [Required]
        public string Message;
    }
}