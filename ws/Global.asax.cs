﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.ComponentModel.Composition.Primitives;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dependencies;
using BAsketWS.DataAccess;
using BAsketWS.Helpers;

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
			var c = new Common();
	        c.TimerConfig();

			MefConfig.RegisterMef();
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
	public static class MefConfig
	{
		//[ImportMany(typeof(IBAsketPlugin), AllowRecomposition = true)]
		//public IEnumerable<Lazy<IBAsketPlugin, IBAsketPluginMetadata>> //Senders { get; set; }
		//	_loadedIPlugins = new List<Lazy<IBAsketPlugin, IBAsketPluginMetadata>>();  

		//[ImportMany("StringTransformer")]
		//public IEnumerable<StringTransformer> Transformers
		//{ get; set; }

		//public IBAsketPlugin GetMessageSender(string name, string version)
		//{
		//	return _loadedIPlugins
		//	  .Where(l => l.Metadata.Name.Equals(name))// && l.Metadata.Version.Equals(version))
		//	  .Select(l => l.Value)
		//	  .FirstOrDefault();
		//}
		public static void RegisterMef()
		{
			var pluginName = ConfigurationManager.AppSettings["UsePlugin"];
			if (string.IsNullOrEmpty(pluginName))
				return;
			var catalog = new AggregateCatalog();
			var path = Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().CodeBase).LocalPath);
			catalog.Catalogs.Add(new DirectoryCatalog(path));

			//			var a = catalog.Parts.Where(m => m.Metadata["Name"].ToString() == pluginName);

			var filteredCat = new FilteredCatalog(catalog,
				def => !def.Metadata.ContainsKey("Name") || def.Metadata["Name"].ToString() == pluginName);
			//var container = new CompositionContainer(filteredCat, parent);
			//var controller = container.GetExportedObject<HomeController>();
			//container.Dispose();
			//catalog.Dispose();

			var container = new CompositionContainer(catalog);
			//var container = new CompositionContainer(filteredCat);

			//BAsketWS.PlugContainer = container;
			//container.SatisfyImportsOnce(this);

			//ControllerBuilder.Current.SetControllerFactory(new MefControllerFactory(container));

			var resolver = new MefDependencyResolver(container);
			// Install MEF dependency resolver for MVC
			//DependencyResolver.SetResolver(resolver);
			// Install MEF dependency resolver for Web API
			System.Web.Http.GlobalConfiguration.Configuration.DependencyResolver = resolver;
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

	public class FilteredCatalog : ComposablePartCatalog, INotifyComposablePartCatalogChanged
	{
		private readonly ComposablePartCatalog _inner;
		private readonly INotifyComposablePartCatalogChanged _innerNotifyChange;
		private readonly IQueryable<ComposablePartDefinition> _partsQuery;

		public FilteredCatalog(ComposablePartCatalog inner,
							   Expression<Func<ComposablePartDefinition, bool>> expression)
		{
			_inner = inner;
			_innerNotifyChange = inner as INotifyComposablePartCatalogChanged;
			_partsQuery = inner.Parts.Where(expression);
		}

		public override IQueryable<ComposablePartDefinition> Parts
		{
			get
			{
				return _partsQuery;
			}
		}

		public event EventHandler<ComposablePartCatalogChangeEventArgs> Changed
		{
			add
			{
				if (_innerNotifyChange != null)
					_innerNotifyChange.Changed += value;
			}
			remove
			{
				if (_innerNotifyChange != null)
					_innerNotifyChange.Changed -= value;
			}
		}

		public event EventHandler<ComposablePartCatalogChangeEventArgs> Changing
		{
			add
			{
				if (_innerNotifyChange != null)
					_innerNotifyChange.Changing += value;
			}
			remove
			{
				if (_innerNotifyChange != null)
					_innerNotifyChange.Changing -= value;
			}
		}
	}
	/**/
}