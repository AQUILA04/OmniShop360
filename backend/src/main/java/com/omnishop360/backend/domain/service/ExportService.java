package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.repository.SaleRepository;
import com.omnishop360.backend.domain.repository.specification.SaleSpecification;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.ExportFormat;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {

    private static final int EXPORT_MAX_SIZE = 10_000;
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final SaleRepository saleRepository;
    private final UserContextService userContextService;

    @Transactional(readOnly = true)
    public byte[] exportSalesReport(
            Optional<UUID> shopIdParam,
            LocalDate fromDate,
            LocalDate toDate,
            ExportFormat format) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = resolveShopId(shopIdParam);
        LocalDate from = fromDate != null ? fromDate : LocalDate.now().minusMonths(1);
        LocalDate to = toDate != null ? toDate : LocalDate.now();

        SaleSearchDto dto = SaleSearchDto.builder()
                .shopId(shopId)
                .fromDate(from)
                .toDate(to)
                .build();
        Specification<Sale> spec = SaleSpecification.from(dto)
                .and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId));
        List<Sale> sales = saleRepository.findAll(spec, PageRequest.of(0, EXPORT_MAX_SIZE)).getContent();

        return format == ExportFormat.PDF
                ? buildPdf(sales, from, to)
                : buildExcel(sales, from, to);
    }

    private UUID resolveShopId(Optional<UUID> shopIdParam) {
        if (SecurityUtils.hasRole("shop_admin")) {
            return userContextService.getCurrentUserShopId()
                    .orElseThrow(() -> new IllegalArgumentException("Shop Admin must be associated with a shop"));
        }
        return shopIdParam.orElse(null);
    }

    private byte[] buildPdf(List<Sale> sales, LocalDate from, LocalDate to) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Rapport des ventes", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
            document.add(new Paragraph("Période: " + from.format(DATE_FORMAT) + " - " + to.format(DATE_FORMAT)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 2f, 2f, 2f, 2f});
            table.addCell(cell("N° Vente", true));
            table.addCell(cell("Date", true));
            table.addCell(cell("Boutique", true));
            table.addCell(cell("Montant TTC", true));
            table.addCell(cell("Statut", true));

            BigDecimal total = BigDecimal.ZERO;
            for (Sale s : sales) {
                table.addCell(cell(s.getSaleNumber(), false));
                table.addCell(cell(s.getSaleDate().format(DATETIME_FORMAT), false));
                table.addCell(cell(s.getShop().getName(), false));
                table.addCell(cell(s.getTotalAmount().toString(), false));
                table.addCell(cell(s.getStatus().name(), false));
                total = total.add(s.getTotalAmount());
            }
            document.add(table);
            document.add(new Paragraph("Total: " + total.toString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new IllegalStateException("PDF generation failed", e);
        }
    }

    private PdfPCell cell(String text, boolean header) {
        return new PdfPCell(new Phrase(text, header ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10) : FontFactory.getFont(FontFactory.HELVETICA, 10)));
    }

    private byte[] buildExcel(List<Sale> sales, LocalDate from, LocalDate to) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Ventes");
            CellStyle headerStyle = wb.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = wb.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            int rowNum = 0;
            Row titleRow = sheet.createRow(rowNum++);
            titleRow.createCell(0).setCellValue("Rapport des ventes - Période: " + from.format(DATE_FORMAT) + " - " + to.format(DATE_FORMAT));
            rowNum++;

            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"N° Vente", "Date", "Boutique", "Montant TTC", "Statut"};
            for (int i = 0; i < headers.length; i++) {
                Cell c = headerRow.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
            }

            for (Sale s : sales) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(s.getSaleNumber());
                row.createCell(1).setCellValue(s.getSaleDate().format(DATETIME_FORMAT));
                row.createCell(2).setCellValue(s.getShop().getName());
                row.createCell(3).setCellValue(s.getTotalAmount().doubleValue());
                row.createCell(4).setCellValue(s.getStatus().name());
            }

            Row totalRow = sheet.createRow(rowNum);
            BigDecimal total = sales.stream().map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            totalRow.createCell(2).setCellValue("Total");
            totalRow.createCell(3).setCellValue(total.doubleValue());
            totalRow.getCell(2).setCellStyle(headerStyle);

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Excel generation failed", e);
        }
    }
}
