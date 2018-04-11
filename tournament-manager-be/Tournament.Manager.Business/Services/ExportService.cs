using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
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
            // TODO for testing
            // string path = $"{Environment.GetFolderPath(Environment.SpecialFolder.Desktop)}\\Dokumentacija_{DateTime.Now.ToShortTimeString()}.xlsx";       
            string path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), $"Dokumentacija_{DateTime.Now.ToFileTime()}.xlsx");

            var workbook = new XLWorkbook();

            exportAllCompetitors(workbook, competitionId);
            exportCompetitorsByGroup(workbook, competitionId);

            // Prepare the style for the titles
            var titlesStyle = workbook.Style;
            titlesStyle.Font.Bold = true;
            titlesStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            titlesStyle.Fill.BackgroundColor = XLColor.Yellow;

            // Format all titles in one shot
            workbook.NamedRanges.NamedRange("Titles").Ranges.Style = titlesStyle;

            workbook.SaveAs(path);
        }

        private IXLWorksheet exportAllCompetitors(XLWorkbook workBook, int competitionId)
        {
            var worksheet = workBook.Worksheets.Add("Popis Igrača");
            using (var competitorsService = new CompetitorService())
            {
                var categoryId = DbContext.Competitions.Where(x => x.Id == competitionId).Select(x => x.IdCategory).First();
                var competitions = DbContext.Competitions.Where(x => x.IdCategory == categoryId).ToList();

                var startRow = 2;

                foreach(var competition in competitions)
                {
                    worksheet.Cell(startRow, 2).Value = competition.DisplayName;
                    worksheet.Range(startRow, 2, startRow, 4).Merge().AddToNamed("Titles");
                    startRow++;

                    var competitors = competitorsService.GetCompetitors(competition.Id);
                    var dataTable = ColumnDefinitionFactory.GenerateDataTable(competitors);


                    worksheet.Cell(startRow, 2).InsertTable(dataTable.AsEnumerable());
                    startRow += dataTable.Rows.Count + 2;
                }
            }

            worksheet.Columns().AdjustToContents();
            return worksheet;
        }

        private IXLWorksheet exportCompetitorsByGroup(XLWorkbook workBook, int competitionId)
        {
            var worksheet = workBook.Worksheets.Add("Raspored Igrača");
            using (var competitorsService = new CompetitorService())
            using (var competitionPhaseService = new CompetitionPhaseService(competitorsService.DbContext))
            {
                var categoryId = DbContext.Competitions.Where(x => x.Id == competitionId).Select(x => x.IdCategory).First();
                var competitions = DbContext.Competitions.Include("CompetitionPhases").Where(x => x.IdCategory == categoryId).ToList();

                var startRow = 2;

                foreach (var competition in competitions)
                {
                    worksheet.Cell(startRow, 2).Value = competition.DisplayName;
                    worksheet.Range(startRow, 2, startRow, 6).Merge().AddToNamed("Titles");
                    startRow++;

                    var competitors = competitorsService.GetCompetitors(competition.Id);
                    var phase = competition.CompetitionPhases.FirstOrDefault();

                    if (phase == null)
                    {
                        startRow += 2;
                        continue;
                    }

                    var competitionPhaseSettings = competitionPhaseService.GetCompetitionPhaseInfoSettings(phase.Id) as GroupPhaseSettings;
                    var rows = new List<string[]>();
                    foreach (var groupedCompetitors in competitionPhaseSettings.CompetitorIds)
                    {
                        var groupRow = new List<string>();
                        groupRow.Add($"Grupa    {groupedCompetitors.Key + 1}");
                        foreach (var competitorId in groupedCompetitors.Value)
                        {
                            var competitor = competitors.First(x => x.Id == competitorId);
                            groupRow.Add($"{competitor.Name}        {competitor.Team} {competitor.Ranking} ");
                        }

                        rows.Add(groupRow.ToArray());
                    }

                    worksheet.Cell(startRow, 2).InsertData(rows);
                    startRow += rows.Count + 2;
                }
            }

            worksheet.Columns().AdjustToContents();
            return worksheet;
        }

        //private IXLWorksheet exportAllCompetitors(XLWorkbook workBook, int competitionId)
        //{
        //    var worksheet = workBook.Worksheets.Add("Popis Igrača");
        //    using (var competitorsService = new CompetitorService())
        //    {
        //        var competitors = competitorsService.GetCompetitors(competitionId);
        //        var dataTable = ColumnDefinitionFactory.GenerateDataTable(competitors);
        //        worksheet.Cell(2, 2).InsertTable(dataTable.AsEnumerable());
        //    }

        //    worksheet.Columns().AdjustToContents();
        //    return worksheet;
        //}

        //private IXLWorksheet exportCompetitorsByGroup(XLWorkbook workBook, int competitionId, int phaseId)
        //{
        //    var worksheet = workBook.Worksheets.Add("Raspored Igrača");
        //    if (phaseId == -1)
        //    {
        //        return worksheet;
        //    }

        //    using (var competitorsService = new CompetitorService())
        //    using (var competitionPhaseService = new CompetitionPhaseService(competitorsService.DbContext))
        //    {
        //        var competitors = competitorsService.GetCompetitors(competitionId);
        //        var competitionPhaseSettings = competitionPhaseService.GetCompetitionPhaseInfoSettings(phaseId) as GroupPhaseSettings;

        //        var rows = new List<string[]> ();
        //        foreach (var groupedCompetitors in competitionPhaseSettings.CompetitorIds)
        //        {
        //            var groupRow = new List<string>();
        //            groupRow.Add($"Grupa    {groupedCompetitors.Key + 1}");
        //            foreach (var competitorId in groupedCompetitors.Value)
        //            {
        //                var competitor = competitors.First(x => x.Id == competitorId);
        //                groupRow.Add($"{competitor.Ranking}  {competitor.Name}       {competitor.Team}");
        //            }

        //            rows.Add(groupRow.ToArray());
        //        }

        //        worksheet.Cell(2, 2).InsertData(rows);
        //    }

        //    worksheet.Columns().AdjustToContents();
        //    return worksheet;
        //}
    }
}
