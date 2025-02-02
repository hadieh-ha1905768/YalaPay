import { Repo } from "./repository/repo.js";

const repo = new Repo();
let isEdit = false;

window.onload = async () => {
    await repo.addCustomersByJSON();
    await showCustomerData();
    await showCounter();
    window.deleteCustomer = deleteCustomer;
    window.updateCustomer = updateCustomer;
};

const popupForm = document.querySelector(".popup-form");
const customerTable = document.querySelector(".table");
const searchForm = document.querySelector(".search");
const counter = document.querySelector(".counter");

popupForm.addEventListener("submit", addCustomer);
searchForm.addEventListener("submit", searchCustomer);

function formToObject(form) {
    const formdata = new FormData(form);
    const data = {};
    for (const [key, value] of formdata) {
        data[key] = value;
    }
    return data;
}

async function showCustomerData() {
    const customers = await repo.getCustomers();
    console.log(customers);
    const customerRows = customers
        .map((customer) => customerToHTMLRow(customer))
        .join(" ");
    customerTable.innerHTML = `
    <tr class="table-headings">
        <th>Customer ID</th>
            <th>Company Name</th>
            <th>Addrees</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th> </th>
    </tr>
    ${customerRows}`;
}

function customerToHTMLRow(customer) {
    return `
    <tr class="table-row">
        <td>${customer.customerId}</td>
        <td>${customer.companyName}</td>
        <td>${customerAddress(customer.address)}</td>
        <td>${customer.contactDetails.firstName} ${
        customer.contactDetails.lastName
    }</td>
        <td>${customer.contactDetails.email}</td>
        <td>${customer.contactDetails.mobile}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updateCustomer('${
                customer.customerId
            }')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deleteCustomer('${
                customer.customerId
            }')"/>
        </td>
    </tr>
    `;
}

function customerAddress(address) {
    return `${address.street}, ${address.city}, ${address.country}`;
}

async function addCustomer(e) {
    e.preventDefault();
    const data = formToObject(e.target);
    const customer = {
        customerId: parseInt(data.customerId),
        companyName: data.companyName,
        address: {
            street: data.street,
            city: data.city,
            country: data.country,
        },
        contactDetails: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: data.mobile,
        }
    };
    if (isEdit) {
        customer.customerId = parseInt(customer.customerId);
        await repo.updateCustomer(customer);
        isEdit = false;
    } else {
        const customers = await repo.getCustomers();
        customer.customerId = customers.length + 1;
        await repo.addCustomer(customer);
    }

    await showCustomerData();
    popupForm.reset();
}

async function deleteCustomer(customerId) {
    await repo.deleteCustomer(parseInt(customerId));
    await showCustomerData();
}

async function updateCustomer(customerId) {
    const customer = await repo.getCustomer(parseInt(customerId));
    document.querySelector("#customerId").value = customer.customerId;
    document.querySelector("#companyName").value = customer.companyName;
    document.querySelector("#street").value = customer.address.street;
    document.querySelector("#city").value = customer.address.city;
    document.querySelector("#country").value = customer.address.country;
    document.querySelector("#firstName").value =
        customer.contactDetails.firstName;
    document.querySelector("#lastName").value =
        customer.contactDetails.lastName;
    document.querySelector("#email").value = customer.contactDetails.email;
    document.querySelector("#mobile").value = customer.contactDetails.mobile;
    isEdit = true;
}

async function searchCustomer(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    let customer = await repo.getCustomerByName(searchInput.companyName);

    console.log(customer);
    customerTable.innerHTML = `
     <tr class="table-headings">
        <th>Customer ID</th>
         <th>Company Name</th>
            <th>Addrees</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th> </th>
    </tr>
    ${customerToHTMLRow(customer)}`;
}

async function showCounter() {
    const customers = await repo.getCustomers();
    const customersCount = customers.length;
    counter.innerHTML = `${customersCount} <span class="counter-desc">Total Customers</span>`;
}
