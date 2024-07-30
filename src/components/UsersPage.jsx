
import { useEffect, useState } from 'react';
import './UsersPage.css';
import { apiAddUsers, apiEditUsers, apiDeleteUsers, apiGetAllUsers, apiAddSalary, apiGetAllSalary, apiEditSalary, apiDeleteSalary, apiAddInsurance, apiEditInsurance, apiGetAllInsurance, apiDeleteInsurance } from './common/api';
import { toDate } from './common/convert_time';
import { getNameType } from './common/convert_name';
import { IoMdAddCircle } from "react-icons/io";
import { BsFiletypeXlsx } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Client, Message } from 'paho-mqtt';

// hien thi VND
const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount * 1);
};

const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
};

const ModalUsers = (props) => {
    const [idDevice, setIDDevice] = useState("");
    const [typeDevice, setTypeDevice] = useState(1);
    const [name, setName] = useState("");
    const [sex, setSex] = useState("male");
    const [birthday, setBirthday] = useState(toDate(new Date()));
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [section, setSection] = useState("No Section");
    const [position, setPosition] = useState("No Position");
    const [password, setPassword] = useState("");
    const [basicSal, setBasicSal] = useState("");
    const [abSal, setAbSal] = useState("");
    const [performSal, setPerformSal] = useState("");
    const [lunch, setLunch] = useState("");
    const [transport, setTransport] = useState("");
    const [phonebill, setPhoneBill] = useState("");
    const [tax, setTax] = useState("");
    const [social, setSocial] = useState("");
    const [health, setHealth] = useState("");
    const [unemploy, setUnemploy] = useState("");
    const [salaries, setSalaries] = useState([]);
    const [sections, setSections] = useState([]);
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [abSalOptions, setAbSalOptions] = useState([]);
    const [filteredAbSalOptions, setFilteredAbSalOptions] = useState([]);
    const [stdWorkDay, setStdWorkDay] = useState("");

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await apiGetAllSalary();
                if (response.status === "success") {
                    setSalaries(response.data);
                    const uniqueSections = [...new Set(response.data.map(salary => salary.section))];
                    setSections(uniqueSections);

                    // Tách dữ liệu Ability Salary từ API
                    const abilitySalaries = response.data.reduce((acc, curr) => {
                        const abilitySal = curr.ability_sal.split(", ");
                        return [...acc, ...abilitySal];
                    }, []);

                    // Lưu vào state để render dropdown options
                    setAbSalOptions(abilitySalaries);

                    if (props.titleModal === 'Edit User') {
                        setInitialSalary(response.data, props.user.position, props.user.section);
                    } else {
                        setInitialSalary(response.data, "No Position", "No Section");
                    }
                } else {
                    console.error('Failed to fetch salary data');
                }
            } catch (error) {
                console.error('Error fetching salary data:', error);
            }
        };

        if (props.titleModal === 'Edit User') {
            setFormValues(props.user);
        } else {
            resetForm();
        }

        fetchSalaries();
    }, [props.titleModal, props.user]);

    const setFormValues = (user) => {
        setIDDevice(user.id_device);
        setTypeDevice(user.type_device);
        setName(user.name);
        setSex(user.sex);
        setBirthday(toDate(user.birthday));
        setPhone(user.phone);
        setAddress(user.address);
        setSection("No Section");
        setPosition(user.position);
        setStdWorkDay(user.stdWorkDay);
        setAbSal(user.ability_sal);
        setPerformSal(user.perform_sal);
        setLunch(user.lunch);
        setTransport(user.transport);
        setPhoneBill(user.phone);
        setTax(user.income_tax);
        setSocial(user.social_insu);
        setHealth(user.health_insu);
        setUnemploy(user.unemploy_insu);
    };
    const resetForm = () => {
        setIDDevice("");
        setTypeDevice(1);
        setName("");
        setSex("male");
        setBirthday(toDate(new Date()));
        setPhone("");
        setAddress("");
        setSection("No Section");
        setPosition("No Position");
        setStdWorkDay("");
        setLunch("");
        setTransport("");
        setPhoneBill("");
        setTax("");
        setSocial("");
        setHealth("");
        setUnemploy("");
    };



    const setInitialSalary = (salaries, position, section) => {
        const salary = salaries.find(sal => sal.position === position && sal.section === section);
        if (salary) {
            setBasicSal(salary.basic_sal);
            setAbSal(salary.ability_sal);
            setPerformSal(salary.perform_sal);
            setLunch(salary.lunch);
            setTransport(salary.transport);
            setPhoneBill(salary.phone);
            setStdWorkDay(salary.stdWorkDay);
            setTax(salary.income_tax);
            setSocial(salary.social_insu);
            setHealth(salary.health_insu);
            setUnemploy(salary.unemploy_insu);
        } else {
            setBasicSal("");
            setAbSal("");
            setPerformSal("");
            setLunch("");
            setTransport("");
            setPhoneBill("");
            setStdWorkDay("");
            setTax("");
            setSocial("");
            setHealth("");
            setUnemploy("");
        }
    };

    const handlePositionChange = (e) => {
        const selectedPosition = e.target.value;
        setPosition(selectedPosition);

        // Lọc và cập nhật danh sách Ability Salary phù hợp với Position và Section hiện tại
        const filteredAbilities = salaries
            .filter(salary => salary.section === section && salary.position === selectedPosition)
            .map(salary => salary.ability_sal.split(", "))
            .flat(); // flat() để làm phẳng mảng 2 chiều
        setFilteredAbSalOptions(filteredAbilities);

        // Cập nhật giá trị Ability Salary
        setInitialSalary(salaries, selectedPosition, section);
    };

    const handleSectionChange = (e) => {
        const selectedSection = e.target.value;
        setSection(selectedSection);

        // Lọc danh sách Position phù hợp với Section được chọn
        const filteredPositions = salaries
            .filter(salary => salary.section === selectedSection)
            .map(salary => salary.position);
        setFilteredPositions(filteredPositions);

        // Lọc và cập nhật danh sách Ability Salary phù hợp
        const filteredAbilities = salaries
            .filter(salary => salary.section === selectedSection && salary.position === position)
            .map(salary => salary.ability_sal.split(", "))
            .flat(); // flat() để làm phẳng mảng 2 chiều
        setFilteredAbSalOptions(filteredAbilities);

        // Cập nhật giá trị Ability Salary nếu đã chọn
        if (position !== "No Position") {
            setInitialSalary(salaries, position, selectedSection);
        } else {
            setInitialSalary(salaries, "No Position", selectedSection);
        }
    };

    const handleSaveClick = async () => {
        const title = props.titleModal;
        const confirmText = title === "Add new User" ? "Do you want to add a new user?" : "Do you want to save changes?";
        const result = await Swal.fire({
            title: confirmText,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: "Don't save"
        });

        if (result.isConfirmed) {
            const isSuccess = title === "Add new User" ? await addUsers() : await editUsers();
            if (isSuccess) {
                props.isRefresh();
                props.onCloseClick();
                Swal.fire("Saved!", "", "success");
            } else {
                Swal.fire("Failed!", "", "error");
            }
        }
    };

    const addUsers = async () => {
        const data = {
            id_device: Number(idDevice),
            type_device: Number(typeDevice),
            name,
            sex,
            birthday: new Date(birthday),
            phone,
            address,
            password,
            section,
            position,
            stdWorkDay,
            basic_sal: basicSal,
            ability_sal: abSal,
            perform_sal: performSal,
            lunch,
            transport,
            phone_bill: phonebill,
            income_tax: tax,
            social_insu: social,
            health_insu: health,
            unemploy_insu: unemploy,
        };
        try {
            const response = await apiAddUsers(data);
            return response.status === "success";
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        }
    };

    const editUsers = async () => {
        const data = {
            id_device: Number(idDevice),
            type_device: Number(typeDevice),
            name,
            sex,
            birthday: new Date(birthday),
            phone,
            address,
            password,
            section,
            position,
            stdWorkDay,
            basic_sal: basicSal,
            ability_sal: abSal,
            perform_sal: performSal,
            lunch,
            transport,
            phone_bill: phonebill,
            income_tax: tax,
            social_insu: social,
            health_insu: health,
            unemploy_insu: unemploy,
        };
        try {
            const response = await apiEditUsers(props.user._id, data);
            return response.status === "success";
        } catch (error) {
            console.error('Error editing user:', error);
            return false;
        }
    };


    const renderUserInfoForm = () => (
        <>
            <div className="mb-3">
                <label className="form-label">ID Device</label>
                <input
                    type="number"
                    className="form-control"
                    value={idDevice}
                    onChange={(e) => setIDDevice(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Type Device</label>
                <select className="form-select" value={typeDevice} onChange={(e) => setTypeDevice(e.target.value)}>
                    <option value={1}>Type 1</option>
                    <option value={2}>Type 2</option>
                    {/* Add other types as needed */}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Sex</label>
                <select className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Birthday</label>
                <input
                    type="date"
                    className="form-control"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Section</label>
                <select className="form-select" value={section} onChange={handleSectionChange}>
                    <option value="No Section">No Section</option>
                    {sections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Position</label>
                <select className="form-select" value={position} onChange={handlePositionChange}>
                    <option value="No Position">No Position</option>
                    {filteredPositions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                    ))}
                </select>
            </div>
        </>
    );
    const renderSalaryInfoForm = () => (
        <>
            <div className="mb-3">
                <label className="form-label">Basic Salary</label>
                <input
                    type="number"
                    className="form-control"
                    value={basicSal}
                    onChange={(e) => setBasicSal(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Ability Salary</label>
                <select
                    className="form-select"
                    value={abSal}
                    onChange={(e) => setAbSal(e.target.value)}
                >
                    <option value="">Select Ability Salary</option>
                    {filteredAbSalOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Performance Salary</label>
                <input
                    type="number"
                    className="form-control"
                    value={performSal}
                    onChange={(e) => setPerformSal(e.target.value)}
                    disabled
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Lunch</label>
                <input
                    type="number"
                    className="form-control"
                    value={lunch}
                    onChange={(e) => setLunch(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Transport</label>
                <input
                    type="number"
                    className="form-control"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Phone Bill</label>
                <input
                    type="number"
                    className="form-control"
                    value={phonebill}
                    onChange={(e) => setPhoneBill(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Standard Work Day</label>
                <input
                    type="number"
                    className="form-control"
                    value={stdWorkDay}
                    onChange={(e) => setStdWorkDay(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Income Tax</label>
                <input
                    type="number"
                    className="form-control"
                    value={tax}
                    placeHolder="%"
                    onChange={(e) => setTax(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Social Insurance</label>
                <input
                    type="number"
                    className="form-control"
                    value={social}
                    placeHolder="%"
                    onChange={(e) => setSocial(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Health Insurance</label>
                <input
                    type="number"
                    className="form-control"
                    value={health}
                    placeHolder="%"
                    onChange={(e) => setHealth(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Unemployment Insurance</label>
                <input
                    type="number"
                    className="form-control"
                    value={unemploy}
                    placeHolder="%"
                    onChange={(e) => setUnemploy(e.target.value)}
                />
            </div>
        </>
    );

    return (
        <div>
            <div className="modal show modal-lg" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.titleModal}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={props.onCloseClick}
                            />
                        </div>
                        <div className="d-flex modal-body justify-content-around">
                            <div className='col col-5'>
                                {/* User Information Form */}
                                {renderUserInfoForm()}
                            </div>
                            <div className='col col-5'>
                                {/* Salary Information Form */}
                                {renderSalaryInfoForm()}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={props.onCloseClick}
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModalSalary = (props) => {
    const [position, setPosition] = useState("");
    const [basicSal, setBasicSal] = useState("");
    const [abSal, setAbSal] = useState("");
    const [performSal, setPerformSal] = useState("");
    const [lunch, setLunch] = useState("");
    const [transport, setTransport] = useState("");
    const [phone, setPhone] = useState("");
    const [tax, setTax] = useState("");
    const [social, setSocial] = useState("");
    const [health, setHealth] = useState("");
    const [unemploy, setUnemploy] = useState("");
    const [section, setSection] = useState("");
    const [stWorkDay, setStWorkDay] = useState("");
    const [insuranceOptions, setInsuranceOptions] = useState([]);
    const [selectedInsurance, setSelectedInsurance] = useState("");

    useEffect(() => {
        if (props.titleModalSalary === 'Edit Salary') {
            setSection(props.user.section);
            setPosition(props.user.position);
            setSelectedInsurance(props.user.userType);
            setStWorkDay(props.user.stdWorkDay);
            setBasicSal(props.user.basic_sal);
            setAbSal(props.user.ability_sal);
            setPerformSal(props.user.perform_sal);
            setLunch(props.user.lunch);
            setTransport(props.user.transport);
            setPhone(props.user.phone);
            setTax(props.user.income_tax);
            setSocial(props.user.social_insu);
            setHealth(props.user.health_insu);
            setUnemploy(props.user.unemploy_insu);
        }
    }, [props]);

    useEffect(() => {
        // Fetch insurance options from API
        async function fetchInsuranceOptions() {
            try {
                const response = await apiGetAllInsurance();
                if (response && response.data) {
                    setInsuranceOptions(response.data);
                }
            } catch (error) {
                console.error('Error fetching insurance options:', error);
            }
        }

        fetchInsuranceOptions();
    }, []);

    useEffect(() => {
        // Update social, health, and unemployed insurance based on selected insurance
        if (selectedInsurance) {
            // Assuming `insuranceOptions` contains detailed information for each insurance type
            const selected = insuranceOptions.find(insurance => insurance.userType === selectedInsurance);
            if (selected) {
                setSocial(selected.social_insu);
                setHealth(selected.health_insu);
                setUnemploy(selected.unemploy_insu);
            }
        } else {
            // Reset to empty when no insurance type is selected
            setSocial("");
            setHealth("");
            setUnemploy("");
        }
    }, [selectedInsurance, insuranceOptions]);

    const handleTaxChange = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setTax(value);
        }
    };

    const handleSocial = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setSocial(value);
        }
    };

    const handleHealth = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setHealth(value);
        }
    };

    const handleUnemploy = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setUnemploy(value);
        }
    };

    const handleSalaryChange = (setter) => (e) => {
        let value = e.target.value;

        // Xử lý khi người dùng bấm backspace
        if (e.nativeEvent.inputType === 'deleteContentBackward' && value.endsWith(', ')) {
            const numbers = value.split(', ');
            numbers.pop(); // Xóa đi số thực cuối cùng
            value = numbers.join(', ');
        } else {
            // Xử lý khi người dùng thêm số mới
            const lastChar = value[value.length - 1];

            if (!/^\d*\.?\d*$/.test(lastChar) && lastChar !== '' && lastChar !== ' ') {
                // Nếu ký tự cuối cùng không phải là số, dấu thập phân hoặc dấu phẩy thì loại bỏ nó
                value = value.slice(0, -1);
            } else if (lastChar === ' ' || lastChar === ',') {
                // Nếu ký tự cuối cùng là dấu cách hoặc dấu phẩy, kiểm tra xem trước đó có phải là số thực hợp lệ không
                const numbers = value.split(', ').map(num => num.trim());
                const lastNumber = numbers[numbers.length - 1];

                if (lastNumber && !isNaN(lastNumber)) {
                    value = numbers.join(', ') + ', ';
                } else {
                    value = numbers.slice(0, -1).join(', ') + ', ';
                }
            }
        }

        setter(value);
    };


    const handleSaveClick = () => {
        switch (props.titleModalSalary) {
            case "Add new Salary":
                Swal.fire({
                    title: "Do you want to add new salary?",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let isSuccess = await addSalary();
                        if (isSuccess) {
                            props.isRefresh();
                            props.onCloseClick();
                            Swal.fire("Saved!", "", "success");
                        } else {
                            Swal.fire("Failed!", "", "error");
                        }
                    }
                });
                break;
            case "Edit Salary":
                Swal.fire({
                    title: "Do you want save changes?",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let isSuccess = await editSalary();
                        if (isSuccess) {
                            props.isRefresh();
                            props.onCloseClick();
                            Swal.fire("Saved!", "", "success");
                        } else {
                            Swal.fire("Failed!", "", "error");
                        }
                    }
                });
                break;
            default:
                break;
        }
    };

    const addSalary = async () => {
        let data = {
            section: section,
            position: position,
            userType: selectedInsurance,
            stdWorkDay: stWorkDay,
            basic_sal: basicSal,
            ability_sal: abSal,
            perform_sal: performSal,
            lunch: lunch,
            transport: transport,
            phone: phone,
            income_tax: tax,
            social_insu: social,
            health_insu: health,
            unemploy_insu: unemploy,
        };
        let response = await apiAddSalary(data);
        return response ? response.status === "success" : false;
    };

    const editSalary = async () => {
        let data = {
            section: section,
            position: position,
            userType: selectedInsurance,
            stdWorkDay: stWorkDay,
            basic_sal: basicSal,
            ability_sal: abSal,
            perform_sal: performSal,
            lunch: lunch,
            transport: transport,
            phone: phone,
            income_tax: tax,
            social_insu: social,
            health_insu: health,
            unemploy_insu: unemploy,
        };
        let response = await apiEditSalary(props.user._id, data);
        return response ? response.status === "success" : false;
    };

    return (
        <div>
            <div className="modal show modal-lg" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.titleModalSalary}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={props.onCloseClick}
                            />
                        </div>
                        <div className="d-flex modal-body justify-content-around">
                            <div className='col col-5'>
                                <div className="mb-3">
                                    <label className="form-label">Section</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={section}
                                        onChange={(e) => setSection(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Position</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Type of Insurance</label>
                                    <select
                                        className="form-select"
                                        value={selectedInsurance}
                                        onChange={(e) => setSelectedInsurance(e.target.value)}
                                    >
                                        <option value="">Select Insurance Type</option>
                                        {insuranceOptions.map(insurance => (
                                            <option key={insurance._id} value={insurance.userType}>
                                                {insurance.userType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Standard Work Days</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={stWorkDay}
                                        onChange={(e) => setStWorkDay(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Basic Salary</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={basicSal}
                                        onChange={(e) => setBasicSal(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Ability Salary</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={abSal}
                                        onChange={handleSalaryChange(setAbSal)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Performance Salary</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={performSal}
                                        onChange={handleSalaryChange(setPerformSal)}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lunch</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={lunch}
                                        onChange={(e) => setLunch(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Transportation</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={transport}
                                        onChange={(e) => setTransport(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone Bill</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Personal Income Tax (%)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeHolder="%"
                                        value={tax !== '' ? tax + '%' : ''}
                                        onChange={handleTaxChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Social Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeHolder="%"
                                        value={social !== '' ? social + '%' : ''}
                                        onChange={handleSocial}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Health Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeHolder="%"
                                        value={health !== '' ? health + '%' : ''}
                                        onChange={handleHealth}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Unemployed Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeHolder="%"
                                        value={unemploy !== '' ? unemploy + '%' : ''}
                                        onChange={handleUnemploy}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={props.onCloseClick}
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModalInsurance = (props) => {
    const [userType, setUserType] = useState("");
    const [socialInsurance, setSocialInsurance] = useState("");
    const [healthInsurance, setHealthInsurance] = useState("");
    const [unemployedInsurance, setUnemployedInsurance] = useState("");

    useEffect(() => {
        if (props.titleModalInsurance === 'Edit Insurance') {
            setUserType(props.user.userType);
            setSocialInsurance(props.user.social_insu);
            setHealthInsurance(props.user.health_insu);
            setUnemployedInsurance(props.user.unemploy_insu);
        }
    }, [props]);

    const handleSaveClick = () => {
        switch (props.titleModalInsurance) {
            case "Add Insurance":
                Swal.fire({
                    title: "Do you want to add new insurance?",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let isSuccess = await addInsurance();
                        if (isSuccess) {
                            props.isRefresh();
                            props.onCloseClick();
                            Swal.fire("Saved!", "", "success");
                        } else {
                            Swal.fire("Failed!", "", "error");
                        }
                    }
                });
                break;
            case "Edit Insurance":
                Swal.fire({
                    title: "Do you want to save changes?",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let isSuccess = await editInsurance();
                        if (isSuccess) {
                            props.isRefresh();
                            props.onCloseClick();
                            Swal.fire("Saved!", "", "success");
                        } else {
                            Swal.fire("Failed!", "", "error");
                        }
                    }
                });
                break;
            default:
                break;
        }
    };

    const addInsurance = async () => {
        let data = {
            userType,
            social_insu: socialInsurance,
            health_insu: healthInsurance,
            unemploy_insu: unemployedInsurance,
        };
        let response = await apiAddInsurance(data); // Thay thế bằng hàm gọi API thực tế
        return response ? response.status === "success" : false;
    };

    const editInsurance = async () => {
        let data = {
            userType,
            social_insu: socialInsurance,
            health_insu: healthInsurance,
            unemploy_insu: unemployedInsurance,
        };
        let response = await apiEditInsurance(props.user._id, data); // Thay thế bằng hàm gọi API thực tế
        return response ? response.status === "success" : false;
    };

    const handleSocial = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setSocialInsurance(value);
        }
    };

    const handleHealth = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setHealthInsurance(value);
        }
    };

    const handleUnemploy = (e) => {
        const value = e.target.value.replace('%', '');
        if (/^\d*\.?\d*$/.test(value)) {
            setUnemployedInsurance(value);
        }
    };

    return (
        <div>
            <div className="modal show modal-lg" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.titleModalInsurance}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={props.onCloseClick}
                            />
                        </div>
                        <div className="d-flex modal-body justify-content-around">
                            <div className='col col-5'>
                                <div className="mb-3">
                                    <label className="form-label">User Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userType}
                                        placeholder={'Type of user'}
                                        onChange={(e) => setUserType(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Social Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={socialInsurance !== '' ? socialInsurance + '%' : ''}
                                        placeholder={'%'}
                                        onChange={handleSocial}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Health Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={healthInsurance !== '' ? healthInsurance + '%' : ''}
                                        placeholder={'%'}
                                        onChange={handleHealth}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Unemployed Insurance</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={unemployedInsurance !== '' ? unemployedInsurance + '%' : ''}
                                        placeholder={'%'}
                                        onChange={handleUnemploy}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={props.onCloseClick}
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const UsersPage = () => {
    const [listUsers, setListUsers] = useState([]);
    const [listSalary, setListSalary] = useState([]);
    const [listInsurance, setListInsurance] = useState([]);
    const [isShowModalUsers, setIsShowModalUsers] = useState(false);
    const [isShowModalSalary, setIsShowModalSalary] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [titleModalSalary, setTitleModalSalary] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);
    const [user, setUser] = useState(null);
    const [isShowModalInsurance, setIsShowModalInsurance] = useState(false);
    const [titleModalInsurance, setTitleModalInsurance] = useState("");
    const [searchUserType, setSearchUserType] = useState('');
    // Search states for users
    const [searchName, setSearchName] = useState('');
    const [searchIdDevice, setSearchIdDevice] = useState('');
    // Search states for salary
    const [searchPosition, setSearchPosition] = useState('');
    const [searchSection, setSearchSection] = useState('');

    ///////////////////////////////////////////////////////////////
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);

    /*useEffect(() => {
        // Create a client instance
        const client = new Client('broker.hivemq.com', Number(8000), '/mqtt', 'clientId' + new Date().getTime());

        // Set the client state
        setClient(client);

        // Define event handlers
        client.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.error('Connection lost:', responseObject.errorMessage);
            }
            setConnected(false);
        };

        client.onMessageArrived = (message) => {
            console.log('Message arrived:', message.payloadString);
        };

        // Connect the client
        client.connect({
            onSuccess: () => {
                console.log('Connected Mqtt');
                setConnected(true);
                // Subscribe to a topic
                // client.subscribe('testtopic/react');
            },
            onFailure: (err) => {
                console.error('Connection failed:', err.errorMessage);
            },
        });

        // Cleanup on unmount
        return () => {
            client.disconnect();
            console.log('Disconnected Mqtt');
        };
    }, []);

    const sendMessageMqtt = (payload) => {
        if (client && connected) {
            payload = JSON.stringify(payload);
            const message = new Message(payload);
            message.destinationName = '/timekeeper/delete';
            client.send(message);
        }
    };*/

    useEffect(() => {
        GetAllUsers();
        GetAllSalary();
        GetAllInsurance();
    }, [isRefresh]);

    async function GetAllUsers() {
        // Simulated API call
        let response = await apiGetAllUsers();
        if (response && response.status === "success") {
            if (Array.isArray(response.data)) {
                setListUsers(response.data);
            }
        }
    }

    async function GetAllSalary() {
        // Simulated API call
        let response = await apiGetAllSalary();
        if (response && response.status === "success") {
            if (Array.isArray(response.data)) {
                setListSalary(response.data);
            }
        }
    }

    async function GetAllInsurance() {
        // Simulated API call
        let response = await apiGetAllInsurance();
        if (response && response.status === "success") {
            if (Array.isArray(response.data)) {
                setListInsurance(response.data);
            }
        }
    }

    function handleShowModal(type, data) {
        switch (type) {
            case "add":
                setTitleModal("Add new User");
                setIsShowModalUsers(true);
                break;
            case "add_salary":
                setTitleModalSalary("Add new Salary");
                setIsShowModalSalary(true);
                break;
            case "add_insurance":
                setTitleModalInsurance("Add Insurance");
                setIsShowModalInsurance(true);
                break;
            case "edit":
                setTitleModal("Edit User");
                setUser(data);
                setIsShowModalUsers(true);
                break;
            case "edit_salary":
                setTitleModalSalary("Edit Salary");
                setUser(data);
                setIsShowModalSalary(true);
                break;
            case "edit_insurance":
                setTitleModalInsurance("Edit Insurance");
                setUser(data);
                setIsShowModalInsurance(true);
                break;
            default:
                break;
        }
    }

    async function handleExportExcel() {
        const worksheet = XLSX.utils.json_to_sheet(listUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'User');
        XLSX.writeFile(workbook, 'User.xlsx');
    }

    async function handleExportExcel1() {
        const worksheet1 = XLSX.utils.json_to_sheet(listSalary);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'Salary');
        XLSX.writeFile(workbook, 'Salary.xlsx');
    }

    function handleModalCloseClick() {
        setIsShowModalUsers(false);
        setIsShowModalSalary(false);
        setIsShowModalInsurance(false);
    }

    async function handleDeleteClick(data) {
        Swal.fire({
            title: `Do you want to delete "${data.name}"?`,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let isSuccess = await deleteUsers(data);
                let isSalarySuccess = await deleteSalary(data);
                let isInsuranceSuccess = await deleteInsurance(data);

                if (isSuccess && isSalarySuccess && isInsuranceSuccess) {
                    const dataDeleteHardware = {
                        type: data.type_device,
                        id: data.id_device
                    }
                    /*sendMessageMqtt(dataDeleteHardware);*/
                    setIsRefresh(prev => !prev);
                    handleModalCloseClick();
                    Swal.fire("Deleted!", "", "success");
                } else {
                    Swal.fire("Failed!", "", "error");
                }
            }
        });
    }

    async function deleteUsers(data) {
        // Simulated API call
        let response = await apiDeleteUsers(data._id);
        if (response && response.status === "success") {
            return true;
        } else {
            return false;
        }
    }

    async function deleteSalary(data) {
        // Simulated API call
        let response = await apiDeleteSalary(data._id);
        if (response && response.status === "success") {
            return true;
        } else {
            return false;
        }
    }

    async function deleteInsurance(data) {
        // Simulated API call
        let response = await apiDeleteInsurance(data._id);
        if (response && response.status === "success") {
            return true;
        } else {
            return false;
        }
    }

    function handleUserSearch() {
        // Filter users based on search criteria
        let filteredUsers = listUsers.filter(user =>
            user.name.toLowerCase().includes(searchName.toLowerCase()) &&
            user.id_device.toString().includes(searchIdDevice)
        );
        return filteredUsers;
    }

    function handleSalarySearch() {
        // Filter salaries based on search criteria
        let filteredSalaries = listSalary.filter(salary =>
            salary.position.toLowerCase().includes(searchPosition.toLowerCase()) &&
            salary.section.toLowerCase().includes(searchSection.toLowerCase())
        );
        return filteredSalaries;
    }

    function handleInsuranceSearch() {
        // Filter insurance based on search criteria
        let filteredInsurance = listInsurance.filter(entry =>
            entry.userType.toLowerCase().includes(searchUserType.toLowerCase())
        );
        return filteredInsurance;
    }

    function clearUserSearch() {
        // Clear search criteria for users and refresh data
        setSearchName('');
        setSearchIdDevice('');
        GetAllUsers();
    }

    function clearSalarySearch() {
        // Clear search criteria for salaries and refresh data
        setSearchPosition('');
        setSearchSection('');
        GetAllSalary();
    }

    function clearInsuranceSearch() {
        // Clear search criteria for insurance and refresh data
        setSearchUserType('');
        // Reload data if necessary
        GetAllInsurance();
    }

    function groupSalariesBySection(salaries) {
        return salaries.reduce((acc, salary) => {
            if (!acc[salary.section]) {
                acc[salary.section] = [];
            }
            acc[salary.section].push(salary);
            return acc;
        }, {});
    }

    const groupedSalaries = groupSalariesBySection(handleSalarySearch());

    return (
        <div>
            {/* Modal for Users */}
            {isShowModalUsers && (
                <ModalUsers
                    titleModal={titleModal}
                    user={user}
                    onCloseClick={handleModalCloseClick}
                    isRefresh={() => setIsRefresh(prev => !prev)}
                />
            )}
            <h3>User</h3>

            {/* Button group and search for Users */}
            <div className="d-flex align-items-center mb-2">
                <div className='d-flex w-50'>
                    <button type="button" className="btn btn-success" onClick={() => handleShowModal("add", null)}>
                        <IoMdAddCircle /> Add User
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning mx-2"
                        onClick={handleExportExcel}>
                        <BsFiletypeXlsx /> Export Users
                    </button>
                </div>
                <div className="input-group mx-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{ borderWidth: '2px', borderColor: 'black' }}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Search by ID Device"
                        value={searchIdDevice}
                        onChange={(e) => setSearchIdDevice(e.target.value)}
                        style={{ borderWidth: '2px', borderColor: 'black' }}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => clearUserSearch()}
                    >
                        Clear
                    </button>
                </div>
            </div>
            <div className='table-responsive' style={{ display: 'flex', width: '100%', overflow: 'auto' }}>
                {listUsers.length > 0 ? (
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr >
                                <th scope="col">STT</th>
                                <th scope="col">ID Device</th>
                                <th scope="col">Type Device</th>
                                <th scope="col">Name</th>
                                <th scope="col">Section</th>
                                <th scope="col">Position</th>
                                <th scope="col">Sex</th>
                                <th scope="col">Birthday</th>
                                <th scope="col">Address</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Password</th>
                                <th scope="col">Standard Work Days</th>
                                <th scope="col">Basic Salary</th>
                                <th scope="col">Ability Salary</th>
                                <th scope="col">Performance Salary</th>
                                <th scope="col">Lunch</th>
                                <th scope="col">Transportation</th>
                                <th scope="col">Phone Bill</th>
                                <th scope="col">Personal Income Tax (%)</th>
                                <th scope="col">Social Insurance (%)</th>
                                <th scope="col">Health Insurance (%)</th>
                                <th scope="col">Unemployed Insurance (%)</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handleUserSearch().map((user, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.id_device}</td>
                                    <td>{getNameType(user.type_device)}</td>
                                    <td>{user.name}</td>
                                    <td>{user.section}</td>
                                    <td>{user.position}</td>
                                    <td>{user.sex}</td>
                                    <td>{toDate(user.birthday)}</td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.password}</td>
                                    <td>{user.stdWorkDay}</td>
                                    <td>{formatMoney(user.basic_sal)}</td>
                                    <td>{user.ability_sal}</td>
                                    <td>{user.perform_sal}</td>
                                    <td>{formatMoney(user.lunch)}</td>
                                    <td>{formatMoney(user.transport)}</td>
                                    <td>{formatMoney(user.phone_bill)}</td>
                                    <td>{formatPercentage(user.income_tax)}</td>
                                    <td>{formatPercentage(user.social_insu)}</td>
                                    <td>{formatPercentage(user.health_insu)}</td>
                                    <td>{formatPercentage(user.unemploy_insu)}</td>
                                    <td>
                                        <button type="button" className="btn btn-warning" onClick={() => handleShowModal("edit", user)}>
                                            <FaEdit />
                                        </button>
                                        <button type="button" className="btn btn-danger mx-2" onClick={() => handleDeleteClick(user)}>
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <span>No data</span>
                    </div>
                )}
            </div>

            {/* Modal for Salary */}
            {isShowModalSalary && (
                <ModalSalary
                    titleModalSalary={titleModalSalary}
                    user={user}
                    onCloseClick={handleModalCloseClick}
                    isRefresh={() => setIsRefresh(prev => !prev)}
                />
            )}
            <h3>Salary</h3>

            {/* Button group and search for Salary */}
            <div className="d-flex align-items-center mb-2">
                <div className='d-flex w-50'>
                    <button type="button" className="btn btn-success" onClick={() => handleShowModal("add_salary", null)}>
                        <IoMdAddCircle /> Add Salary
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning mx-2"
                        onClick={handleExportExcel1}>
                        <BsFiletypeXlsx /> Export Salary
                    </button>
                </div>
                <div className="input-group mx-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Position"
                        value={searchPosition}
                        onChange={(e) => setSearchPosition(e.target.value)}
                        style={{ borderWidth: '2px', borderColor: 'black' }}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Section"
                        value={searchSection}
                        onChange={(e) => setSearchSection(e.target.value)}
                        style={{ borderWidth: '2px', borderColor: 'black' }}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => clearSalarySearch()}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Salary Table */}
            {Object.keys(groupedSalaries).length > 0 ? (
                Object.keys(groupedSalaries).map((section, index) => (
                    <div key={index}>
                        <h4>Section: {section}</h4>
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Position</th>
                                    <th scope="col">Type of insurance</th>
                                    <th scope="col">Standard Work Days</th>
                                    <th scope="col">Basic Salary</th>
                                    <th scope="col">Ability Salary</th>
                                    <th scope="col">Performance Salary</th>
                                    <th scope="col">Lunch</th>
                                    <th scope="col">Transportation</th>
                                    <th scope="col">Phone Bill</th>
                                    <th scope="col">Income Tax (%)</th>
                                    <th scope="col">Social Insurance (%)</th>
                                    <th scope="col">Health Insurance (%)</th>
                                    <th scope="col">Unemployed Insurance (%)</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedSalaries[section].map((salary, idx) => (
                                    <tr key={idx}>
                                        <th scope="row">{idx + 1}</th>
                                        <td>{salary.position}</td>
                                        <td> {salary.userType}</td>
                                        <td>{salary.stdWorkDay}</td>
                                        <td>{formatMoney(salary.basic_sal)}</td>
                                        <td>{salary.ability_sal}</td>
                                        <td>{salary.perform_sal}</td>
                                        <td>{formatMoney(salary.lunch)}</td>
                                        <td>{formatMoney(salary.transport)}</td>
                                        <td>{formatMoney(salary.phone)}</td>
                                        <td>{formatPercentage(salary.income_tax)}</td>
                                        <td>{formatPercentage(salary.social_insu)}</td>
                                        <td>{formatPercentage(salary.health_insu)}</td>
                                        <td>{formatPercentage(salary.unemploy_insu)}</td>
                                        <td>
                                            <button type="button" className="btn btn-warning" onClick={() => handleShowModal("edit_salary", salary)}>
                                                <FaEdit />
                                            </button>
                                            <button type="button" className="btn btn-danger mx-2" onClick={() => handleDeleteClick(salary)}>
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <span>No data</span>
                </div>
            )}
            {/* Modal for Insurance */}
            {isShowModalInsurance && (
                <ModalInsurance
                    titleModalInsurance={titleModalInsurance}
                    user={user}
                    onCloseClick={handleModalCloseClick}
                    isRefresh={() => setIsRefresh(prev => !prev)}
                />
            )}

            <h3>Insurance</h3>
            {/* Button group and search for Insurance */}
            <div className="d-flex align-items-center mb-2">
                <div className='d-flex w-50'>
                    <button type="button" className="btn btn-success" onClick={() => handleShowModal("add_insurance", null)}>
                        <IoMdAddCircle /> Add Insurance
                    </button>
                </div>
                <div className="input-group mx-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by User Type"
                        value={searchUserType}
                        onChange={(e) => setSearchUserType(e.target.value)}
                        style={{ borderWidth: '2px', borderColor: 'black' }}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => clearInsuranceSearch()}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Insurance Table */}
            {listInsurance.length > 0 ? (
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Type of insurance</th>
                            <th scope="col">Social Insurance (%)</th>
                            <th scope="col">Health Insurance (%)</th>
                            <th scope="col">Unemployed Insurance (%)</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleInsuranceSearch().map((insurance, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{insurance.userType}</td>
                                <td>{formatPercentage(insurance.social_insu)}</td>
                                <td>{formatPercentage(insurance.health_insu)}</td>
                                <td>{formatPercentage(insurance.unemploy_insu)}</td>
                                <td>
                                    <button type="button" className="btn btn-warning" onClick={() => handleShowModal("edit_insurance", insurance)}>
                                        <FaEdit />
                                    </button>
                                    <button type="button" className="btn btn-danger mx-2" onClick={() => handleDeleteClick(insurance)}>
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <span>No data</span>
                </div>
            )}
        </div>
    );
};

export default UsersPage;