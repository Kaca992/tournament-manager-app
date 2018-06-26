﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.ScheduleGenerators.Table
{
    public class RoundRobinScheduleGenerator : TableGeneratorBase
    {
        public RoundRobinScheduleGenerator(): base(ScheduleTypeEnum.RoundRobinScheduleEnum)
        {

        }

        protected override List<Match> generateScheduleForEachGroup(List<Competitor> competitors, CompetitionPhase competitionPhase)
        {
            List<Match> matches = new List<Match>();
            // need to add a dummy competitor
            if (competitors.Count % 2 == 1)
            {
                competitors.Add(new Competitor() { Id = Int32.MinValue });
            }

            int numberOfLegs = competitors.Count - 1;

            List<Competitor> roundRobin = new List<Competitor>();
            roundRobin.AddRange(competitors);

            // tomislav swap
            roundRobin = shiftCompetitors(roundRobin);

            for (var leg = 1; leg <= numberOfLegs; leg++)
            {
                var team1 = 0;
                var team2 = competitors.Count - 1;

                while(team1 < team2)
                {
                    var competitor1 = roundRobin[team1];
                    var competitor2 = roundRobin[team2];

                    if (competitor1.Id == Int32.MinValue || competitor2.Id == Int32.MinValue)
                    {
                        team1++;
                        team2--;
                        continue;
                    }

                    matches.Add(new Match()
                    {
                        Competitor = competitor1,
                        Competitor1 = competitor2,
                        CompetitionPhase = competitionPhase,
                        Leg = leg
                    });

                    team1++;
                    team2--;
                }

                roundRobin = shiftCompetitors(roundRobin);
            }

            return matches;
        }

        private List<Competitor> shiftCompetitors(List<Competitor> competitors)
        {
            List<Competitor> shifted = new List<Competitor>();
            shifted.Add(competitors[0]);
            shifted.Add(competitors[competitors.Count - 1]);

            for (var i = 1; i < (competitors.Count - 1);  i++)
            {
                shifted.Add(competitors[i]);
            }

            return shifted;
        }
    }
}
