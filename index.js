const requestURL = 'http://localhost:3000/accoounts';
const requestTimeURL = 'http://localhost:3000/businessHours';
const targetList = document.getElementById('target');
const tragetName = document.getElementById('name');
const targetJob = document.getElementById('job');
const tragetAge = document.getElementById('age');
const tragetEmail = document.getElementById('email');
const delList = document.getElementById('del-pop');
const targetCount = document.getElementById('num');
const countTable = document.getElementById('count-list');
const listCount = document.getElementById('table-count');
const searchInput = document.getElementById('search');
const searchType = document.getElementById('search-type');
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
  try {
    await fetchTimeout(requestURL, {
      timeout: TIME_OUT
    });
    getTime();
  } catch (err) {
    alert(err)
  }
}
checkTime();

async function getTime(){
  try {
    const response = await fetchRequest(requestTimeURL, 'GET');
    const post = await response.json()
    await viewTime(post);
  } catch(err) {
    alert(err)
  }
}

function viewTime(myJson){
  findOpen.innerHTML += `${myJson.open}`
  findClose.innerHTML += `${myJson.close}`
  showGetdata();
}

async function showGetdata() {
  try {
    const response = await fetchRequest(requestURL, 'GET');
    const post = await response.json()
    await setUserNameWithCount(post)
  } catch(err) {
    alert(err)
  }
}

async function addData(){
  const email = tragetEmail.value;
  if (!emailCheck(email)) {
    alert('email을 형식에 맞게 입력하세요.');
  } else {
    if (listCount.rows.length < PAGE_COUNT){
      try {
        await fetchRequest(
          requestURL,
          'POST',
          JSON.stringify({
            id: Number(targetCount.value),
            name: tragetName.value,
            age: Number(tragetAge.value),
            job : targetJob.value,
            email : tragetEmail.value
          }),
        );
        clearView();
      } catch(err) {
        alert(err)
      }
    } else {
      alert(`회원이 ${PAGE_COUNT}명 이상입니다.`);
    }
  }
}


async function onClick(event) {
  if (event.target.getAttribute('class') === 'correction-data') {
    event.target.style.display = "none";
    event.target.nextSibling.style.display = "block";
    const updateTr = event.target.parentNode.parentNode.parentNode.parentNode; 
    const updateInput = updateTr.querySelectorAll('input');
    const noneSpan = updateTr.querySelectorAll('.view-data');
    for (let i = 0; i < updateInput.length; i++) {
      noneSpan[i].style.display = "none"
      updateInput[i].style.display = "inline-block"
      updateInput[i].readOnly  = false;
      updateInput[i].style.border ='1px solid #888',
      updateInput[i].style.background ='#fff'
    }
  } else if (event.target.getAttribute('class') === 'up-data') {
    const updateTr = event.target.parentNode.parentNode.parentNode.parentNode;
    const patchNum = updateTr.firstChild.dataset.index;
    const upName = updateTr.querySelector('#up-name');
    const upAge = updateTr.querySelector('#up-age');
    const upJob = updateTr.querySelector('#up-job');
    const upemail = updateTr.querySelector('#up-email');
    event.target.style.display = "none";
    event.target.previousSibling .style.display = "block";
    try {
      await fetchRequest(
        `${requestURL}/${Number(patchNum)}`, "PUT",
        JSON.stringify({
          id: Number(targetCount.value),
          name : upName.value,
          age : Number(upAge.value),
          job : upJob.value,
          email : upemail.value
        })
      )
      clearView();
      alert("수정이 완료되었습니다.");
    } catch(err) {
      alert(err)
    }
  }
}

async function deleteData(num) {
  delList.style.display = 'none';
  try {
    await fetchRequest(`${requestURL}/${num}`, "DELETE")
    clearView();
  } catch(err) {
    alert(err)
  }
}

