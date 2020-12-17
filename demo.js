const myList = document.getElementById("list");
const doneList = document.getElementById("donelist");

let todo = [];
let todone = [];

let temp;
let count = 0,
  countDone = 0,
  x = 0,
  y = 0;

get_count();
get_list();

function save_count() {
  const localCount = count ?? 0;
  const localCountDone = countDone ?? 0;
  localStorage.setItem("count", localCount);
  localStorage.setItem("countDone", localCountDone);
}

function get_count() {
  const localCount = localStorage.getItem("count");
  const localCountDone = localStorage.getItem("countDone");
  count = localCount;
  countDone = localCountDone;
}

function save_list() {
  const str = JSON.stringify(todo);
  const str1 = JSON.stringify(todone);
  localStorage.setItem("todo", str);
  localStorage.setItem("todone", str1);
}

function get_list() {
  const str = localStorage.getItem("todo");
  const str1 = localStorage.getItem("todone");

  todo = JSON.parse(str);
  todone = JSON.parse(str1);

  if (!todo) {
    todo = [];
  }
  if (!todone) {
    todone = [];
  }
}

let todoCount = count;
let todoneCount = countDone;

while (todoCount > 0) {
  additem_todo("todo");
  --todoCount;
}

while (todoneCount > 0) {
  additem_todo("todone");
  --todoneCount;
}

function additem_whenenter(e) {
  if (e.keyCode === 13 && e.target.value) {
    additem_todo("new");
  }
}

function display_title() {
  if (count == 0) {
    document.getElementById("noitem").style.display = "block";
  }
  if (count == 1) {
    document.getElementById("noitem").style.display = "none";
  }
  if (countDone == 0) {
    document.getElementById("doneitem").style.display = "block";
  }
  if (countDone == 1) {
    document.getElementById("doneitem").style.display = "none";
  }
}

function additem_todo(flag) {
  const item = document.createElement("li");
  const span = document.createElement("span");
  const check = document.createElement("input");
  const spanimg = document.createElement("span");
  item.appendChild(check);

  item.appendChild(spanimg);
  item.appendChild(span);

  check.setAttribute("type", "checkbox");
  check.classList.add("check-item");
  span.classList.add("list-item");
  spanimg.classList.add("glyphicon");
  spanimg.classList.add("glyphicon-remove");

  if (flag == "todo") {
    const itemContent = todo[x];

    span.innerHTML = itemContent;
    myList.appendChild(item);

    x++;

    document.getElementById("noitem").style.display = "none";
  } else if (flag == "todone") {
    const itemContent = todone[y];

    check.checked = true;
    span.innerHTML = itemContent;
    doneList.appendChild(item);

    y++;

    document.getElementById("doneitem").style.display = "none";
  } else {
    const itemContent = document.getElementById("itemname");

    todo.push(itemContent.value);
    span.innerHTML = itemContent.value;
    myList.appendChild(item);
    itemContent.value = "";

    count++;

    save_list();
    save_count();
    display_title();
  }

  check.addEventListener("change", function () {
    const doneItem = this.parentElement;
    temp = span.dataset.oldValue || span.innerHTML;

    if (myList.id == doneItem.parentElement.id) {
      checkChange("todo", myList, doneList, doneItem);
    } else {
      checkChange("doneList", doneList, myList, doneItem);
    }

    save_list();
    save_count();
    display_title();
  });

  span.addEventListener("dblclick", function () {
    const changeble = span.dataset.changeble;

    if (!changeble) {
      let data = this.textContent;
      const parent = this.parentElement;
      const form = document.createElement("div");
      const text = document.createElement("input");
      const ok = document.createElement("button");
      const cancel = document.createElement("button");
      const oldValue = span.textContent;

      ok.innerText = "OK";
      text.value = oldValue;
      text.classList.add("text");
      cancel.innerText = "Cancel";
      text.dataset.value = oldValue;

      form.appendChild(text);
      form.appendChild(ok);
      form.appendChild(cancel);

      span.dataset.oldValue = oldValue;
      span.dataset.changeble = true;
      span.innerHTML = "";
      span.appendChild(form);

      ok.addEventListener("click", function () {
        const value = text.dataset.value;

        for (let i = 0; i < todo.length; i++) {
          if (data == todo[i]) {
            todo[i] = value;
          }
        }
        for (let i = 0; i < todone.length; i++) {
          if (data == todone[i]) {
            todone[i] = value;
          }
        }

        save_list();
        saveElement(value);
      });

      cancel.addEventListener("click", () => saveElement(data));

      text.addEventListener("input", (e) => {
        text.dataset.value = e.target.value;
      });

      function saveElement(value) {
        span.removeChild(form);
        span.textContent = value;
        parent.appendChild(span);

        span.dataset.oldValue = value;
        delete span.dataset.changeble;
      }
    }
  });

  spanimg.addEventListener("click", function () {
    const removeItem = this.parentElement;
    temp = span.dataset.oldValue || span.innerHTML;

    if (myList.id == this.parentElement.parentElement.id) {
      removeItemByList("todo", removeItem);
    } else {
      removeItemByList("doneList", removeItem);
    }

    save_list();
    save_count();
    display_title();
  });

  function removeItemByList(type, removeItem) {
    const isTypeTodo = type === "todo";
    const list = isTypeTodo ? myList : doneList;
    const iterableList = isTypeTodo ? todo : todone;

    list.removeChild(removeItem);

    if (isTypeTodo) {
      count--;
    } else {
      countDone--;
    }

    for (let i = 0; i < iterableList.length; i++) {
      if (temp == iterableList[i]) iterableList.splice(i, 1);
    }
  }

  function checkChange(type, removeList, addList, doneItem) {
    const isTypeTodo = type === "todo";
    const list = isTypeTodo ? todo : todone;

    removeList.removeChild(doneItem);
    span.innerHTML = temp;
    addList.appendChild(item);

    delete span.dataset.changeble;
    delete span.dataset.oldValue;

    if (isTypeTodo) {
      count--;
      countDone++;

      todone.push(temp);
    } else {
      count++;
      countDone--;

      todo.push(temp);
    }

    for (let i = 0; i < list.length; i++) {
      if (temp == list[i]) list.splice(i, 1);
    }
  }
}

function remove_list(id) {
  const root = document.getElementById(id);

  while (root.firstChild) {
    root.removeChild(document.getElementById(id).firstChild);
  }

  if (myList.id == id) {
    todo = [];
    count = 0;
  } else {
    todone = [];
    countDone = 0;
  }
  save_list();
  save_count();
  display_title();
}
