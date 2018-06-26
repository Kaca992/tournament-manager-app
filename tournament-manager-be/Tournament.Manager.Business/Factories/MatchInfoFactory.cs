using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos.Attributes;
using Tournament.Manager.Business.MatchInfos;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.Factories
{
    public class MatchInfoFactory
    {
        private static MatchInfoFactory _instance;
        public static MatchInfoFactory Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new MatchInfoFactory();
                }

                return _instance;
            }
        }

        private Dictionary<MatchInfoTypeEnum, Type> _matchInfoTypeLookups = new Dictionary<MatchInfoTypeEnum, Type>();

        protected MatchInfoFactory()
        {
            registerMatchInfos(typeof(MatchInfoBase).Assembly);
        }

        private void registerMatchInfos(Assembly assembly)
        {
            foreach(Type matchInfoType in assembly.GetTypes().Where(x => typeof(MatchInfoBase).IsAssignableFrom(x) && !x.IsAbstract))
            {
                var attribute = (MatchInfoAttribute)matchInfoType.GetCustomAttribute(typeof(MatchInfoAttribute), false);
                _matchInfoTypeLookups[attribute.MatchInfoType] = matchInfoType;
            }
        }

        public MatchInfoBase GetMatchInfoType(MatchInfoTypeEnum matchInfoType)
        {
            if (_matchInfoTypeLookups == null || !_matchInfoTypeLookups.ContainsKey(matchInfoType))
            {
                throw new Exception("Match info not registered");
            }

            return (MatchInfoBase)Activator.CreateInstance(_matchInfoTypeLookups[matchInfoType], new object[] { matchInfoType });
        }

        public T GetMatchInfoType<T>(MatchInfoTypeEnum matchInfoType) where T : MatchInfoBase
        {
            if (_matchInfoTypeLookups == null || !_matchInfoTypeLookups.ContainsKey(matchInfoType))
            {
                throw new Exception("Match info not registered");
            }

            return (T)Activator.CreateInstance(_matchInfoTypeLookups[matchInfoType], new object[] { matchInfoType });
        }
    }
}
