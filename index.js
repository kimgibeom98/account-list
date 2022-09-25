const requestURL = 'http://localhost:3000/accoounts'
const requestTimeurl = 'http://localhost:3000/businessHours'
const targetList = document.getElementById('target');
const tragetName = document.getElementById('name')
const targetJob = document.getElementById('job')
const tragetAge = document.getElementById('age')
const tragetEmail = document.getElementById('email')
const delList = document.getElementById('del-pop');
const targetCount = document.getElementById('num');
const countTable = document.getElementById('count-list');
const listCount = document.getElementById('table-count');
const searchInput = document.getElementById('search');
const searchType = document.getElementById('search-type');
const list = document.getElementById('target');
const findOpen = document.getElementById('open-time');
const findClose = document.getElementById('close-time');
let count = 0;

async function getTime(){
  try{
    const data = await fetch(requestTimeurl, {
      method: 'GET'
    })
    const countTime = setInterval(function(){
      count ++;
      if(count === 5){
        alert('응답시간이 5초가 지났습니다.');
        clearInterval(countTime);
      }
    },1000);
    const post = await data.json()
    await viewTime(post);
    clearInterval(countTime);
  }catch(err){

  }
}
function viewTime(myJson){
  findOpen.innerHTML += `${myJson.open}`
  findClose.innerHTML += `${myJson.close}`
}
async function getData() {
    try{
      const data = await fetchOption();
      const countTime = setInterval(function(){
        count ++;
        if(count === 5){
          alert('응답시간이 5초가 지났습니다.');
          clearInterval(countTime);
        }
      },1000);
      const post = await data.json()
      await setUserName(post)
      clearInterval(countTime);
    }catch(err){
        alert(err);
    }
}
getData();
getTime();

