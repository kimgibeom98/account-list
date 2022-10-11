'use strict'

const END_POINT = 'http://localhost'
const PORT = 3000
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
const TIME_OUT = 5000;
const PAGE_COUNT = 15;

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
    await fetchTimeout(getEndpoint("/accoounts"), {
      timeout: 2000
    });
    getTime();
}

async function showGetdata() {
    const response = await fetchRequest("/accoounts", 'GET');
    const accounts = await response.json()
    showUserlistWithCount(accounts);
}


async function getTime() {
    const response = await fetchRequest("/businessHours", 'GET');
    const accounts = await response.json()
    showAPITime(accounts)  
}

function showAPITime(arrData) {
  findOpen.innerHTML += `${arrData.open}`
  findClose.innerHTML += `${arrData.close}`
  showGetdata();
}

async function dataExceptionHandling(fn){
  try {
    await fn();
  } catch(err) {
    alert(err)
  }
}

async function fetchRequest(infoURL, method, body) {
  try{
    return await fetch(getEndpoint(infoURL), {
      method,
      headers: {"Content-Type": "application/json"},
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
    if (listCount.rows.length < PAGE_COUNT){
        await fetchRequest(
          "/accoounts",
          'POST',
          JSON.stringify({
            id: Number(targetCount.value),
            name: tragetName.value,
            age: Number(tragetAge.value),
            job : targetJob.value,
            email : tragetEmail.value
          }),
        );
        latestDatashow();
    } else {
      alert(`회원이 ${PAGE_COUNT}명 이상입니다.`);
    }
  }
}

function entcrValueWithstyleChange(targetId){
  const findTargetid = document.querySelector(`#data-value${targetId}`);
  const updateTr = findTargetid.parentElement;
  const noneCorrectionbtn = updateTr.querySelector('.correction-data'); 
  noneCorrectionbtn.style.display = "none"
  noneCorrectionbtn.nextElementSibling.style.display = "block"; 
  const updateInput = updateTr.querySelectorAll('.correction-input');
  const noneSpan = updateTr.querySelectorAll('.view-data');
  for (let i = 0; i < updateInput.length; i++) {
    noneSpan[i].style.display = "none"
    updateInput[i].style.cssText = "display : block; border: 1px solid #888; background: #fff";
    updateInput[i].readOnly  = false;
  }
}

async function reviseDataWithstyleChange(targetId){
    const findTargetid = document.querySelector(`#data-value${targetId}`);
    const updateTr = findTargetid.parentElement;
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
          name : upName.value,
          age : Number(upAge.value),
          job : upJob.value,
          email : upemail.value
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

function findNamepop(targetId) {
  const delName = document.querySelector(`#data-value${targetId}`);
  const findDelname = delName.nextElementSibling.querySelector('.view-data')
  delList.style.display = 'block';
  delList.innerHTML = `
  <p>${findDelname.innerText} 님을 삭제하시겠습니까?</p>
  <div>
    <button type="button" onclick="deleteData(${targetId});" class="y-btn">예</button>
    <button type="button" class="n-btn">아니요</button>
  </div>`;
  const delPop = document.querySelector('.n-btn');
  delPop.onclick = function () {
    delList.style.display = 'none';
  }
}

async function importingDC() {
  if (searchType.value === '' || searchType.value === '선택') {
    alert("분류를 선택하세요"); 
  } else {
    targetList.innerHTML = '';
      const response = (searchType.value === 'age' || searchType.value === 'job') ? await fetchRequest(`/accoounts/?${searchType.value}=${searchInput.value}`, 'GET') : await fetchRequest(`/accoounts/?${searchType.value}_like=${searchInput.value}`, 'GET')
      const accounts = await response.json()
      countTable.innerHTML = listCount.rows.length;
      showSearchResult(accounts, searchInput.value);
  }
}

function showSearchResult(arrData, val) {
  if (arrData.length === 0) {
    throw new Error('회원이 존재하지 않습니다.');
  }
  for (let i = 0; i < arrData.length; i++) {
    const commonTag = function(hghiName, hghiAge, hghiJob, hghiEmail) {return ` 
    <tr>
      <td id="data-value${arrData[i].id}">${i + 1}</td>
      <td class="target-name${i}"><span class="view-data">${hghiName}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td>
      <td><span class="view-data">${hghiAge}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td>
      <td><span class="view-data">${hghiJob}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td>
      <td>
        <div class="button-box">
          <span>
            <span class="view-data">${hghiEmail}</span>
            <input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}">
          </span>
          <div>
            <button class="correction-data" onclick="entcrValueWithstyleChange(${arrData[i].id});" type="button">수정</button>
            <button class="up-date" onclick="reviseDataWithstyleChange(${arrData[i].id});" type="button">완료</button>
            <button onclick="findNamepop(${arrData[i].id})" type="button" class="del-btn">삭제</button>
          </div>
        </div>
      </td>
    </tr>`;} 
    if (searchType.value === "name") {
      const name = arrData[i].name.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += commonTag(name, arrData[i].age, arrData[i].job, arrData[i].email)
    } else if (searchType.value === "age") {
      const stringVal = val.toString();
      const age = arrData[i].age.toString().replace(stringVal,`<span style="color: blue;">${stringVal}</span>`)
      targetList.innerHTML += commonTag(arrData[i].name, age, arrData[i].job, arrData[i].email) ;
    } 
    else if (searchType.value === "job") {
      const job = arrData[i].job.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += commonTag(arrData[i].name, arrData[i].age, job, arrData[i].email);
    } else {
      const email = arrData[i].email.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += commonTag(arrData[i].name, arrData[i].age, arrData[i].job, email)
    }
  }
  countTable.innerHTML = listCount.rows.length;
}
function getEndpoint(endpoint) {
  return `${END_POINT}:${PORT}${endpoint}`
}

function showUserlistWithCount(arrData) {
  let innerTag = '';
  for (let i = 0; i < arrData.length; i++) {
    if (arrData.length - 1 === i) {
      targetCount.value = Number(arrData[i].id) + 1;
    }
    innerTag += `
    <tr>
      <td id="data-value${arrData[i].id}">${i + 1}</td>
      <td class="target-name${i}"><span class="view-data">${arrData[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td>
      <td><span class="view-data">${arrData[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td>
      <td><span class="view-data">${arrData[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td>
      <td>
        <div class="button-box">
          <span>
            <span class="view-data">${arrData[i].email}</span>
            <input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}">
          </span>
          <div>
            <button class="correction-data" onclick="entcrValueWithstyleChange(${arrData[i].id});" type="button">수정</button>
            <button class="up-date" onclick="reviseDataWithstyleChange(${arrData[i].id});" type="button">완료</button>
            <button onclick="findNamepop(${arrData[i].id});" type="button" class="del-btn">삭제</button>
          </div>
        </div>
      </td>
    </tr>`;
  }
  targetList.innerHTML = innerTag;
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

checkTime();