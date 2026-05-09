
const menuDashboard =
document.getElementById("menuDashboard");
const menuInsights =
document.getElementById("menuInsights");
const menuRelatorios =
document.getElementById("menuRelatorios");
const areaDashboard =
document.getElementById("areaDashboard");
const areaInsights =
document.getElementById("areaInsights");
const areaRelatorios =
document.getElementById("areaRelatorios");
menuDashboard.onclick = () => {
    areaDashboard.style.display = "block";
    areaInsights.style.display = "none";
    areaRelatorios.style.display = "none";};
menuInsights.onclick = () => {
    areaDashboard.style.display = "none";
    areaInsights.style.display = "block";
    areaRelatorios.style.display = "none";};
menuRelatorios.onclick = () => {
    areaDashboard.style.display = "none";
    areaInsights.style.display = "none";
    areaRelatorios.style.display = "block";};
const tbody =
document.querySelector("tbody");
const descItem =
document.querySelector("#desc");
const amount =
document.querySelector("#amount");
amount.addEventListener(
    "input",
    formatCurrency
);
const type =
document.querySelector("#type");
const category =
document.querySelector("#category");
const btnNew =
document.querySelector("#btnNew");
const incomes =
document.querySelector(".incomes");
const expenses =
document.querySelector(".expenses");
const total =
document.querySelector(".total");
const insightsArea =
document.querySelector("#insights");
amount.addEventListener(
    "input",
    formatCurrency);
function formatCurrency(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value === "") {
        e.target.value = "";
        return;
    }
    value = parseInt(value, 10);
    value = (value / 100).toFixed(2);
    value = value.replace(".", ",");
    value = value.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ".");
    e.target.value = value;}
let items;
btnNew.onclick = () => {
    if (
        descItem.value === "" ||
        amount.value === "" ||
        type.value === "" ||
        type.value === "Selecione o tipo" ||
        category.value === ""
    ) {return alert("Preencha todos os campos!");}
    items.push({
        desc: descItem.value,
        amount: Number(
            amount.value
                .replace(/\./g, "")
                .replace(",", ".")
        ).toFixed(2),
        type: type.value,
        category: category.value,});
    setItensBD();
    loadItens();
    descItem.value = "";
    amount.value = "";
    type.value = "Selecione o tipo";
    category.value = "";};
function deleteItem(index) {
    items.splice(index, 1);
    setItensBD();
    loadItens();}
window.deleteItem = deleteItem;
function insertItem(item, index) {
    const tr =
    document.createElement("tr");
    tr.innerHTML = `
        <td>${item.desc}</td>
        <td>${item.category}</td>
        <td>${Number(item.amount).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"})}</td>
        <td>${
                item.type === "Entrada"
                ? "🟢 Entrada"
                : "🔴 Saída"}</td>
        <td>
            <button
                class="buttonDelete"
                onclick="deleteItem(${index})">
                X
            </button>
        </td>
    `;
    tbody.appendChild(tr);}
function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);});
    getTotals();}
function getTotals() {
    const amountIncomes = items
        .filter(
            (item) =>
            item.type === "Entrada")
        .map(
            (transaction) =>
            Number(transaction.amount));
    const amountExpenses = items
        .filter(
            (item) =>
            item.type === "Saída" || item.type === "Despesa")
        .map(
            (transaction) =>
            Number(transaction.amount));
    const totalIncomes = amountIncomes
        .reduce(
            (acc, cur) => acc + cur,
            0);
    const totalExpenses = amountExpenses
        .reduce(
            (acc, cur) => acc + cur,
            0);
    const totalItems =
        totalIncomes - totalExpenses;
    incomes.innerHTML =
        totalIncomes.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"});
    expenses.innerHTML =
        totalExpenses.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"});
    total.innerHTML =
        totalItems.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"});
    gerarInsights(
        totalIncomes,
        totalExpenses,
        totalItems);}
function gerarInsights(
    receitas,
    gastos,
    saldo
){
    insightsArea.innerHTML = "";
    if(gastos > receitas){
        insightsArea.innerHTML += `
            <p>Seus gastos estão maiores que suas entradas.</p>`;
    }
    if(saldo > 0){
        insightsArea.innerHTML += `
            <p>Seu saldo atual está positivo.</p>`;
    }
    if(gastos > receitas * 0.7){
        insightsArea.innerHTML += `
            <p> Você pode economizar reduzindo despesas. </p>`;
    }
    if(gastos < receitas * 0.5){
        insightsArea.innerHTML += `
            <p>Excelente controle financeiro.</p>`;
    }
}
const getItensBD = () =>
    JSON.parse(
        localStorage.getItem("db_items")
    ) ?? [];
const setItensBD = () =>
    localStorage.setItem(
        "db_items",
        JSON.stringify(items));
loadItens();