function fetchOption(){
  return fetch(requestURL, {
    method: 'GET',
  })
}
function setUserName(myJson){
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

async function postData(event) {
  if (event.target.getAttribute('class') === 'submit-btn') {
    let email = tragetEmail.value;
    if(!emailCheck(email)){
      alert('email을 형식에 맞게 입력하세요.');
    }else{
      if(listCount.rows.length < 15){
        try{
          await fetch(requestURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: Number(targetCount.value),
              name: tragetName.value,
              age: Number(tragetAge.value),
              job : targetJob.value,
              email : tragetEmail.value
            }),
          })
          const countTime = setInterval(function(){
            count ++;
            if(count === 5){
              alert('응답시간이 5초가 지났습니다.');
              clearInterval(countTime);
            }
          },1000);
          targetList.innerHTML = '';
          getData();
          clearInterval(countTime);
        }catch(err){
          alert(err);
        }
      }else{
        alert('회원이 15명 이상입니다.');
      }
    }
  } else if (event.target.id === 'search-btn') {
    event.preventDefault();
    const val = searchInput.value;
    showList(val)
  }else if(event.target.getAttribute('class') === 'correction-data'){
    event.target.style.display = "none";
    event.target.nextSibling.style.display = "block";
    const updateTr = event.target.parentNode.parentNode.parentNode.parentNode; 
    const updateInput = updateTr.querySelectorAll('input');
    const noneSpan = updateTr.querySelectorAll('.view-data');
    for(let i = 0; i < updateInput.length; i++){
      noneSpan[i].style.display = "none"
      updateInput[i].style.display = "inline-block"
      updateInput[i].readOnly  = false;
      updateInput[i].style.border ='1px solid #888',
      updateInput[i].style.background ='#fff'
    }
  }else if(event.target.getAttribute('class') === 'up-data'){
    const updateTr = event.target.parentNode.parentNode.parentNode.parentNode
    const patchNum = updateTr.firstChild.dataset.index;
    const upName = updateTr.querySelector('#up-name');
    const upAge = updateTr.querySelector('#up-age');
    const upJob = updateTr.querySelector('#up-job');
    const upemail = updateTr.querySelector('#up-email');
    event.target.style.display = "none";
    event.target.previousSibling .style.display = "block";
    try{
      await fetch(`${requestURL}/${Number(patchNum)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(targetCount.value),
          name : upName.value,
          age : Number(upAge.value),
          job : upJob.value,
          email : upemail.value
        }),
      })
      const countTime = setInterval(function(){
        count ++;
        if(count === 5){
          alert('응답시간이 5초가 지났습니다.');
          clearInterval(countTime);
        }
      },1000);
        targetList.innerHTML = '';
        getData();
        alert("수정이 완료되었습니다.");
        clearInterval(countTime);
    }catch(err){
      alert(err);
    }
  }else if(event.target.id === 'reset-btn'){
    targetList.innerHTML = '';
    getData();
    searchInput.value = '';
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

async function deleteData(num) {
  delList.style.display = 'none';
  try{
    await fetch(`${requestURL}/${num}`, {
      method: "DELETE",
    })
    const countTime = setInterval(function(){
      count ++;
      if(count === 5){
        alert('응답시간이 5초가 지났습니다.');
        clearInterval(countTime);
      }
    },1000);
      targetList.innerHTML = '';
      getData();
      clearInterval(countTime);
  }catch(err){
    alert(err);
  }
}

async function showList(val) {
  list.innerHTML = '';
  try{
    const data = await fetchOption();
    const countTime = setInterval(function(){
      count ++;
      if(count === 5){
        alert('응답시간이 5초가 지났습니다.');
        clearInterval(countTime);
      }
    },1000);
    const post = await data.json()
    await serarchFetch(post, val);
    clearInterval(countTime);
  }catch(err){
      alert(err);
      countTable.innerHTML = listCount.rows.length;
  }
  }


function serarchFetch(myJson, val){
  let k = 1;
  for (let i = 0; i < myJson.length; i++) {
    if (myJson.length - 1 === i) {
      targetCount.value = Number(myJson[i].id) + 1;
    }
      if(searchType.value === ""){
        alert("분류를 선택하세요");
        getData();
        return;
      }else if(searchType.value === "name"){
        if(myJson[i].name.includes(val)){
          const name = myJson[i].name.replace(val,`<span style="color: blue;">${val}</span>`)
          targetList.innerHTML += `<tr><td data-index=${myJson[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${name}</span><input class="correction-input" id="up-name" type="text" readonly value="${myJson[i].name}"></td><td><span class="view-data">${myJson[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${myJson[i].age}"></td><td><span class="view-data">${myJson[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${myJson[i].job}"></td><td><div class="button-box"><span><span class="view-data">${myJson[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${myJson[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
          k++;
        }
      }else if(searchType.value === "email"){
        if(myJson[i].email.includes(val)){
          const email = myJson[i].email.replace(val,`<span style="color: blue;">${val}</span>`)
          targetList.innerHTML +=  `<tr><td data-index=${myJson[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${myJson[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${myJson[i].name}"></td><td><span class="view-data">${myJson[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${myJson[i].age}"></td><td><span class="view-data">${myJson[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${myJson[i].job}"></td><td><div class="button-box"><span><span class="view-data">${email}</span><input class="correction-input" id="up-email" type="text" readonly value="${myJson[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
          k++;
        }
      }else if(searchType.value === "age"){
        if(myJson[i].age === Number(val)){
          const stringVal = val.toString();
          const age = myJson[i].age.toString().replace(stringVal,`<span style="color: blue;">${stringVal}</span>`)
          targetList.innerHTML += `<tr><td data-index=${myJson[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${myJson[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${myJson[i].name}"></td><td><span class="view-data">${age}</span><input class="correction-input" id="up-age" type="text" readonly value="${myJson[i].age}"></td><td><span class="view-data">${myJson[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${myJson[i].job}"></td><td><div class="button-box"><span><span class="view-data">${myJson[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${myJson[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
          k++;
        }
      }else if(searchType.value === "job"){
        if(myJson[i].job === val){
          const job = myJson[i].job.replace(val,`<span style="color: blue;">${val}</span>`)
          targetList.innerHTML += `<tr><td data-index=${myJson[i].id}>${k}</td><td class="target-name${i}"><span class="view-data">${myJson[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${myJson[i].name}"></td><td><span class="view-data">${myJson[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${myJson[i].age}"></td><td><span class="view-data">${job}</span><input class="correction-input" id="up-job" type="text" readonly value="${myJson[i].job}"></td><td><div class="button-box"><span><span class="view-data">${myJson[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${myJson[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
          k++;
        }
      }
    }
    if(listCount.rows.length === 0){
      throw new Error('회원이 존재하지 않습니다.');
    }
  countTable.innerHTML = listCount.rows.length;
}

function showValue(target) {
    searchType.value = target.value;
}


function emailCheck(email) {
  let regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email != '' && email != 'undefined' && regex.test(email));
}

document.addEventListener('click', postData)

