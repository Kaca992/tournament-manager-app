using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.Attributes;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos;
using Tournament.Manager.Business.CompetitionImplementations;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.Factories
{
    public class CompetitionFactory
    {
        private static CompetitionFactory _instance;
        public static CompetitionFactory Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new CompetitionFactory();
                }

                return _instance;
            }
        }

        private readonly Dictionary<CompetitionTypeEnum, Type> _competitionTypes = new Dictionary<CompetitionTypeEnum, Type>();

        protected CompetitionFactory()
        {
            registerCompetitionTypes(typeof(ICompetition).Assembly);
        }

        private void registerCompetitionTypes(Assembly assembly)
        {
            foreach (Type competitionType in assembly.GetTypes().Where(x => typeof(ICompetition).IsAssignableFrom(x) && !x.IsAbstract))
            {
                var attribute = (CompetitionAttribute)competitionType.GetCustomAttribute(typeof(CompetitionAttribute), false);
                _competitionTypes[attribute.CompetitionType] = competitionType;
            }
        }

        public ICompetition GetCompetition(CompetitionTypeEnum competitionType)
        {
            if (_competitionTypes == null || !_competitionTypes.ContainsKey(competitionType))
            {
                throw new Exception("Competitor info not registered");
            }

            //return (ICompetition)Activator.CreateInstance(_competitorInfoTypeLookups[competitorInfoType], new object[] { competitorInfoType });
            return (ICompetition)Activator.CreateInstance(_competitionTypes[competitionType]);
        }

        public T GetCompetition<T>(CompetitionTypeEnum competitionType) where T : ICompetition
        {
            if (_competitionTypes == null || !_competitionTypes.ContainsKey(competitionType))
            {
                throw new Exception("Competitor info not registered");
            }

            return (T)Activator.CreateInstance(_competitionTypes[competitionType]);
        }
    }
}
