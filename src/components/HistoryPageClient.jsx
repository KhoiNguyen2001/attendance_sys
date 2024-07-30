import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsFiletypeXlsx } from "react-icons/bs";
import { apiDeleteHistory, apiFilterHistory, apiGetAllHistory } from "./common/api";
import { getNameActionType, getNameType } from "./common/convert_name";
import { toDate, toDateTime, toTime } from "./common/convert_time";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const ToolStrip = (props) => {

    const [dateFrom, setDateFrom] = useState(toDate(new Date()));
    const [timeFrom, setTimeFrom] = useState("00:00");
    const [dateTo, setDateTo] = useState(toDate(new Date()));
    const [timeTo, setTimeTo] = useState("23:59");

    function handleSearchClick() {
        let _info = localStorage.getItem("infoUser");
        if (_info) {
            _info = JSON.parse(_info);
            console.log(_info)
            let filter = {
                from: `${dateFrom}T${timeFrom}:00Z`,
                to: `${dateTo}T${timeTo}:59Z`,
                id: _info.id_device,
            }
            props.onSearchClick(filter);
        }
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

const HistoryPageClient = () => {

    const [listHistory, setListHistory] = useState([]);

    async function handleSearchClick(filter) {

        let response = await apiFilterHistory(filter);
        if (response) {
            if (response.status === "success") {
                if (Array.isArray(response.data)) {
                    setListHistory(response.data);
                }
            }
        }
    }

    async function handleExportExcel() {
        const worksheet = XLSX.utils.json_to_sheet(listHistory);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
        XLSX.writeFile(workbook, 'History.xlsx');
    }


    async function handleDeleteClick(history) {
        Swal.fire({
            title: `Do you want delete "${history.id}"?`,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let isSuccess = await deleteHistory(history);
                if (isSuccess) {
                    Swal.fire("Deleted!", "", "success");
                    handleSearchClick();
                }
                else {
                    Swal.fire("Failed!", "", "error");
                }
            }
        });
    }

    async function deleteHistory(history) {
        let response = await apiDeleteHistory(history._id);
        if (response) {
            if (response.status == "success") {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    return (
        <div>
            <ToolStrip
                onSearchClick={handleSearchClick}
                onExportExcel={handleExportExcel}
            />
            <div style={{ overflow: 'auto', height: 570 }}>
                {
                    listHistory.length > 0 ?
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Action Type</th>
                                    <th scope="col">DateTime</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listHistory.map((history, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{history.id}</td>
                                                <td>{getNameType(history.type)}</td>
                                                <td>{getNameActionType(history.action)}</td>
                                                <td>{toDateTime(history.date_time)}</td>
                                                <td>
                                                    <button type="button" className="btn btn-danger mx-2" onClick={() => handleDeleteClick(history)}>
                                                        <MdDelete />
                                                    </button>
                                                </td>
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

export default HistoryPageClient;