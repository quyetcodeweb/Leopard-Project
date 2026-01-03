import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

// Xuất file Excel
export const exportToExcel = (data, fileName) => {
    const excelData = data.map(c => ({
        "Mã KH": `KH${c.CustomerID}`,
        "Họ và Tên": c.FullName,
        "Số điện thoại": c.Phone,
        "Email": c.Email,
        "Địa chỉ": c.Address,
        "Nhãn": c.Label,
        "Trạng thái": c.Status
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachKhachHang");

    const wscols = [{ wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

//Xuất file PDF 
export const exportToPDF = (data, fileName) => {
    const doc = new jsPDF();

    doc.text("DANH SACH KHACH HANG", 14, 15);

    autoTable(doc, {
        startY: 20,
        head: [['ID', 'Ho ten', 'SDT', 'Email', 'Dia chi', 'Label']],
        body: data.map(c => [
            `KH${c.CustomerID}`,
            c.FullName,
            c.Phone,
            c.Email,
            c.Address,
            c.Label
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [40, 167, 69] }
    });

    doc.save(`${fileName}.pdf`);
};