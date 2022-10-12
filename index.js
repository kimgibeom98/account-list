'use strict'

const END_POINT = 'http://localhost'
const PORT = 3000
const TIME_OUT = 5000;
const PAGE_COUNT = 15;
const targetList = document.getElementById('target');
const tragetName = document.getElementById('name');
const targetJob = document.getElementById('job');
const tragetAge = document.getElementById('age');
const tragetEmail = document.getElementById('email');
const delList = document.getElementById('del-pop');
const targetCount = document.getElementById('num');
const countTable = document.getElementById('count-list');
const listCount = document.getElementById('table-count');
const searchType = document.getElementById('search-type');
const searchInput = document.getElementById('search');
const findOpen = document.getElementById('open-time');
const findClose = document.getElementById('close-time');
const timeBox = document.querySelector('.time-box');
let accounts;

async function fetchTimeout(resource, options = {}) {
    const { timeout = TIME_OUT } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

async function checkTime() {
  try{
    await fetchTimeout(getEndpoint("/accoounts"), {
      timeout: 2000
    });
    getTime();
  } catch {
    timeBox.style.display = 'none';   
    alert('API 요청에 실패했습니다.')
  }
}

async function showGetdata() {
  const response = await fetchRequest("/accoounts", 'GET');
  accounts = await response.json()
  render();
}


async function getTime() {
  const response = await fetchRequest("/businessHours", 'GET');
  accounts = await response.json()
  showAPITime(accounts)
}

function showAPITime(arrData) {
  findOpen.innerHTML += `${arrData.open}`
  findClose.innerHTML += `${arrData.close}`
  showGetdata();
}

async function dataExceptionHandling(fn) {
  try {
    await fn();
  } catch (err) {
    alert(err)
  }
}

async function fetchRequest(infoURL, method, body) {
  try {
    return await fetch(getEndpoint(infoURL), {
      method,
      headers: { "Content-Type": "application/json" },
      body
    })
  } catch {
    alert('API 요청에 실패했습니다.')
  }
}



async function addData() {
  const email = tragetEmail.value;
  if (!emailCheck(email)) {
    alert('email을 형식에 맞게 입력하세요.');
  } else {
    if (listCount.rows.length < PAGE_COUNT) {
      await fetchRequest(
        "/accoounts",
        'POST',
        JSON.stringify({
          id: Number(targetCount.value),
          name: tragetName.value,
          age: Number(tragetAge.value),
          job: targetJob.value,
          email: tragetEmail.value
        }),
      );
      latestDatashow();
    } else {
      alert(`회원이 ${PAGE_COUNT}명 이상입니다.`);
    }
  }
}

function activateInput(targetId) {
  const findDataset = document.querySelector(`[data-index="${targetId}"]`)
  const updateTr = findDataset.parentElement;
  const noneCorrectionbtn = updateTr.querySelector('.correction-data');
  const updateInput = updateTr.querySelectorAll('.correction-input');
  const noneSpan = updateTr.querySelectorAll('.view-data');
  noneCorrectionbtn.style.display = "none"
  noneCorrectionbtn.nextElementSibling.style.display = "block";
  for (let i = 0; i < updateInput.length; i++) {
    noneSpan[i].style.display = "none"
    updateInput[i].style.cssText = "display : block; border: 1px solid #888; background: #fff";
    updateInput[i].readOnly = false;
  }
}

async function updateMemember(targetId) {
  const findDataset = document.querySelector(`[data-index="${targetId}"]`)
  const updateTr = findDataset.parentElement;
  const noneUpdatebtn = updateTr.querySelector('.up-date');
  const upName = updateTr.querySelector('#up-name');
  const upAge = updateTr.querySelector('#up-age');
  const upJob = updateTr.querySelector('#up-job');
  const upemail = updateTr.querySelector('#up-email');
  noneUpdatebtn.style.display = "none";
  noneUpdatebtn.previousElementSibling.style.display = "block";
  await fetchRequest(
    `${"/accoounts"}/${Number(targetId)}`, "PUT",
    JSON.stringify({
      id: Number(targetCount.value),
      name: upName.value,
      age: Number(upAge.value),
      job: upJob.value,
      email: upemail.value
    })
  )
  latestDatashow();
  alert("수정이 완료되었습니다.");
}

async function deleteData(num) {
  delList.style.display = 'none';
  await fetchRequest(`${"/accoounts"}/${num}`, "DELETE")
  latestDatashow();
}

function getmodalTemplate(findDelname, targetId){
  return  `
  <p>${findDelname.innerText} 님을 삭제하시겠습니까?</p>
  <div>
    <button type="button" onclick="deleteData(${targetId});" class="y-btn">예</button>
    <button type="button" onclick="modalRemove();" class="n-btn">아니요</button>
  </div>`;
}

function findNamemodal(targetId) {
  const delName = document.querySelector(`[data-index="${targetId}"]`)
  const findDelname = delName.nextElementSibling.querySelector('.view-data')
  delList.style.display = 'block';
  delList.innerHTML = getmodalTemplate(findDelname, targetId)
}

function modalRemove(){
  delList.style.display = 'none';
}

async function getAccountList() {
  const params = (searchType.value === 'age' || searchType.value === 'job')
    ? `?${searchType.value}=${searchInput.value}`
    : `?${searchType.value}_like=${searchInput.value}`;

  const response = await fetchRequest(`/accoounts/${params}`, 'GET');
  accounts = await response.json();

  return accounts;
}

async function importDC() {
  if (searchType.value === '' || searchType.value === '선택') {
    alert("분류를 선택하세요");
  } else {
    targetList.innerHTML = '';
    accounts = await getAccountList();
    showSearchResult(searchInput.value);
  }
}

function showSearchResult(val) {
  if (accounts.length === 0) {
    countTable.innerHTML = listCount.rows.length;
    throw new Error('회원이 존재하지 않습니다.');
  }
  for (let i = 0; i < accounts.length; i++) {
    const listTemplate = function (hghiName, hghiAge, hghiJob, hghiEmail) {
      return ` 
    <tr>
      <td data-index="${accounts[i].id}">${i + 1}</td>
      <td class="target-name${i}"><span class="view-data">${hghiName}</span><input class="correction-input" id="up-name" type="text" readonly value="${accounts[i].name}"></td>
      <td><span class="view-data">${hghiAge}</span><input class="correction-input" id="up-age" type="text" readonly value="${accounts[i].age}"></td>
      <td><span class="view-data">${hghiJob}</span><input class="correction-input" id="up-job" type="text" readonly value="${accounts[i].job}"></td>
      <td>
        <div class="button-box">
          <span>
            <span class="view-data">${hghiEmail}</span>
            <input class="correction-input" id="up-email" type="text" readonly value="${accounts[i].email}">
          </span>
          <div>
            <button class="correction-data" onclick="activateInput(${accounts[i].id});" type="button">수정</button>
            <button class="up-date" onclick="updateMemember(${accounts[i].id});" type="button">완료</button>
            <button onclick="findNamemodal(${accounts[i].id})" type="button" class="del-btn">삭제</button>
          </div>
        </div>
      </td>
    </tr>`;
    }
    if (searchType.value === "name") {
      const name = accounts[i].name.replace(val, `<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += listTemplate(name, accounts[i].age, accounts[i].job, accounts[i].email)
    } else if (searchType.value === "age") {
      const stringVal = val.toString();
      const age = accounts[i].age.toString().replace(stringVal, `<span style="color: blue;">${stringVal}</span>`)
      targetList.innerHTML += listTemplate(accounts[i].name, age, accounts[i].job, accounts[i].email);
    }
    else if (searchType.value === "job") {
      const job = accounts[i].job.replace(val, `<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += listTemplate(accounts[i].name, accounts[i].age, job, accounts[i].email);
    } else {
      const email = accounts[i].email.replace(val, `<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += listTemplate(accounts[i].name, accounts[i].age, accounts[i].job, email)
    }
  }
  countTable.innerHTML = listCount.rows.length;
}

function getEndpoint(endpoint) {
  return `${END_POINT}:${PORT}${endpoint}`
}


function render() {
  let documentFragment = '';
  for (let i = 0; i < accounts.length; i++) {
    if (accounts.length - 1 === i) {
      targetCount.value = Number(accounts[i].id) + 1;
    }
    documentFragment += `
    <tr>
      <td data-index="${accounts[i].id}">${i + 1}</td>
      <td class="target-name${i}"><span class="view-data">${accounts[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${accounts[i].name}"></td>
      <td><span class="view-data">${accounts[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${accounts[i].age}"></td>
      <td><span class="view-data">${accounts[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${accounts[i].job}"></td>
      <td>
        <div class="button-box">
          <span>
            <span class="view-data">${accounts[i].email}</span>
            <input class="correction-input" id="up-email" type="text" readonly value="${accounts[i].email}">
          </span>
          <div>
            <button class="correction-data" onclick="activateInput(${accounts[i].id});" type="button">수정</button>
            <button class="up-date" onclick="updateMemember(${accounts[i].id});" type="button">완료</button>
            <button onclick="findNamemodal(${accounts[i].id});" type="button" class="del-btn">삭제</button>
          </div>
        </div>
      </td>
    </tr>`;
  }
  targetList.innerHTML = documentFragment;
  countTable.innerHTML = listCount.rows.length;
}

function setSearchTypeValue(target) {
  searchType.value = target.value;
}

function emailCheck(email) {
  const regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email !== '' && email !== 'undefined' && regex.test(email));
}

function latestDatashow() {
  targetList.innerHTML = '';
  showGetdata();
}

// initalize(); // 최초에 한번만 실행되는 함수 //getTime
checkTime();
// render(); // 전역 선언된  data를가지고 화면을 뿌려주는함수 