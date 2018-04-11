using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
    }
}
