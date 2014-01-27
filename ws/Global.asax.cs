using System;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;

namespace BAsketWS
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
			Common.SaveLog("*** BAsketWS Start; ver " + VerConst.ProductVer);

            Register(GlobalConfiguration.Configuration);

            // Create an inferred delegate that invokes methods for the timer.
            //TimerCallback tcb = Common.CheckPriceStatus;
            //Timer priceTimer = new Timer(tcb, null, 0, 0);

			//MefConfig.RegisterMef();
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

		private void Application_Error(object sender, EventArgs e)
		{
			var exception = Server.GetLastError();
			Server.ClearError();

			Common.SaveLog("Error: " + exception.Message + exception.StackTrace);
		}

        public override void Init()
        {
            this.AuthenticateRequest += new EventHandler(WebApiApplication_AuthenticateRequest);
            base.Init();
		}

        void WebApiApplication_AuthenticateRequest(object sender, EventArgs e)
        {
	        HttpCookie cookie = HttpContext.Current.Request.Cookies[".BAsketAUTH"];		//[FormsAuthentication.FormsCookieName];
            var ticket = (cookie == null) ? HttpContext.Current.Request.Headers["Authorization"] : cookie.Value;
            if (string.IsNullOrEmpty(ticket))
            {
                Common.SaveLog("*** Authorization ticket not found");
                //throw new SystemException("*** Authorization ticket not found");
                return;
            }
            ticket = Encoding.ASCII.GetString(Convert.FromBase64String(ticket));

            var userInfo = CustomBasicAuth.Authenticate(ticket);
            if (userInfo == null)
            {
                Common.SaveLog("*** User not found for ticket: " + ticket);
                //throw new SystemException("User not found");
                return;
            }
            var principal = new GenericPrincipal(new GenericIdentity(userInfo.Name), userInfo.Roles);

            HttpContext.Current.User = principal;
        }
    }

	/*
	/// <summary>
	/// Resolve dependencies for MVC / Web API using MEF.
	/// </summary>
	public class MefDependencyResolver : System.Web.Http.Dependencies.IDependencyResolver, System.Web.Mvc.IDependencyResolver
	{
		private readonly CompositionContainer _container;

		public MefDependencyResolver(CompositionContainer container)
		{
			_container = container;
		}

		public IDependencyScope BeginScope()
		{
			return this;
		}

		/// <summary>
		/// Called to request a service implementation.
		/// 
		/// Here we call upon MEF to instantiate implementations of dependencies.
		/// </summary>
		/// <param name="serviceType">Type of service requested.</param>
		/// <returns>Service implementation or null.</returns>
		public object GetService(Type serviceType)
		{
			if (serviceType == null)
				throw new ArgumentNullException("serviceType");

			var name = AttributedModelServices.GetContractName(serviceType);
			var export = _container.GetExportedValueOrDefault<object>(name);
			return export;
		}

		/// <summary>
		/// Called to request service implementations.
		/// 
		/// Here we call upon MEF to instantiate implementations of dependencies.
		/// </summary>
		/// <param name="serviceType">Type of service requested.</param>
		/// <returns>Service implementations.</returns>
		public IEnumerable<object> GetServices(Type serviceType)
		{
			if (serviceType == null)
				throw new ArgumentNullException("serviceType");

			var exports = _container.GetExportedValues<object>(AttributedModelServices.GetContractName(serviceType));
			return exports;
		}

		public void Dispose()
		{
		}
	}

	public static class MefConfig
	{
		public static void RegisterMef()
		{
			var appSection = ConfigurationManager.GetSection("appSettings");
			var catalog = new AggregateCatalog();
			catalog.Catalogs.Add(new AssemblyCatalog(Assembly.GetExecutingAssembly()));
			var dc = new DirectoryCatalog(".");
			catalog.Catalogs.Add(dc);
			//catalog.Parts.Except()
			//var catalog = new AssemblyCatalog(Assembly.GetExecutingAssembly());

			var container = new CompositionContainer(catalog);

			var resolver = new MefDependencyResolver(container);
			// Install MEF dependency resolver for MVC
			//DependencyResolver.SetResolver(resolver);
			// Install MEF dependency resolver for Web API
			System.Web.Http.GlobalConfiguration.Configuration.DependencyResolver = resolver;
		}
	}/**/

	/*
				// Settings should have 0 values.
				container.ComposeParts(this);
				//Contract.Assert(this.Settings.Count() == 0);

				CompositionBatch batch = new CompositionBatch();

				// Store the settingsPart for later removal...
				ComposablePart settingsPart =
					batch.AddExportedValue(new Settings { ConnectionString = "Value1" });

				container.Compose(batch);

				// Settings should have "Value1"
				UsesSettings result = container.GetExportedValue<UsesSettings>();
				Contract.Assert(result.TheSettings.ConnectionString == "Value1");

				// Settings should have 1 value which is "Value1";
	//			Contract.Assert(this.Settings.Count() == 1);
		//		Contract.Assert(this.Settings.First().ConnectionString == "Value1");

				// Remove the old settings and replace it with a new one.
				batch = new CompositionBatch();
				batch.RemovePart(settingsPart);
				batch.AddExportedValue(new Settings { ConnectionString = "Value2" });
				container.Compose(batch);
	public class Settings
	{
		public string ConnectionString = "default value";
	}/**/
}