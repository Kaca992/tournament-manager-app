using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases.Group;
using Tournament.Manager.Business.CompetitionImplementations.TableTennis;
using Tournament.Manager.GridUtils;
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

        public void ExportTablesAndSchedules(int competitionId, string fileName)
        {
            // TODO for testing
            // string path = $"{Environment.GetFolderPath(Environment.SpecialFolder.Desktop)}\\Dokumentacija_{DateTime.Now.ToShortTimeString()}.xlsx";       
            //string path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), $"Tablice_{DateTime.Now.ToFileTime()}.xlsx");
            //var workbook = new XLWorkbook();

            //using (var competitorService = new CompetitorService())
            //using (var competitionPhaseService = new CompetitionPhaseService(competitorService.DbContext))
            //{
            //    var categoryId = DbContext.Competitions.Where(x => x.Id == competitionId).Select(x => x.IdCategory).First();
            //    var competitions = DbContext.Competitions.Include("CompetitionPhases").Where(x => x.IdCategory == categoryId).ToList();

            //    foreach (var competition in competitions)
            //    {
            //        var worksheet = workbook.Worksheets.Add(competition.DisplayName.Substring(0, 15));
            //        setColumnWidths(worksheet);
            //        var startRow = 2;

            //        var phase = competitionPhaseService.GetCompetitionPhaseInfos(competition.Id).FirstOrDefault();

            //        if (phase == null)
            //        {
            //            continue;
            //        }

            //        var phaseId = phase.CompetitionPhaseId;
            //        var phaseSettings = phase.Settings as GroupPhaseSettings;
            //        var matchesDb = competitionPhaseService.DbContext.Matches.Where(x => x.IdCompetitionPhase == phaseId).ToList();

            //        var tableTennisTournament = new TableTennisTournament();
            //        var matches = tableTennisTournament.GenerateMatchesViewModel(matchesDb, phaseSettings).OrderBy(x => x.Leg).ThenBy(x => x.MatchId).ToList();
            //        var competitors = tableTennisTournament.GeneratePlayersViewModel(competitorService.GetCompetitorPhaseInfos(phaseId));

            //        int numberOfGroupsOnPage = 0;

            //        foreach(var competitorsByGroup in phaseSettings.CompetitorIds)
            //        {
            //            if (numberOfGroupsOnPage >= 3)
            //            {
            //                numberOfGroupsOnPage = 0;
            //                worksheet.PageSetup.AddHorizontalPageBreak(startRow);
            //                startRow++;
            //            }

            //            generateGroupHeaderRow(worksheet, startRow, competitorsByGroup.Key, competitorsByGroup.Value.Count());
            //            startRow += 2;

            //            startRow = insertGroupTable(worksheet, startRow, matches, competitors, competitorsByGroup);

            //            for(int setCells = 9; setCells < 14; setCells++)
            //            {
            //                addValueToCell(worksheet, $"{setCells - 8}. set", startRow, setCells, null, true);
            //            }

            //            addValueToCell(worksheet, $"rez.", startRow, 14, null, true);
            //            startRow++;

            //            int lastLeg = 1;
            //            foreach (var match in matches.Where(x => x.GroupIndex == competitorsByGroup.Key))
            //            {
            //                if (lastLeg != match.Leg)
            //                {
            //                    lastLeg = match.Leg;
            //                    startRow++;
            //                }

            //                var startCell = 1;
            //                var comp1 = competitors.First(x => x.CompetitorId == match.CompetitorId1).DisplayName;
            //                var comp2 = competitors.First(x => x.CompetitorId == match.CompetitorId2).DisplayName;

            //                addValueToCell(worksheet, comp1, startRow, startCell, alignement: XLAlignmentHorizontalValues.Left);
            //                worksheet.Range(startRow, startCell, startRow, startCell + 2).Merge();
            //                worksheet.Range(startRow, startCell, startRow, startCell + 2).Style.Border.BottomBorder = XLBorderStyleValues.Medium;
            //                startCell += 3;

            //                addValueToCell(worksheet, "vs.", startRow, startCell++);

            //                addValueToCell(worksheet, comp2, startRow, startCell, alignement: XLAlignmentHorizontalValues.Left);
            //                worksheet.Range(startRow, startCell, startRow, startCell + 3).Merge();
            //                worksheet.Range(startRow, startCell, startRow, startCell + 3).Style.Border.BottomBorder = XLBorderStyleValues.Medium;
            //                startCell += 4;

            //                for(int setIndex = 0; setIndex < match.Sets1.Count; setIndex++)
            //                {
            //                    var set1 = match.Sets1[setIndex];
            //                    var set2 = match.Sets2[setIndex];

            //                    if (set1 != null)
            //                    {
            //                        addValueToCell(worksheet, $"'{set1}:{set2}", startRow, startCell);
            //                    }

            //                    worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
            //                    startCell++;
            //                }

            //                addValueToCell(worksheet, $"'{match.Result}", startRow, startCell);
            //                worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Thick;

            //                startRow++;
            //            }

            //            numberOfGroupsOnPage++;
                   
            //            worksheet.Range(startRow, 1, startRow, 14).Merge();
            //            worksheet.Range(startRow, 1, startRow, 14).Style.Border.BottomBorder = XLBorderStyleValues.Medium;
            //            startRow++;
            //        }
            //    }
            //}


            //workbook.SaveAs(path);
        }

        private int insertGroupTable(IXLWorksheet worksheet, int startRow, List<TableTennisTournamentMatchesVM> matches, List<TableTennisTournamentPlayerVM> competitors, KeyValuePair<int, List<int>> competitorsByGroup)
        {
            foreach (var competitorId in competitorsByGroup.Value)
            {
                var comp = competitors.First(x => x.CompetitorId == competitorId);

                var startCell = 1;

                // display name
                addValueToCell(worksheet, comp.DisplayName, startRow, startCell, alignement: XLAlignmentHorizontalValues.Left);
                worksheet.Range(startRow, startCell, startRow, startCell + 3).Merge();
                worksheet.Range(startRow, startCell, startRow, startCell + 3).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                startCell += 4;

                foreach (var compId in competitorsByGroup.Value)
                {
                    if (compId == competitorId)
                    {
                        addValueToCell(worksheet, null, startRow, startCell, XLColor.DarkGray);
                    }
                    else
                    {
                        var matchResult = matches
                            .First(x => x.CompetitorId1 == compId && x.CompetitorId2 == competitorId || x.CompetitorId1 == competitorId && x.CompetitorId2 == compId);
                        var result = matchResult.Result;

                        // need to swtich result
                        if (matchResult.CompetitorId2 == competitorId && matchResult.Result != null)
                        {
                            var switchedResult = matchResult.Result.Split(':').Reverse();
                            result = string.Join(":", switchedResult);
                        };


                        addValueToCell(worksheet, $"'{result}", startRow, startCell);
                    }

                    worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                    startCell++;
                }

                if (competitorsByGroup.Value.Count() < 4)
                {
                    for (int count = competitorsByGroup.Value.Count(); count < 4; count++)
                    {
                        addValueToCell(worksheet, null, startRow, startCell, XLColor.DarkGray);
                        worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                        startCell++;
                    }
                }

                worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                addValueToCell(worksheet, comp.Wins.HasValue ? comp.Wins.Value.ToString() : null, startRow, startCell++);

                worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                addValueToCell(worksheet, $"'{comp.Sets}", startRow, startCell++);

                worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                addValueToCell(worksheet, comp.Placement.HasValue ? comp.Placement.Value.ToString() : null, startRow, startCell++);


                worksheet.Range(startRow, startCell, startRow, startCell + 2).Merge();
                worksheet.Range(startRow, startCell, startRow, startCell + 2).Style.Border.OutsideBorder = XLBorderStyleValues.Thick;

                startRow++;
            }

            return startRow;
        }

        private void generateGroupHeaderRow(IXLWorksheet ws, int row, int groupId, int competitorCount)
        {
            ws.Cell(row, 1).Value = $"Grupa {groupId + 1}.";
            ws.Range(row, 1, row, 9).Merge();
            row++;

            int startCell = 1;


            addValueToCell(ws, "IGRAČ", row, startCell, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            ws.Range(row, startCell, row, startCell + 3).Merge();

            startCell += 4;
            competitorCount = competitorCount > 4 ? competitorCount : 4;

            for (int i = 1; i <= competitorCount; i++)
            {
                addValueToCell(ws, $"{i}.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            }

            addValueToCell(ws, "POB.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            addValueToCell(ws, "SET", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            addValueToCell(ws, "PLAS.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);

            addValueToCell(ws, "Redoslijed", row, startCell, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            ws.Range(row, startCell, row, startCell + 2).Merge();
        }

        private static void setColumnWidths(IXLWorksheet ws)
        {
            ws.Columns().Width = 5.22;
            ws.Column(1).Width = 6.89;
            ws.Column(2).Width = 6.89;
            ws.Column(3).Width = 6.89;
            ws.Column(4).Width = 1.67;
        }

        private void addValueToCell(IXLWorksheet ws, string value, int row, int cell, XLColor color = null, bool isBold = false, XLAlignmentHorizontalValues alignement = XLAlignmentHorizontalValues.Center)
        {
            ws.Cell(row, cell).Value = value;

            if (color != null)
            {
                ws.Cell(row, cell).Style.Fill.BackgroundColor = color;
            }

            ws.Cell(row, cell).Style.Font.Bold = isBold;
            ws.Cell(row, cell).Style.Alignment.Horizontal = alignement;
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

                    var competitors = competitorsService.GetCompetitors(competition.Id).Result;
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

                    var competitors = competitorsService.GetCompetitors(competition.Id).Result;
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