function findName(targetNum) {
  const delName = document.querySelector(`.target-name${targetNum}`);
  const delId = delName.previousSibling.dataset.index
  const delNameval = document.querySelector(`.target-name${targetNum} > input`);
  delList.style.display = 'block';
  delList.innerHTML = `<p>${delNameval.value} 님을 삭제하시겠습니까?</p><div><button type="button" onclick="deleteData(${delId})" class="y-btn">예</button><button type="button" class="n-btn">아니요</button></div>`
  const delPop = document.querySelector('.n-btn');
  delPop.onclick = function () {
    delList.style.display = 'none';
  }
}

async function importingDC(val) {
  if (searchType.value === '' || searchType.value === '선택') {
    alert("분류를 선택하세요"); 
  } else {
    targetList.innerHTML = '';
    let response;
    try {
      if(searchType.value === 'age' || searchType.value === 'job'){
        response = await fetchRequest(`http://localhost:3000/accoounts/?${searchType.value}=${val}`, 'GET');
      }else{
        response = await fetchRequest(`http://localhost:3000/accoounts/?${searchType.value}_like=${val}`, 'GET')
      }
      const post = await response.json()
      await showSearchResult(post, val);
    } catch (err) {
      alert(err);
      countTable.innerHTML = listCount.rows.length;
    }
  }
}

function showSearchResult(arrData, val) {
  let k = 1;
  for (let i = 0; i < arrData.length; i++) {
    if (searchType.value === "name") {
      const name = arrData[i].name.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += `<tr><td data-index=${arrData[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${name}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td><td><span class="view-data">${arrData[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td><td><span class="view-data">${arrData[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td><td><div class="button-box"><span><span class="view-data">${arrData[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findNamepop(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
    } else if (searchType.value === "email") {
      const email = arrData[i].email.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML +=  `<tr><td data-index=${arrData[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${arrData[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td><td><span class="view-data">${arrData[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td><td><span class="view-data">${arrData[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td><td><div class="button-box"><span><span class="view-data">${email}</span><input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findNamepop(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
    } else if (searchType.value === "age") {
      const stringVal = val.toString();
      const age = arrData[i].age.toString().replace(stringVal,`<span style="color: blue;">${stringVal}</span>`)
      targetList.innerHTML += `<tr><td data-index=${arrData[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${arrData[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td><td><span class="view-data">${age}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td><td><span class="view-data">${arrData[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td><td><div class="button-box"><span><span class="view-data">${arrData[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findNamepop(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
    } else {
      const job = arrData[i].job.replace(val,`<span style="color: blue;">${val}</span>`)
      targetList.innerHTML += `<tr><td data-index=${arrData[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${arrData[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${arrData[i].name}"></td><td><span class="view-data">${arrData[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${arrData[i].age}"></td><td><span class="view-data">${job}</span><input class="correction-input" id="up-job" type="text" readonly value="${arrData[i].job}"></td><td><div class="button-box"><span><span class="view-data">${arrData[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${arrData[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findNamepop(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
    }
    k++;
  }
  if (listCount.rows.length === 0) {
    throw new Error('회원이 존재하지 않습니다.');
  }
  countTable.innerHTML = listCount.rows.length;
}

async function fetchRequest(infoURL, form, bodys){
  return await fetch(infoURL, {
    method: form,
    headers: {"Content-Type": "application/json"},
    body: bodys
  })
}

function setUserNameWithCount(myJson){
  let j = 1;
  for (let i = 0; i < myJson.length; i++) {
    if (myJson.length - 1 === i) {
      targetCount.value = Number(myJson[i].id) + 1;
    }
    targetList.innerHTML += `<tr><td data-index=${myJson[i].id}>${j}</td><td class="target-name${i}"><span class="view-data">${myJson[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${myJson[i].name}"></td><td><span class="view-data">${myJson[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${myJson[i].age}"></td><td><span class="view-data">${myJson[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${myJson[i].job}"></td><td><div class="button-box"><span><span class="view-data">${myJson[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${myJson[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
    j++;
  }
  countTable.innerHTML = listCount.rows.length;
}

function showValue(target) {
  searchType.value = target.value;
}

function emailCheck(email) {
  const regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email !== '' && email !== 'undefined' && regex.test(email));
}

function clearView(){
  targetList.innerHTML = '';
  showGetdata();
}

document.addEventListener('click', onClick)



