import './ChartPage.css';
import { FaSearch } from "react-icons/fa";
import { apiFilterTotalSalary, apiGetAllSalary } from './common/api';
import React, { useState, useEffect } from 'react';
import { toDateTime, toDate } from './common/convert_time';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ToolStrip = (props) => {

    const [dateFrom, setDateFrom] = useState(toDate(new Date()));
    const [timeFrom, setTimeFrom] = useState("00:00");
    const [dateTo, setDateTo] = useState(toDate(new Date()));
    const [timeTo, setTimeTo] = useState("23:59");
    const [section, setSection] = useState("");

    function handleSearchClick() {
        let filter = {
            from: `${dateFrom}T${timeFrom}:00Z`,
            to: `${dateTo}T${timeTo}:59Z`,
            section: section,
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
                        Section
                    </label>
                    <select
                        className="form-select"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    >
                        <option value={''}>--</option>
                        {
                            props.sections.map((section, index) => {
                                return (
                                    <option key={index} value={section}>{section}</option>
                                )
                            })
                        }
                        {/* <option value={0}>All</option>
                        <option value={1}>Card</option>
                        <option value={2}>FingerPrint</option> */}
                    </select>
                </div>
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
            </div>
        </div>
    )
}

const ChartPage = () => {

    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [
            {
                label: 'Biểu đồ tổng lương thực lĩnh',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            },
        ],
    });
    const [sections, setSections] = useState([]);

    useEffect(() => {
        fetchAllSalary();
    }, []);

    const fetchAllSalary = async () => {
        try {
            const response = await apiGetAllSalary();
            const data = response.data;

            // Populate unique sections from this data
            const uniqueSections = [...new Set(data.map(item => item.section))];
            setSections(prevSections => [...new Set([...prevSections, ...uniqueSections])]);
        } catch (error) {
            console.error("Failed to fetch all salary data", error);
        }
    };

    function getMonthYear(date) {
        const dateTime = new Date(date);
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        return `${year}-${month}`;
    }

    async function handleSearchClick(filter) {
        let response = await apiFilterTotalSalary(filter);
        console.log(response)
        if (response) {
            if (response.status === "success") {
                if (Array.isArray(response.data)) {
                    if (response.data.length > 0) {
                        const arrTitle = [];
                        const arrData = [];
                        response.data.forEach(element => {
                            arrTitle.push(getMonthYear(element.fromDate));
                            arrData.push(element.totalNetSalary);
                        });
                        setDataChart(prev => ({
                            ...prev,
                            labels: arrTitle,
                            datasets: prev.datasets.map(dataset => ({
                                ...dataset,
                                data: arrData
                            }))
                        }));
                    }
                }
            }
        }
    }

    return (
        <div>
            <ToolStrip
                sections={sections}
                onSearchClick={handleSearchClick}
            />
            <div style={{ display:'flex', overflow: 'auto', height: 580, width: '100%' }}>
                {
                    <Line
                        data={dataChart}
                        height="100%"
                    />
                }
            </div>
        </div>
    )
}

export default ChartPage;