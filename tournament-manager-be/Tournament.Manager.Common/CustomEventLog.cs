using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Common
{
    public static class CustomEventLog
    {
        private static string sourceName = "TournamentManager";
        public static void RegisterCustomEventLog()
        {
            if (!EventLog.SourceExists(sourceName))
            {
                EventLog.CreateEventSource(sourceName, "TournamentManager Logs");
                Console.WriteLine("CreatedEventSource");
                Console.WriteLine("Exiting, execute the application a second time to use the source.");
            }
        }

        public static void WriteEntry(string text)
        {
            WriteEntry(text, EventLogEntryType.Error);
        }

        public static void WriteEntry(Exception e)
        {
            WriteEntry(e.Message, EventLogEntryType.Error);
            if (e.InnerException != null)
            {
                WriteEntry(e.InnerException);
            }
        }

        public static void WriteEntry(string text, EventLogEntryType type)
        {
            using (var eventLog = new EventLog())
            {
                eventLog.Source = sourceName;
                eventLog.WriteEntry(text, type);
            }
        }

    }
}
