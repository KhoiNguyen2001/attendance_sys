import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsFiletypeXlsx } from "react-icons/bs";
import { apiDeleteEvents, apiFilterEvents } from "./common/api";
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
    const [id, setID] = useState("");
    const [type, setType] = useState(0);

    function handleSearchClick(){
        let filter = {
            from: `${dateFrom}T${timeFrom}:00Z`,
            to: `${dateTo}T${timeTo}:59Z`,
            id: id,
            type: type
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
                        onChange={(e)=>setID(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Type
                    </label>
                    <select
                        className="form-select"
                        value={type}
                        onChange={(e)=>setType(e.target.value)}
                    >
                        <option value={0}>All</option>
                        <option value={1}>Card</option>
                        <option value={2}>FingerPrint</option>
                    </select>
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

const EventsPage = () => {

    const [listEvents, setListEvents] = useState([]);

    async function handleSearchClick(filter) {

        let response = await apiFilterEvents(filter);
        if (response) {
            if (response.status === "success") {
                if (Array.isArray(response.data)) {
                    setListEvents(response.data);
                }
            }
        }
    }

    async function handleDeleteClick(event) {
        Swal.fire({
            title: `Do you want delete "${event.id}"?`,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let isSuccess = await deleteHistory(event);
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

    async function handleExportExcel() {
        const worksheet = XLSX.utils.json_to_sheet(listEvents);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
        XLSX.writeFile(workbook, 'Event.xlsx');
    }


    async function deleteHistory(event) {
        let response = await apiDeleteEvents(event._id);
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
            <div style={{overflow: 'auto', height: 570}}>
                {
                    listEvents.length > 0 ?
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
                                    listEvents.map((history, index) => {
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

export default EventsPage;