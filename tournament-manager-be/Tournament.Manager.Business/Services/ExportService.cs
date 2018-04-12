﻿using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionImplementationsREAL;
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

        public void ExportTablesAndSchedules(int competitionId, string fileName)
        {
            // TODO for testing
            // string path = $"{Environment.GetFolderPath(Environment.SpecialFolder.Desktop)}\\Dokumentacija_{DateTime.Now.ToShortTimeString()}.xlsx";       
            string path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), $"Tablice_{DateTime.Now.ToFileTime()}.xlsx");
            var workbook = new XLWorkbook();

            using (var competitorService = new CompetitorService())
            using (var competitionPhaseService = new CompetitionPhaseService(competitorService.DbContext))
            {
                var categoryId = DbContext.Competitions.Where(x => x.Id == competitionId).Select(x => x.IdCategory).First();
                var competitions = DbContext.Competitions.Include("CompetitionPhases").Where(x => x.IdCategory == categoryId).ToList();

                foreach (var competition in competitions)
                {
                    var worksheet = workbook.Worksheets.Add(competition.DisplayName.Substring(0, 15));
                    var startRow = 2;

                    var phase = competitionPhaseService.GetCompetitionPhaseInfos(competition.Id).FirstOrDefault();

                    if (phase == null)
                    {
                        continue;
                    }

                    var phaseId = phase.CompetitionPhaseId;
                    var phaseSettings = phase.Settings as GroupPhaseSettings;
                    var matchesDb = competitionPhaseService.DbContext.Matches.Where(x => x.IdCompetitionPhase == phaseId).ToList();

                    var tableTennisTournament = new TableTennisTournament();
                    var matches = tableTennisTournament.GenerateMatchesViewModel(matchesDb, phaseSettings);
                    var competitors = tableTennisTournament.GeneratePlayersViewModel(competitorService.GetCompetitorPhaseInfos(phaseId));

                    foreach(var competitorsByGroup in phaseSettings.CompetitorIds)
                    {
                        generateGroupHeaderRow(worksheet, startRow, competitorsByGroup.Key, competitorsByGroup.Value.Count());
                        startRow += 2;

                        foreach(var competitorId in competitorsByGroup.Value)
                        {
                            var comp = competitors.First(x => x.CompetitorId == competitorId);

                            var startCell = 1;

                            // display name
                            addValueToCell(worksheet, comp.DisplayName, startRow, startCell);
                            worksheet.Range(startRow, startCell, startRow, startCell + 3).Merge();
                            worksheet.Range(startRow, startCell, startRow, startCell + 3).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                            startCell += 4;

                            foreach(var compId in competitorsByGroup.Value)
                            {
                                if (compId == competitorId)
                                {
                                    addValueToCell(worksheet, null, startRow, startCell, XLColor.DarkGray);
                                }

                                worksheet.Cell(startRow, startCell).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                                startCell++;
                            }

                            if (competitorsByGroup.Value.Count() < 4)
                            {
                                for(int count = competitorsByGroup.Value.Count(); count < 4; count++)
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

                        // add line sepparator
                        startRow++;
                    }
                }
            }


            // Prepare the style for the titles
            var titlesStyle = workbook.Style;
            titlesStyle.Font.Bold = true;
            titlesStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            titlesStyle.Fill.BackgroundColor = XLColor.Yellow;

            // Format all titles in one shot
            // workbook.NamedRanges.NamedRange("Titles").Ranges.Style = titlesStyle;

            workbook.SaveAs(path);
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

            for(int i = 1; i <= competitorCount; i++)
            {
                addValueToCell(ws, $"{i}.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            }

            addValueToCell(ws, "POB.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            addValueToCell(ws, "SET", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            addValueToCell(ws, "PLAS.", row, startCell++, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);

            addValueToCell(ws, "Redoslijed", row, startCell, XLColor.LightGray, true, XLAlignmentHorizontalValues.Center);
            ws.Range(row, startCell, row, startCell + 2).Merge();
        }

        private void addValueToCell(IXLWorksheet ws, string value, int row, int cell, XLColor color = null, bool isBold = false, XLAlignmentHorizontalValues alignement = XLAlignmentHorizontalValues.Left)
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
