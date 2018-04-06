using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.ScheduleGenerators.Table;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.ScheduleGenerators
{
    public class ScheduleGeneratorFactory
    {
        private static ScheduleGeneratorFactory _instance;
        public static ScheduleGeneratorFactory Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ScheduleGeneratorFactory();
                }

                return _instance;
            }
        }

        protected ScheduleGeneratorFactory()
        {

        }

        public IScheduleGenerator GetScheduleGenerator(ScheduleTypeEnum scheduleTypeEnum)
        {
            switch(scheduleTypeEnum)
            {
                case ScheduleTypeEnum.RoundRobinScheduleEnum:
                    return new RoundRobinScheduleGenerator();
                default:
                    throw new Exception("No schedule generator of this type");
            }
        }
    }
}
