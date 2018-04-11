using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.CompetitionPhases.Group;
using Tournament.Manager.Business.TableGeneration;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class ExportService : BaseService
    {
        public ExportService() : base()
        {

        }

        public ExportService(Entities dbContext) : base(dbContext)
        {

        }

        public void Export(int competitionId, int phaseId, string fileName)
        {
            var workbook = new XLWorkbook();
            exportAllCompetitors(workbook, competitionId);
            exportCompetitorsByGroup(workbook, competitionId, phaseId);

            workbook.SaveAs(fileName);
        }

        private IXLWorksheet exportAllCompetitors(XLWorkbook workBook, int competitionId)
        {
            var worksheet = workBook.Worksheets.Add("Popis Igrača");
            using (var competitorsService = new CompetitorService())
            {
                var competitors = competitorsService.GetCompetitors(competitionId);
                var dataTable = ColumnDefinitionFactory.GenerateDataTable(competitors);
                worksheet.Cell(2, 2).InsertTable(dataTable.AsEnumerable());
            }

            worksheet.Columns().AdjustToContents();
            return worksheet;
        }

        private IXLWorksheet exportCompetitorsByGroup(XLWorkbook workBook, int competitionId, int phaseId)
        {
            var worksheet = workBook.Worksheets.Add("Raspored Igrača");
            if (phaseId == -1)
            {
                return worksheet;
            }

            using (var competitorsService = new CompetitorService())
            using (var competitionPhaseService = new CompetitionPhaseService(competitorsService.DbContext))
            {
                var competitors = competitorsService.GetCompetitors(competitionId);
                var competitionPhaseSettings = competitionPhaseService.GetCompetitionPhaseInfoSettings(phaseId) as GroupPhaseSettings;

                var rows = new List<string[]> ();
                foreach (var groupedCompetitors in competitionPhaseSettings.CompetitorIds)
                {
                    var groupRow = new List<string>();
                    groupRow.Add($"Grupa    {groupedCompetitors.Key + 1}");
                    foreach (var competitorId in groupedCompetitors.Value)
                    {
                        var competitor = competitors.First(x => x.Id == competitorId);
                        groupRow.Add($"{competitor.Ranking}  {competitor.Name}       {competitor.Team}");
                    }

                    rows.Add(groupRow.ToArray());
                }

                worksheet.Cell(2, 2).InsertData(rows);
            }

            worksheet.Columns().AdjustToContents();
            return worksheet;
        }
    }
}
