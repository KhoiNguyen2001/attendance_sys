import { useEffect, useState } from "react";
import './ProfilePage.css';
import { toDate } from "./common/convert_time";
import Swal from 'sweetalert2';
import { apiEditUser } from "./common/api";

const ProfilePage = () => {

    const [infoUser, setInfoUser] = useState({});
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState(1);
    const [birthday, setBirtday] = useState(toDate(new Date()));
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        let _infoUser = localStorage.getItem("infoUser");
        if (_infoUser) {
            setInfoUser(JSON.parse(_infoUser));
        }
    }, [])

    useEffect(() => {
        if (infoUser) {
            // infoUser = JSON.parse(infoUser);
            setEmail(infoUser.email);
            setFirstName(infoUser.firstName);
            setLastName(infoUser.lastName);
            setSex(infoUser.sex);
            setBirtday(toDate(infoUser.birthday));
            setPhone(infoUser.phone);
            setAddress(infoUser.address);
            setAvatar(infoUser.avatar);
        }
    }, [infoUser])

    function handleEditClick() {
        setIsEdit(prev => !prev)
        if (isEdit) {
            Swal.fire({
                title: `Do you want save change?`,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let data = {
                        firstName: firstName,
                        lastName: lastName,
                        fullName: `${firstName} ${lastName}`,
                        sex: sex,
                        birthday: birthday,
                        phone: phone,
                        address: address,
                        avatar: avatar
                    }
                    let response = await apiEditUser(infoUser._id, data);
                    console.log(response)
                    if (response) {
                        if (response.status == "success") {
                            Swal.fire("Success!", "", "success");
                        }
                        else {
                            Swal.fire("Failed!", "", "error");
                        }
                    }
                    else {
                        Swal.fire("Failed!", "", "error");
                    }
                }
            });
        }
    }

    function handleChangeAvatar(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = function () {
                let base64String = reader.result;
                setAvatar(base64String);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div>
            <h1 className="mb-3">Info Account</h1>
            <div className="profile-container">
                <div className="profile-content">
                    <div className="avatar-box">
                        <div className="avatar-container mb-3">
                            <img src={avatar}></img>
                        </div>
                        <div className="mb-3 me-3">
                            <h3>{`${firstName} ${lastName}`}</h3>
                        </div>
                    </div>
                    <div>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" disabled={!isEdit} onChange={handleChangeAvatar} />
                            <button type="button" className="btn btn-warning" onClick={handleEditClick}>
                                {isEdit ? `Update` : "Edit"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            disabled={true}
                            value={email}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            First Name
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            disabled={!isEdit}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Last Name
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            disabled={!isEdit}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Sex
                        </label>
                        <select className="form-select" value={sex} disabled={!isEdit} onChange={(e) => setSex(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Fermale">Fermale</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Birthday
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            disabled={!isEdit}
                            value={birthday}
                            onChange={(e) => setBirtday(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Phone
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            disabled={!isEdit}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            disabled={!isEdit}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;