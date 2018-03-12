using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Application.Configuration;
using Tournament.Manager.Common;
using Tournament.Manager.DataCommon;

namespace Tournament.Manager.Application
{
    class Program
    {
        static void Main(string[] args)
        {
            string baseAddress = "http://localhost:9000/";

            CustomEventLog.RegisterCustomEventLog();
            var startupSetup = new StartupSetup();
            var databaseEnsured = startupSetup.EnsureStorage();

            if (databaseEnsured)
            {
                Console.WriteLine("Database Ensured");
            }

            // Start OWIN host 
            using (WebApp.Start<Startup>(url: baseAddress))
            {
                // Create HttpCient and make a request to api/values 
                HttpClient client = new HttpClient();
                Console.ReadLine();
            }
        }
    }
}
