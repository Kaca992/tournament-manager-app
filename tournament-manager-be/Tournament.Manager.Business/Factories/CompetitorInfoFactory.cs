using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitorInfos;
using Tournament.Manager.Business.CompetitorInfos.Attributes;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.Factories
{
    public class CompetitorInfoFactory
    {
        private static CompetitorInfoFactory _instance;
        public static CompetitorInfoFactory Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new CompetitorInfoFactory();
                }

                return _instance;
            }
        }

        private Dictionary<CompetititorInfoTypeEnum, Type> _competitorInfoTypeLookups = new Dictionary<CompetititorInfoTypeEnum, Type>();

        protected CompetitorInfoFactory()
        {
            registerMatchInfos(typeof(CompetitorInfoBase).Assembly);
        }

        private void registerMatchInfos(Assembly assembly)
        {
            foreach (Type matchInfoType in assembly.GetTypes().Where(x => typeof(CompetitorInfoBase).IsAssignableFrom(x) && !x.IsAbstract))
            {
                var attribute = (CompetitorInfoAttribute)matchInfoType.GetCustomAttribute(typeof(CompetitorInfoAttribute), false);
                _competitorInfoTypeLookups[attribute.CompetitorInfoType] = matchInfoType;
            }
        }

        public CompetitorInfoBase GetCompetitorInfoType(CompetititorInfoTypeEnum competitorInfoType)
        {
            if (_competitorInfoTypeLookups == null || !_competitorInfoTypeLookups.ContainsKey(competitorInfoType))
            {
                throw new Exception("Competitor info not registered");
            }

            return (CompetitorInfoBase)Activator.CreateInstance(_competitorInfoTypeLookups[competitorInfoType], new object[] { competitorInfoType });
        }

        public T GetCompetitorInfoType<T>(CompetititorInfoTypeEnum competitorInfoType) where T: CompetitorInfoBase
        {
            if (_competitorInfoTypeLookups == null || !_competitorInfoTypeLookups.ContainsKey(competitorInfoType))
            {
                throw new Exception("Competitor info not registered");
            }

            return (T)Activator.CreateInstance(_competitorInfoTypeLookups[competitorInfoType], new object[] { competitorInfoType });
        }
    }
}
