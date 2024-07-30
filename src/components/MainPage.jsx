import React, { useEffect, useState } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { BiTachometer } from "react-icons/bi";
import { MdEventNote } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaChartBar } from "react-icons/fa";
import ReportPage from "./ReportPage";
import UsersPage from "./UsersPage";
import HistoryPage from "./HistoryPage";
import EventsPage from "./EventsPage";
import ProfilePage from "./ProfilePage";
import ContactUsPage from "./ContactUSPage";
import Home from "./Home";
import Salary from "./Salary";
import ChartPage from "./ChartPage";
import HistoryPageClient from "./HistoryPageClient";
import DetailSalaryClient from "./detailSalaryClient";
import { useNavigate } from "react-router-dom";


const MainPage = () => {
  const navigate = useNavigate(); // Khởi tạo history

  const [isOpen, setIsOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [infoUser, setInfoUser] = useState(null);

  useEffect(() => {
    let _info = localStorage.getItem("infoUser");
    if (_info) {
      _info = JSON.parse(_info);
      if (_info.roles === "admin") {
        setSelectedTab("home");
      }
      else {
        setSelectedTab("history-client");
      }
      setInfoUser(_info);
    }
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-container">
      <div className={`menu-button-container ${isOpen ? "" : "closed"}`}>
        <button
          className={`menu-button ${isOpen ? "" : "closed"}`}
          onClick={toggleSidebar}
        >
          {isOpen ? <TfiMenuAlt /> : <MdOutlineDoubleArrow />}
        </button>
      </div>


      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {
          infoUser !== null && infoUser !== undefined ?
            infoUser.roles === "admin" ?
              <ul>
                <li>
                  <a className={selectedTab === 'home' ? 'active' : ''} href="#home" onClick={() => handleTabClick("home")}>
                    <BiTachometer className="icon" /> <span className="link-text">Home</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'users' ? 'active' : ''} href="#users" onClick={() => handleTabClick("users")}>
                    <FaUsers className="icon" /> <span className="link-text">Users</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'history' ? 'active' : ''} href="#history" onClick={() => handleTabClick("history")}>
                    <FaHistory className="icon" /> <span className="link-text">History</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'event' ? 'active' : ''} href="#event" onClick={() => handleTabClick("event")}>
                    <MdEventNote className="icon" /> <span className="link-text">Event</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'report' ? 'active' : ''} href="#report" onClick={() => handleTabClick("report")}>
                    <HiOutlineDocumentReport className="icon" /> <span className="link-text">Report</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'salary' ? 'active' : ''} href="#salary" onClick={() => handleTabClick("salary")}>
                    <AiFillDollarCircle className="icon" /> <span className="link-text">Salary</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'chart' ? 'active' : ''} href="#chart" onClick={() => handleTabClick("chart")}>
                    <FaChartBar className="icon" /> <span className="link-text">Chart</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'profile' ? 'active' : ''} href="#profile" onClick={() => handleTabClick("profile")}>
                    <IoPersonCircleOutline className="icon" /> <span className="link-text">Profile</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'contact' ? 'active' : ''} href="#contact" onClick={() => handleTabClick("contact")}>
                    <HiOutlinePhone className="icon" /> <span className='link-text'>Contact us</span>
                  </a>
                </li>
              </ul>
              :
              <ul>
                <li>
                  <a className={selectedTab === 'history-client' ? 'active' : ''} href="#history-client" onClick={() => handleTabClick("history-client")}>
                    <FaHistory className="icon" /> <span className="link-text">History</span>
                  </a>
                </li>
                <li>
                  <a className={selectedTab === 'salary-client' ? 'active' : ''} href="#salary-client" onClick={() => handleTabClick("salary-client")}>
                    <AiFillDollarCircle className="icon" /> <span className="link-text">Salary</span>
                  </a>
                </li>
              </ul>
            :
            <ul>
              <li>
                <a className={selectedTab === 'history-client' ? 'active' : ''} href="#history-client" onClick={() => handleTabClick("history-client")}>
                  <FaHistory className="icon" /> <span className="link-text">History</span>
                </a>
              </li>
              <li>
                <a className={selectedTab === 'salary-client' ? 'active' : ''} href="#salary-client" onClick={() => handleTabClick("salary-client")}>
                  <AiFillDollarCircle className="icon" /> <span className="link-text">Salary</span>
                </a>
              </li>
            </ul>
        }
      </div>

      <div className={`content ${isOpen ? "shifted" : ""}`}>
        {selectedTab === "home" && <Home />}
        {selectedTab === "users" && <UsersPage />}
        {selectedTab === "history" && <HistoryPage />}
        {selectedTab === "event" && <EventsPage />}
        {selectedTab === "report" && <ReportPage />}
        {/* {selectedTab === "manage" && <UserDetails />} */}
        {selectedTab === "profile" && <ProfilePage />}
        {selectedTab === "contact" && <ContactUsPage />}
        {selectedTab === "salary" && <Salary />}
        {selectedTab === "chart" && <ChartPage />}
        {selectedTab === "history-client" && <HistoryPageClient />}
        {selectedTab === "salary-client" && <DetailSalaryClient />}
      </div>

      <div className="settings-container">
        <button className="settings-button" onClick={toggleSettingsMenu}>
          <IoSettingsOutline />
        </button>
        <div className={`settings-menu ${isSettingsOpen ? "open" : "closed"}`}>
          <ul>
            <li onClick={handleLogout}>
              <IoLogOutOutline className="logout-icon" /> Log Out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
