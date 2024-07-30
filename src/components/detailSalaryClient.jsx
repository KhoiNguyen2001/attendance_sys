import React, { useEffect, useState } from 'react';
import { apiGetAllDetailSalaryClient } from './common/api';
import { toDateTime, toDate } from './common/convert_time';
import Swal from 'sweetalert2';
import { TbRefresh } from "react-icons/tb";
import * as XLSX from 'xlsx';
import { RiFileExcel2Line } from "react-icons/ri";


const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
};

const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount * 1);
};

const DetailSalaryClient = () => {
    const [detailSalaryData, setDetailSalaryData] = useState([]);

    // Hool lọc dữ liệu từ Mongo
    useEffect(() => {
        getDetailSalary();
    }, []);


    // Hàm đọc tất cả các dữ liệu chi tiết của bảng lương sau khi submit
    async function getDetailSalary() {
        let _info = localStorage.getItem("infoUser");
        if (_info) {
            _info = JSON.parse(_info);
            let res = await apiGetAllDetailSalaryClient(_info.name);
            if (res) {
                if (Array.isArray(res.data)) {
                    setDetailSalaryData(res.data);
                }
            }
        }
    }


   /* const exportToExcel = () => {
        // Tính tổng lương thực lĩnh
        const totalNetSalary = detailSalaryData.reduce((sum, item) => sum + item.net_salary, 0);

        // Chuyển đổi dữ liệu chi tiết lương thành dạng sheet
        const wsData = detailSalaryData.map(detail => ({
            "ID": detail.id_device,
            "From Date": new Date(detail.fromDate).toISOString(),
            "To Date": new Date(detail.toDate).toISOString(),
            "Section": detail.section,
            "Name": detail.name,
            "Position": detail.position,
            "Bonus": detail.bonus,
            "Penalty": detail.penalty,
            "Advance": detail.advance,
            "Basic Salary": detail.basic_sal,
            "Ability Salary": detail.ability_sal,
            "Performance Salary": detail.perform_sal,
            "Lunch": detail.lunch,
            "Transport": detail.transport,
            "Phone": detail.phone,
            "Social Insurance": detail.social_insu,
            "Health Insurance": detail.health_insu,
            "Unemployment Insurance": detail.unemploy_insu,
            "Net Salary": detail.net_salary
        }));

        // Thêm dòng tổng lương thực lĩnh vào cuối sheet
        wsData.push({
            "ID": "Total:", // Dòng này sẽ hiển thị chữ "Total:" 
            "From Date": '',
            "To Date": '',
            "Section": '',
            "Name": '',
            "Position": '',
            "Bonus": '',
            "Penalty": '',
            "Advance": '',
            "Basic Salary": '',
            "Ability Salary": '',
            "Performance Salary": '',
            "Lunch": '',
            "Transport": '',
            "Phone": '',
            "Social Insurance": '',
            "Health Insurance": '',
            "Unemployment Insurance": '',
            "Net Salary": formatMoney(totalNetSalary)
        });
        // Chuyển đổi dữ liệu thành sheet Excel
        const ws = XLSX.utils.json_to_sheet(wsData);
        // Merge các ô từ cột "ID" tới "Unemployment Insurance" cho dòng tổng
        const totalRowIndex = wsData.length; // Chỉ số hàng của dòng "Total:"
        ws['!merges'] = [
            { s: { r: totalRowIndex, c: 0 }, e: { r: totalRowIndex, c: 16 } }
        ];
        // Định dạng cho dòng "Total:"
        ws["A" + (totalRowIndex + 1)] = { v: "Total:", s: { font: { bold: true }, alignment: { horizontal: 'center' } } };
        // Ghi workbook thành file Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'All Detail Salary');
        XLSX.writeFile(wb, 'AllDetailSalary.xlsx');
    };*/

    return (
        <div>
            <h2>All Detail Salaries</h2>
            <div className='mb-2'>
                <button className='btn btn-success me-2' onClick={getDetailSalary}> <TbRefresh /> Refresh</button>
                {/*<button className='btn btn-warning' onClick={exportToExcel}><RiFileExcel2Line /> Export to Excel</button> {/* Add export button */}
            </div>
            <div style={{width: '100%', overflow: 'auto'}} className='d-flex'>
                {detailSalaryData.length > 0 ? (
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Section</th>
                                <th>Position</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Basic Salary</th>
                                <th>Hệ số lương theo năng lực</th>
                                <th>Level</th>
                                <th>PerFormance Salary</th>
                                <th>Lunch</th>
                                <th>Phone Bill</th>
                                <th>Transport</th>
                                <th>Work Days</th>
                                <th>Total Income</th>
                                <th>Tax</th>
                                <th>Health Insurance</th>
                                <th>Social Insurance</th>
                                <th>Unemployment Insurance</th>
                                <th>Bonus</th>
                                <th>Penalty</th>
                                <th>Advance</th>
                                <th>Net Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailSalaryData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id_device}</td>
                                    <td>{item.name}</td>
                                    <td>{item.section}</td>
                                    <td>{item.position}</td>
                                    <td>{toDate(item.fromDate)}</td>
                                    <td>{toDate(item.toDate)}</td>
                                    <td>{formatMoney(item.basic_sal)}</td>
                                    <td>{item.ability_sal}</td>
                                    <td>{item.level}</td>
                                    <td>{item.perform_sal}</td>
                                    <td>{formatMoney(item.lunch)}</td>
                                    <td>{formatMoney(item.phone_bill)}</td>
                                    <td>{formatMoney(item.transport)}</td>
                                    <td>{(item.actualWorkingDays)}</td>
                                    <td>{formatMoney(item.totalIncome)}</td>
                                    <td>{formatPercentage(item.income_tax)}</td>
                                    <td>{formatPercentage(item.health_insu)}</td>
                                    <td>{formatPercentage(item.social_insu)}</td>
                                    <td>{formatPercentage(item.unemploy_insu)}</td>
                                    <td>{formatMoney(item.bonus)}</td>
                                    <td>{formatMoney(item.penalty)}</td>
                                    <td>{formatMoney(item.advance)}</td>
                                    <td>{formatMoney(item.net_salary)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="22" style={{ textAlign: 'center', fontWeight: 'bold' }}>Total Net Salary</td>
                                <td style={{ fontWeight: 'bold' }}>{formatMoney(detailSalaryData.reduce((sum, item) => sum + item.net_salary, 0))}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>No detail salary data available.</p>
                )}
            </div>
        </div>
    );
};

export default DetailSalaryClient;
