import React, { useEffect, useState, useRef } from 'react';
import { apiAddDetailSalary, apiAddTotalSalary, apiGetPerformanceSalaryOptions, apiUpdatePerformanceSalaryOptions, apiCalcSalaryDetail, apiGetAllDetailSalary } from './common/api';
import { toDateTime, toDate } from './common/convert_time';
import Swal from 'sweetalert2';
import { TbRefresh } from "react-icons/tb";
import * as XLSX from 'xlsx';
import { RiFileExcel2Line } from "react-icons/ri";
import e from 'cors';
import { IoArrowBackCircleOutline } from "react-icons/io5";
const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
};

const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount * 1);
};

const DetailSalary = ({ data, onBack }) => {

    const [dataFilter, setDataFilter] = useState([]);
    const [optionValues, setOptionValues] = useState({ id: "1", A: 0, B: 0, C: 0, D: 0, E: 0 });
    const [perFormSal, setPerFormSal] = useState({});
    const [bonusValues, setBonusValues] = useState({});
    const [penaltyValues, setPenaltyValues] = useState({});
    const [advanceValues, setAdvanceValues] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectNetSalary, setSelectNetSalary] = useState(false);
    const [detailSalaryData, setDetailSalaryData] = useState([]);

    let totalNetSalary = 0;


    // Hool lọc dữ liệu từ Mongo
    useEffect(() => {
        getDataFilter();
        getDetailSalary();
    }, []);

    // Học lấy dữ liệu từ API
    async function getDataFilter() {
        const filter = {
            from: `${toDate(data.fromDate)} 00:00:00`,
            to: `${toDate(data.toDate)} 23:59:59`,
            section: data.section
        }
        let res = await apiCalcSalaryDetail(filter);
        if (res) {
            if (Array.isArray(res.data)) {
                setDataFilter(res.data);
            }
        }
    }

    // Hàm đọc tất cả các dữ liệu chi tiết của bảng lương sau khi submit
    async function getDetailSalary() {
        let res = await apiGetAllDetailSalary(data._id);
        if (res) {
            if (Array.isArray(res.data)) {
                setDetailSalaryData(res.data);
            }
        }
    }

    // Hook đọc dữ liệu các Performance Salary Options
    useEffect(() => {
        GetPerformanceSalaryOptions();
    }, [])

    // Hàm đọc dữ liệu các Performance Salary Options
    async function GetPerformanceSalaryOptions() {
        let res = await apiGetPerformanceSalaryOptions();
        if (res) {
            if (res.data[0]) {
                setOptionValues(res.data[0]);
            }
        }
    }

    // Hàm tính toán tổng thu nhập
    const calculateTotalIncome = (user, actualWorkingDays) => {
        if (actualWorkingDays === 0) return 0;
        const basicSal = parseFloat(user.info.userDetail.basic_sal);
        const abilitySal = parseFloat(user.info.userDetail.ability_sal);
        const perFormVal = perFormSal[user.info.userDetail.id_device] || 0; // Lấy giá trị thưởng từ perFormSal
        const lunch = parseFloat(user.info.userDetail.lunch);
        const transport = parseFloat(user.info.userDetail.transport);
        const phoneBill = parseFloat(user.info.userDetail.phone_bill);
        const totalIncome = ((basicSal + basicSal * abilitySal + basicSal * perFormVal + lunch + transport + phoneBill) / Number.parseInt(user.info.userDetail.stdWorkDay)) * actualWorkingDays;

        // Round total income as requested
        const totalIncomeRounded = Math.round(totalIncome * 2) / 2;

        return totalIncomeRounded;
    };

    // Hàm tính toán lương thực nhận
    const calculateNetSalary = (totalIncome, user) => {
        const incomeTax = parseFloat(user.info.userDetail.income_tax);
        const socialInsurance = parseFloat(user.info.userDetail.social_insu);
        const healthInsurance = parseFloat(user.info.userDetail.health_insu);
        const unemploymentInsurance = parseFloat(user.info.userDetail.unemploy_insu);
        const bonus = bonusValues[user.info.userDetail.id_device] || 0;
        const penalty = penaltyValues[user.info.userDetail.id_device] || 0;
        const advance = advanceValues[user.info.userDetail.id_device] || 0;

        let netSalary = totalIncome - ((incomeTax / 100) * totalIncome) - ((socialInsurance / 100) * totalIncome) - ((healthInsurance / 100) * totalIncome) - ((unemploymentInsurance / 100) * totalIncome) + bonus - penalty - advance;

        // Làm tròn lương thực lĩnh
        const netSalaryRounded = Math.round(netSalary * 2) / 2;

        return netSalaryRounded;
    };

    // Xử lý khi chọn dòng của bảng
    const handleRowSelect = (id) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(id)
                ? prevSelectedUsers.filter(userId => userId !== id)
                : [...prevSelectedUsers, id]
        );
    };

    // Xử lý khi tick tổng lương thực lĩnh
    const handleSelectNetSalary = () => {
        setSelectNetSalary(!selectNetSalary);
    };

    // Xử lý khi chọn tất cả các dòng
    const handleSelectAll = () => {
        if (!selectAll) {
            // Select all users
            setSelectedUsers(dataFilter.map(user => user.info.userDetail.id_device));
        } else {
            // Deselect all users
            setSelectedUsers([]);
        }
        setSelectAll(!selectAll);
    };

    // Xử lý khi nhấn nút Submit
    const handleSubmit = async () => {
        try {
            if (selectNetSalary) {
                if (totalNetSalary === 0) {
                    console.log('Total Net Salary is not calculated');
                    Swal.fire({
                        icon: 'error',
                        title: 'Fail!',
                        text: 'Total Net Salary is not calculated'
                    });
                    return;
                }
                const salaryData = {
                    fromDate: new Date(data.fromDate).toISOString(),
                    toDate: new Date(data.toDate).toISOString(),
                    section: data.section,
                    totalNetSalary: totalNetSalary,
                };
                console.log('Sending total net salary:', salaryData);
                try {
                    let res = await apiAddTotalSalary(salaryData);
                    console.log(res)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Total Net Salary added successfully'
                    });

                } catch (error) {
                    console.error('Error adding total net salary:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Fail!',
                        text: 'Failed to add total net salary'
                    });
                }
                return;
            }

            if (selectedUsers.length === 0) {
                console.log('No user selected');
                Swal.fire({
                    icon: 'error',
                    title: 'Fail!',
                    text: 'No user selected'
                });
                return;
            }
            // Lọc người dùng đã chọn từ danh sách người dùng đã lọc
            const users = dataFilter.filter(user =>
                selectedUsers.includes(user.info.userDetail.id_device)
            );
            if (users.length === 0) {
                console.error('Selected users not found in filtered users');
                return;
            }
            // Gửi dữ liệu chi tiết lương cho từng người dùng đã chọn
            for (const user of users) {
                const actualWorkingDays = user.totalWorkDays;
                const totalIncome = calculateTotalIncome(user, actualWorkingDays) || 0;
                const netSalary = calculateNetSalary(totalIncome, user) || 0;
                const perFormVal = perFormSal[user.info.userDetail.id_device] || 0;
                const bonus = bonusValues[user.info.userDetail.id_device] || 0;
                const penaltyValue = penaltyValues[user.info.userDetail.id_device] || 0;
                const advanceValue = advanceValues[user.info.userDetail.id_device] || 0;

                const salaryData = {
                    id_salary: data._id,
                    id_device: user.info.userDetail.id_device,
                    fromDate: new Date(data.fromDate).toISOString(),
                    toDate: new Date(data.toDate).toISOString(),
                    name: user.info.userDetail.name,
                    section: user.info.userDetail.section,
                    position: user.info.userDetail.position,
                    basic_sal: parseFloat(user.info.userDetail.basic_sal),
                    ability_sal: parseFloat(user.info.userDetail.ability_sal),
                    level: optionValues[user.info.userDetail.id_device] || '',
                    perform_sal: parseFloat(perFormVal),
                    lunch: parseFloat(user.info.userDetail.lunch),
                    transport: parseFloat(user.info.userDetail.transport),
                    phone_bill: parseFloat(user.info.userDetail.phone_bill),
                    social_insu: parseFloat(user.info.userDetail.social_insu),
                    health_insu: parseFloat(user.info.userDetail.health_insu),
                    unemploy_insu: parseFloat(user.info.userDetail.unemploy_insu),
                    actualWorkingDays: actualWorkingDays,
                    totalIncome: totalIncome,
                    income_tax: user.info.userDetail.income_tax,
                    penalty: penaltyValue,
                    advance: advanceValue,
                    bonus: bonus,
                    net_salary: netSalary,
                };

                try {
                    let res = await apiAddDetailSalary(salaryData);
                    if (res) {
                        if (res.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'Salary data added successfully'
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Fail!',
                                text: 'Failed to add salary data'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail!',
                            text: 'Failed to add salary data'
                        });
                    }

                } catch (error) {
                    console.error('Error adding salary data:', error);

                    Swal.fire({
                        icon: 'error',
                        title: 'Fail!',
                        text: 'Failed to add salary data'
                    });
                }
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An unexpected error occurred'
            });
        }
    };

    const handleInputChange = (option, value) => {
        // Chỉ cho phép nhập số thực với dấu chấm thập phân
        // Kiểm tra nếu giá trị là số thực hợp lệ trước khi cập nhật state
        if (/^\d*\.?\d*$/.test(value)) {
            setOptionValues(prevState => ({
                ...prevState,
                [option]: value,
            }));
        }
    };

    const handlePerformanceSalChange = (userId, value) => {
        setOptionValues(prevValues => ({
            ...prevValues,
            [userId]: value
        }));

        const user = dataFilter.find(user => user.info.userDetail.id_device === userId);
        if (!user) {
            console.error('User not found');
            return;
        }

        const perFormSal = optionValues[value] || 0;
        setPerFormSal(prevValues => ({
            ...prevValues,
            [userId]: String(perFormSal)
        }));
    };

    const handleBonusChange = (userId, value) => {
        setBonusValues(prevValues => ({
            ...prevValues,
            [userId]: parseFloat(value) || 0
        }));
    };

    const handlePenaltyChange = (userId, value) => {
        setPenaltyValues(prevValues => ({
            ...prevValues,
            [userId]: parseFloat(value) || 0
        }));
    };

    const handleAdvanceChange = (userId, value) => {
        setAdvanceValues(prevValues => ({
            ...prevValues,
            [userId]: parseFloat(value) || 0
        }));
    };

    const exportToExcel = () => {
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
    };

    async function handleUpdatePerformanceSalary() {
        const { _id, ...data } = optionValues;
        const res = await apiUpdatePerformanceSalaryOptions(data);
        if (res) {
            if (res.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Update successfully'
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail!',
                    text: 'Failed to update Performance Salary Options'
                });
            }
        }
    }

    return (
        <div>
            <button className="btn btn-secondary" onClick={onBack}>
            <IoArrowBackCircleOutline className="icon-large" /> 
            </button>
            <div className='d-flex justify-content-between'>
                <div>
                    <h1>Detail Salary</h1>
                    <p>Tên bảng doanh số: {data.name}</p>
                    <p>Section: {data.section}</p>
                    <p>Ngày bắt đầu: {toDate(data.fromDate)}</p>
                    <p>Ngày kết thúc: {toDate(data.toDate)}</p>
                </div>
                <div>
                    <h3>Set Performance Salary Options</h3>
                    <div className='d-flex'>
                        <div className='me-3'>
                            {['A', 'B', 'C', 'D', 'E'].map(option => (
                                <div key={option} style={{ marginBottom: '10px' }}>
                                    <label className='me-3'>{`Option ${option}`}</label>
                                    <input
                                        type="text"
                                        value={optionValues[option]}
                                        onChange={(e) => handleInputChange(option, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={handleUpdatePerformanceSalary}>
                                Update
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {data ? (
                <div>
                    <button className="btn btn-info  mb-2" onClick={handleSubmit}>
                        Submit
                    </button>
                    <div style={{ display: 'flex', width: '100%', overflow: 'auto' }}>
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Vị Trí</th>
                                    <th>Lương cơ bản</th>
                                    <th>Hệ số lương năng lực</th>
                                    <th>Bậc</th>
                                    <th>Hệ số lương theo hiệu suất</th>
                                    <th>Phụ cấp ăn trưa</th>
                                    <th>Đi Lại</th>
                                    <th>Điện Thoại</th>
                                    <th>Số ngày công thực</th>
                                    <th>Tổng thu nhập</th>
                                    <th>Thuế thu nhập</th>
                                    <th>Bảo hiểm xã hội</th>
                                    <th>Bảo hiểm y tế</th>
                                    <th>Bảo hiểm thất nghiệp</th>
                                    <th>Thưởng</th>
                                    <th>Phạt</th>
                                    <th>Tạm ứng</th>
                                    <th>Lương thực lĩnh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFilter.map((user, index) => {
                                    const totalIncome = calculateTotalIncome(user, user.totalWorkDays);
                                    const netSalary = calculateNetSalary(totalIncome, user);
                                    totalNetSalary = totalNetSalary + netSalary;
                                    const info = user.info.userDetail;

                                    return (
                                        <tr key={index} className={selectedUsers.includes(info.id_device) ? 'table-row-highlight' : ''} onClick={() => handleRowSelect(info.id_device)}>
                                            <td>
                                                <input type="checkbox" checked={selectedUsers.includes(info.id_device)} onChange={() => handleRowSelect(!info.id_device)} />
                                            </td>
                                            <td>{info.id_device}</td>
                                            <td>{info.name}</td>
                                            <td>{info.position}</td>
                                            <td>{formatMoney(info.basic_sal)}</td>
                                            <td>{info.ability_sal}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <select value={optionValues[info.id_device] || ''} onChange={(e) => handlePerformanceSalChange(info.id_device, e.target.value)}>
                                                    <option>--Select--</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
                                                    <option value="E">E</option>
                                                </select>
                                            </td>
                                            <td>{perFormSal[info.id_device] || 0}</td>
                                            <td>{formatMoney(info.lunch)}</td>
                                            <td>{formatMoney(info.transport)}</td>
                                            <td>{formatMoney(info.phone_bill)}</td>
                                            <td>{user.totalWorkDays}</td>
                                            <td>{formatMoney(totalIncome)}</td> {/*Tổng thu nhập*/}
                                            <td>{formatPercentage(info.income_tax)}</td>
                                            <td>{formatPercentage(info.social_insu)}</td>
                                            <td>{formatPercentage(info.health_insu)}</td>
                                            <td>{formatPercentage(info.unemploy_insu)}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    value={bonusValues[info.id_device] || ''}
                                                    onChange={(e) => handleBonusChange(info.id_device, e.target.value)}
                                                />
                                                <div> Converted: {formatMoney(parseFloat(bonusValues[info.id_device]) || 0)} </div>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    value={penaltyValues[info.id_device] || ''}
                                                    onChange={(e) => handlePenaltyChange(info.id_device, e.target.value)}
                                                />
                                                <div> Converted: {formatMoney(parseFloat(penaltyValues[info.id_device]) || 0)} </div>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    value={advanceValues[info.id_device] || ''}
                                                    onChange={(e) => handleAdvanceChange(info.id_device, e.target.value)}
                                                />
                                                <div> Converted: {formatMoney(advanceValues[info.id_device] || 0)}</div>
                                            </td>
                                            <td>{formatMoney(netSalary)}</td>
                                        </tr>
                                    );
                                })}

                                <tr onClick={handleSelectNetSalary} style={{ cursor: 'pointer' }}>
                                    <td colSpan="20" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        <input
                                            className='me-1'
                                            type="checkbox"
                                            checked={selectNetSalary}
                                            onChange={() => setSelectNetSalary(!selectNetSalary)} />
                                        Tổng lương thực lĩnh
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>{formatMoney(totalNetSalary)}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2 className='mt-5'>All Detail Salaries</h2>
                        <div className='mb-2'>
                            <button className='btn btn-success me-2' onClick={getDetailSalary}> <TbRefresh /> Refresh</button>
                            <button className='btn btn-warning' onClick={exportToExcel}><RiFileExcel2Line /> Export to Excel</button> {/* Add export button */}
                        </div>
                        <div style={{ display: 'flex', whiteSpace: '100%', overflow: 'auto' }}>

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
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default DetailSalary;
