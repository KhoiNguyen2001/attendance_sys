const baseURL = `https://ap-southeast-1.aws.data.mongodb-api.com/app/application-1-hrjpudp/endpoint`;

// API đăng kí
async function apiSignUp(data) {
    try {
        let response = await fetch(`${baseURL}/signup`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API đăng nhập
async function apiLogin(data) {
    try {
        let response = await fetch(`${baseURL}/login`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API đăng nhập khách hàng
async function apiLoginClient(data) {
    try {
        let response = await fetch(`${baseURL}/login_client`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API get tất cả users
async function apiGetAllUsers() {
    try {
        let response = await fetch(`${baseURL}/users/get_all`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiGetAllSalary() {
    try {
        let response = await fetch(`${baseURL}/get_salary`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiGetAllTitleSalary() {
    try {
        let response = await fetch(`${baseURL}/get_title`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiGetAllDetailSalary(idSalary) {
    try {
        let response = await fetch(`${baseURL}/get_detail_salary?id=${idSalary}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiGetAllUsers1() {
    try {
        const response = await fetch(`${baseURL}/users/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Trả về mảng dữ liệu từ response.data
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Trả về một mảng trống trong trường hợp có lỗi
    }
}

// API thêm users
async function apiAddUsers(data) {
    try {
        let response = await fetch(`${baseURL}/users/add`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiAddTitleSalary(data) {
    try {
        let response = await fetch(`${baseURL}/add_title`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiAddSalary(data) {
    try {
        let response = await fetch(`${baseURL}/add_salary`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiAddTotalSalary(data) {
    try {
        let response = await fetch(`${baseURL}/add_totalSal`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiAddDetailSalary(data) {
    try {
        let response = await fetch(`${baseURL}/add_detail_salary`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API update users
async function apiEditUsers(id, data) {
    try {
        let response = await fetch(`${baseURL}/users/edit?_id=${id}`, {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiEditSalary(id, data) {
    try {
        let response = await fetch(`${baseURL}/edit_salary?_id=${id}`, {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API delete users
async function apiDeleteUsers(id) {
    try {
        let response = await fetch(`${baseURL}/users/delete?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiDeleteSalary(id) {
    try {
        let response = await fetch(`${baseURL}/delete_salary?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiDeleteTitleSalary(id) {
    try {
        let response = await fetch(`${baseURL}/delete_title?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API get tất cả History
async function apiGetAllHistory() {
    try {
        let response = await fetch(`${baseURL}/get_history`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API filter History
async function apiFilterHistory(filter) {
    try {
        let response = await fetch(`${baseURL}/history/filter?from=${filter.from}&to=${filter.to}&id=${filter.id}&type=${filter.type}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API filter report History
async function apiFilterReportHistory(filter) {
    try {
        let response = await fetch(`${baseURL}/history/filter_report?from=${filter.from}&to=${filter.to}&id=${filter.id}&type=${filter.type}&name=${filter.name}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API delete history
async function apiDeleteHistory(id) {
    try {
        let response = await fetch(`${baseURL}/history/delete?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API filter Events
async function apiFilterEvents(filter) {
    try {
        let response = await fetch(`${baseURL}/events/filter?from=${filter.from}&to=${filter.to}&id=${filter.id}&type=${filter.type}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API delete Events
async function apiDeleteEvents(id) {
    try {
        let response = await fetch(`${baseURL}/events/delete?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API get Performance Salary Options
async function apiGetPerformanceSalaryOptions() {
    try {
        let response = await fetch(`${baseURL}/get_performance_salary`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API update Performance Salary Options
async function apiUpdatePerformanceSalaryOptions(data) {
    try {
        let response = await fetch(`${baseURL}/add_performance_salary`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API Calc Salary Detail
async function apiCalcSalaryDetail(data) {
    try {
        let response = await fetch(`${baseURL}/calc_detail_salary?from=${data.from}&to=${data.to}&section=${data.section}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API Calc Salary Detail
async function apiFilterTotalSalary(filter) {
    try {
        let response = await fetch(`${baseURL}/filter_total_salary?from=${filter.from}&to=${filter.to}&section=${filter.section}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API update user
async function apiEditUser(id, data) {
    try {
        let response = await fetch(`${baseURL}/user/edit?_id=${id}`, {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// API 
async function apiGetAllDetailSalaryClient(name) {
    try {
        let response = await fetch(`${baseURL}/get_detail_salary_client?name=${name}`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function apiGetAllInsurance() {
    try {
        let response = await fetch(`${baseURL}/get_insurance`, {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiAddInsurance(data) {
    try {
        let response = await fetch(`${baseURL}/add_insurance`, {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiEditInsurance(id, data) {
    try {
        let response = await fetch(`${baseURL}/edit_insurance?_id=${id}`, {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function apiDeleteInsurance(id) {
    try {
        let response = await fetch(`${baseURL}/delete_insurance?_id=${id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export {
    apiSignUp,
    apiLogin,
    apiLoginClient,
    apiGetAllUsers,
    apiAddUsers,
    apiAddSalary,
    apiEditUsers,
    apiDeleteUsers,
    apiGetAllHistory,
    apiFilterHistory,
    apiFilterReportHistory,
    apiDeleteHistory,
    apiFilterEvents,
    apiDeleteEvents,
    apiGetAllUsers1,
    apiGetAllSalary,
    apiEditSalary,
    apiDeleteSalary,
    apiAddDetailSalary,
    apiGetAllDetailSalary,
    apiAddTitleSalary,
    apiGetAllTitleSalary,
    apiDeleteTitleSalary,
    apiAddTotalSalary,
    apiGetPerformanceSalaryOptions,
    apiUpdatePerformanceSalaryOptions,
    apiCalcSalaryDetail,
    apiFilterTotalSalary,
    apiEditUser,
    apiGetAllDetailSalaryClient,
    apiGetAllInsurance,
    apiAddInsurance,
    apiEditInsurance,
    apiDeleteInsurance
}