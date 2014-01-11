using System;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using BAsketWS.DataAccess;

namespace BAsketWS
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Register(GlobalConfiguration.Configuration);

            // Create an inferred delegate that invokes methods for the timer.
            //TimerCallback tcb = Common.CheckPriceStatus;
            //Timer priceTimer = new Timer(tcb, null, 0, 0);
        }

        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml"));

            //var mapping = new AuthenticationOptionMapping
            //{
            //    // where to look for credentials
            //    Options = options,

            //    // how to validate them
            //    TokenHandler = handler,

            //    // which hint to give back if not successful
            //    Scheme = scheme
            //};
            //var configA = new AuthenticationConfiguration
            //{
            //    RequireSsl = true
            //};
            //configA.AddBasicAuthentication(ValidateUser);

            // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            //config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            //config.EnableSystemDiagnosticsTracing();
        }

        //protected override void OnStartProcessingRequest(ProcessRequestArgs args)
        //{
        //    CustomBasicAuth.Authenticate(HttpContext.Current);
        //    if (HttpContext.Current.User == null)
        //        throw new DataServiceException(401, "Invalid login or password");
        //    base.OnStartProcessingRequest(args);
        //}

        public override void Init()
        {
            this.AuthenticateRequest += new EventHandler(WebApiApplication_AuthenticateRequest);
            base.Init();
        }

        void WebApiApplication_AuthenticateRequest(object sender, EventArgs e)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            //var ticket = FormsAuthentication.Decrypt(cookie.Value);

            var principal = CustomBasicAuth.Authenticate(cookie.Value);
            //var principal = new GenericPrincipal(id, null);
            if (principal == null)
            {
                throw new SystemException("user not found");
            }

            HttpContext.Current.User = principal;
        }
    }
}