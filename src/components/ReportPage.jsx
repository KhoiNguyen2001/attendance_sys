import './ReportPage.css';
import { FaSearch } from "react-icons/fa";
import { BsFiletypeXlsx } from "react-icons/bs";
import { apiFilterReportHistory } from './common/api';
import { useState } from 'react';
import { getNameType, getNameActionType } from './common/convert_name';
import { toDateTime, toDate } from './common/convert_time';
import moment from 'moment-timezone';
import * as XLSX from 'xlsx';

const ToolStrip = (props) => {

    const [dateFrom, setDateFrom] = useState(toDate(new Date()));
    const [timeFrom, setTimeFrom] = useState("00:00");
    const [dateTo, setDateTo] = useState(toDate(new Date()));
    const [timeTo, setTimeTo] = useState("23:59");
    const [id, setID] = useState("");
    const [type, setType] = useState(0);
    const [name, setName] = useState("");

    function handleSearchClick() {
        let filter = {
            from: `${dateFrom}T${timeFrom}:00Z`,
            to: `${dateTo}T${timeTo}:59Z`,
            id: id,
            type: type,
            name: name,
        }
        props.onSearchClick(filter);
    }

    return (
        <div className='toolstrip-container'>
            <div className='col col-3'>
                <div className="mb-3">
                    <label className="form-label">
                        From
                    </label>
                    <div className="input-group mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={timeFrom}
                            onChange={(e) => setTimeFrom(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        To
                    </label>
                    <div className="input-group mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={timeTo}
                            onChange={(e) => setTimeTo(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className='col col-3'>
                <div className="mb-3">
                    <label className="form-label">
                        Search by ID
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={id}
                        onChange={(e) => setID(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Search by Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className='col col-3'>
                <div className="mb-3">
                    <label className="form-label">
                        Type
                    </label>
                    <select
                        className="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value={0}>All</option>
                        <option value={1}>Card</option>
                        <option value={2}>FingerPrint</option>
                    </select>
                </div>
                {/* <div className="mb-3">
                    <label className="form-label">
                        Search
                    </label>
                    <button
                        type="button"
                        className="form-control btn btn-primary"
                        onClick={handleSearchClick}>
                        <FaSearch /> Search
                    </button>

                </div> */}
            </div>
            <div className='col col-1'>
            <div className="mb-3">
                    <label className="form-label">
                        Search
                    </label>
                    <button
                        type="button"
                        className="form-control btn btn-primary"
                        onClick={handleSearchClick}>
                        <FaSearch /> Search
                    </button>

                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Export Excel
                    </label>
                    <button
                        type="button"
                        className="form-control btn btn-warning"
                        onClick={props.onExportExcel}>
                        <BsFiletypeXlsx /> Download
                    </button>

                </div>
            </div>
        </div>
    )
}

const ReportPage = () => {

    const [listData, setListData] = useState([]);

    async function handleSearchClick(filter) {
        let response = await apiFilterReportHistory(filter);
        if (response) {
            if (response.status === "success") {
                if (Array.isArray(response.data)) {
                    setListData(response.data);
                    // calcWorkTime(response.data);
                }
            }
        }
    }
    async function handleExportExcel() {
        const worksheet = XLSX.utils.json_to_sheet(listData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
        XLSX.writeFile(workbook, 'Report.xlsx');
    }

    // function calcWorkTime(data) {
    //     const workTimes = {};

    //     data.forEach(entry => {
    //         const actionTime = moment.utc(entry.date_time);
    //         const actionDate = actionTime.format('YYYY-MM-DD');
    //         const actionType = entry.action;
    //         const userName = entry.user_detail.name;

    //         if (!workTimes[userName]) {
    //             workTimes[userName] = {};
    //             workTimes[userName]["userDetail"] = entry.user_detail;
    //             workTimes[userName]["id"] = entry.id;
    //             workTimes[userName]["type"] = entry.type;
    //         }

    //         if (!workTimes[userName][actionDate]) {
    //             workTimes[userName][actionDate] = {};
    //         }

    //         if (actionType === 1) {  // Check-in
    //             workTimes[userName][actionDate].checkIn = actionTime;
    //             const lateThreshold = moment.utc(`${actionDate}T07:00:00Z`);
    //             if (actionTime.isAfter(lateThreshold)) {
    //                 workTimes[userName][actionDate].late = true;
    //             }
    //         } else if (actionType === 2) {  // Check-out
    //             workTimes[userName][actionDate].checkOut = actionTime;
    //         }
    //     });

    //     const userReports = Object.keys(workTimes).map(userName => {
    //         let totalHours = 0;
    //         let lateDays = 0;
    //         let workDays = 0;

    //         Object.values(workTimes[userName]).forEach(times => {
    //             if (times.checkIn && times.checkOut) {
    //                 const workDuration = moment.duration(times.checkOut.diff(times.checkIn));
    //                 totalHours += workDuration.asMinutes();
    //                 workDays += 1;
    //                 if (times.late) {
    //                     lateDays += 1;
    //                 }
    //             }
    //         });

    //         return {
    //             name: userName,
    //             totalHoursWorked: totalHours.toFixed(1),
    //             daysLate: lateDays,
    //             totalWorkDays: workDays,
    //             info: workTimes[userName]
    //         };
    //     });

    //     if(userReports.length > 0){
    //         setListData(userReports);
    //     }
    //     else{
    //         setListData([]);
    //     }
    // }

    return (
        <div>
            <ToolStrip
                onSearchClick={handleSearchClick}
                onExportExcel={handleExportExcel}
            />
            <div style={{ overflow: 'auto', height: 570 }}>
                {
                    listData.length > 0 ?
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Total WorkDays</th>
                                    <th scope="col">Total HoursWorked</th>
                                    <th scope="col">Total DaysLate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.name}</td>
                                                <td>{item.info.id}</td>
                                                <td>{getNameType(item.info.type)}</td>
                                                <td>{item.totalWorkDays}</td>
                                                <td>{`${Math.floor(item.totalHoursWorked/60)} (hours) : ${(Math.round(item.totalHoursWorked%60))} (minute)`}</td>
                                                <td>{item.daysLate}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <div style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <span>No data</span>
                        </div>
                }
            </div>
        </div>
    )
}

export default ReportPage;