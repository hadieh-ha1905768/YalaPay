import { Repo } from "./repository/repo.js";

const repo = new Repo();

window.onload = async () => {
    await repo.addChequesByJSON();
    await repo.addInvoicesByJSON()
    await showInvoiceBox();
    await showChequeBox();
};

const invoiceBox = document.querySelector(".invoices");
const chequeBox = document.querySelector(".cheques");

async function showInvoiceBox(){
    const invoices = await repo.getInvoices();
    //todays date
    const currentDate = new Date();
    const today = currentDate.toJSON().slice(0,10);
    //due in 30 days
    currentDate.setDate(new Date().getDate()+30);
    const afterToday = currentDate.toJSON().slice(0,10);
    const withinThirtyInvoices = invoices.filter((invoice) => invoice.dueDate >= today && invoice.dueDate <= afterToday)
    //due in more than 30 days
    currentDate.setDate(new Date().getDate());
    const afterMonth = currentDate.toJSON().slice(0,10);
    const afterThirtyInvoices = invoices.filter((invoice) => invoice.dueDate >= afterMonth);
    invoiceBox.innerHTML = `
    <h1 class="dash-title">invoices</h1>
    <div class="card">
        <h3 class="card-title">All</h3>
        <p class="amount green">${sumAmounts(invoices)} <span> QR</span></p>
    </div>
    <div class="card">
        <h3 class="card-title">Due within 30 days</h3>
        <p class="amount purple">${sumAmounts(withinThirtyInvoices)} <span> QR</span></p>
    </div>
    <div class="card">
        <h3 class="card-title">Due in more than 30 days</h3>
        <p class="amount red">${sumAmounts(afterThirtyInvoices)} <span> QR</span></p>
    </div>
    `
}


async function showChequeBox(){
    const cheques = await repo.getCheques();
    const awaitingCheques = cheques.filter((cheque) => cheque.status === "Awaiting");
    const depositedCheques = cheques.filter((cheque) => cheque.status === "Deposited");
    const cashedCheques = cheques.filter((cheque) => cheque.status === "Cashed");
    const returnedCheques = cheques.filter((cheque) => cheque.status === "Returned");
    chequeBox.innerHTML = `
    <h1 class="dash-title">Cheques</h1>
            <div class="card">
                <h3 class="card-title">Awaiting</h3>
                <p class="amount yellow">${sumAmounts(awaitingCheques)} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Depotised</h3>
                <p class="amount purple">${sumAmounts(depositedCheques)} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Cashed</h3>
                <p class="amount green">${sumAmounts(cashedCheques)} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Returned</h3>
                <p class="amount red">${sumAmounts(returnedCheques)} <span> QR</span></p>
            </div>
    `
}

function sumAmounts(items){
    let sum = 0;
    for (const item of items) {
        sum += item.amount;
    }
    return sum;
}