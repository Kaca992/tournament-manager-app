using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.CompetitionPhases
{
    public class PhaseInfoSettings<TMatchIds>
    {
        public T MatchIds { get; set; }
        public List<int> CompetitorIds { get; set; }
        // how the match looks, will be used when JSON parsing from database so we know what to parse back
        public Type MatchInfoType { get; set; }
        // how the phase looks
        public Type CompetitorPhaseInfoType { get; set; }
    }
}
