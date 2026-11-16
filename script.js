const form = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const list = document.querySelector("#expense-list");
const totalDisplay = document.querySelector("#total");
const emptyState = document.querySelector("#empty-state");

let expenses = JSON.parse(localStorage.getItem("personalExpenses") || "[]");
const money = value => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR"
}).format(value);

function save() {
  localStorage.setItem("personalExpenses", JSON.stringify(expenses));
  render();
}

function render() {
  list.innerHTML = "";
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalDisplay.textContent = money(total);

  expenses.forEach(expense => {
    const item = document.createElement("li");
    const detail = document.createElement("div");
    detail.className = "detail";

    const name = document.createElement("strong");
    name.textContent = expense.description;
    const category = document.createElement("small");
    category.textContent = expense.category;
    detail.append(name, category);

    const amount = document.createElement("span");
    amount.className = "amount";
    amount.textContent = money(expense.amount);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${expense.description}`);
    remove.addEventListener("click", () => {
      expenses = expenses.filter(entry => entry.id !== expense.id);
      save();
    });

    item.append(detail, amount, remove);
    list.append(item);
  });
  emptyState.hidden = expenses.length > 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  if (!description || !Number.isFinite(amount) || amount <= 0) return;

  expenses.unshift({
    id: Date.now(),
    description,
    amount: Math.round(amount * 100) / 100,
    category: categoryInput.value
  });
  form.reset();
  save();
});

render();
