const requestURL = 'http://localhost:3000/accoounts'
const targetList = document.getElementById('target');
const dataJseon = new XMLHttpRequest();
const tragetName = document.getElementById('name')
const targetJob = document.getElementById('job')
const tragetAge = document.getElementById('age')
const tragetEmail = document.getElementById('email')
const delList = document.getElementById('del-pop');
const targetCount = document.getElementById('num');
const countTable = document.getElementById('count-list');
const listCount = document.getElementById('table-count');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const searchType = document.getElementById('search-type');
const list = document.getElementById('target');
let data;
function getData() {
  dataJseon.open('GET', requestURL);
  dataJseon.send();
  dataJseon.responseType = 'json';
  dataJseon.onload = () => {
    data = dataJseon.response;
    let j = 1;
    for (let i = 0; i < data.length; i++) {
      if (data.length - 1 === i) {
        targetCount.value = Number(data[i].id) + 1;
      }
      targetList.innerHTML += `<tr><td data-index=${data[i].id}>${j}</td><td class="target-name${i}"><input type="text" readonly value="${data[i].name}"></td><td><input type="text" readonly value="${data[i].age}"></td><td><input type="text" readonly value="${data[i].job}"></td><td><div class="button-box"><span><input type="text" readonly value="${data[i].email}"></span><div><button class="correction-data" type="button">수정</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
      j++;
    }
    countTable.innerHTML = listCount.rows.length;
  }
}
getData();

function postData(event) {
  if (event.target.getAttribute('class') === 'submit-btn') {
    dataJseon.open('post', requestURL);
    dataJseon.setRequestHeader('content-type', 'application/json');
    let email = tragetEmail.value;
    if (!emailCheck(email)) {
      alert('email을 형식에 맞게 입력하세요.');
    } else {
      dataJseon.send(JSON.stringify({ id: Number(targetCount.value), name: tragetName.value, age: Number(tragetAge.value), job: targetJob.value, email: tragetEmail.value }));
      dataJseon.onload = () => {
        targetList.innerHTML = '';
        getData();
      }
    }
  } else if (event.target.id === 'search-btn') {
    event.preventDefault();
    const val = searchInput.value;
    showList(val)
  }else if(event.target.getAttribute('class') === 'correction-data'){
    event.target.innerText = "완료"
  }
}

function findName(targetNum) {
  const delName = document.querySelector(`.target-name${targetNum}`);
  const delId = delName.previousSibling.dataset.index
  delList.style.display = 'block';
  delList.innerHTML = `<p>${delName.innerText} 님을 삭제하시겠습니까?</p><div><button type="button" onclick="deleteData(${delId})" class="y-btn">예</button><button type="button" class="n-btn">아니요</button></div>`
  const delPop = document.querySelector('.n-btn');
  delPop.onclick = function () {
    delList.style.display = 'none';
  }
}

function deleteData(num) {
  delList.style.display = 'none';
  dataJseon.open('DELETE', `${requestURL}/${num}`)
  dataJseon.send();
  dataJseon.onload = () => {
    targetList.innerHTML = '';
    getData();
  }
}
function showList(val) {

  list.innerHTML = '';
  dataJseon.open('GET', requestURL);
  dataJseon.send();
  dataJseon.responseType = 'json';
  dataJseon.onload = () => {
  data = dataJseon.response;
  let k = 1;
  for (let i = 0; i < data.length; i++) {
    const innerElement = `<tr><td data-index=${data[i].id}>${k}</td><td class="target-name${i}"><input type="text" readonly value="${data[i].name}"></td><td><input type="text" readonly value="${data[i].age}"></td><td><input type="text" readonly value="${data[i].job}"></td><td><div class="button-box"><span><input type="text" readonly value="${data[i].email}"></span><div><button class="correction-data" type="button">수정</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`
    if (data.length - 1 === i) {
      targetCount.value = Number(data[i].id) + 1;
    }
      if(searchType.value === ""){
        alert("분류를 선택하세요");
        getData();
        break;
      }else if(searchType.value === "name"){
        if(data[i].name.includes(val)){
          targetList.innerHTML += innerElement
          k++;
        }
      }else if(searchType.value === "email"){
        if(data[i].email.includes(val)){
          targetList.innerHTML += innerElement
          k++;
        }
      }else if(searchType.value === "age"){
        if(data[i].age === Number(val)){
          targetList.innerHTML += innerElement
          k++;
        }
      }else if(searchType.value === "job"){
        if(data[i].job === val){
          targetList.innerHTML += innerElement
          k++;
        }
      }
    }
    countTable.innerHTML = listCount.rows.length;
  }
}

function showValue(target) {
    searchType.value = target.value;
}

function emailCheck(email) {
  let regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email != '' && email != 'undefined' && regex.test(email));
}

document.addEventListener('click', postData)