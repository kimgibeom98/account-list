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
function getData() {
  fetch(requestURL)
    .then((data) => data.json())
    .then(
      (data) => {
        let j = 1;
        for (let i = 0; i < data.length; i++) {
          if (data.length - 1 === i) {
            targetCount.value = Number(data[i].id) + 1;
          }
          targetList.innerHTML += `<tr><td data-index=${data[i].id}>${j}</td><td class="target-name${i}"><span class="view-data">${data[i].name}</span><input class="correction-input" id="up-name" type="text" readonly value="${data[i].name}"></td><td><span class="view-data">${data[i].age}</span><input class="correction-input" id="up-age" type="text" readonly value="${data[i].age}"></td><td><span class="view-data">${data[i].job}</span><input class="correction-input" id="up-job" type="text" readonly value="${data[i].job}"></td><td><div class="button-box"><span><span class="view-data">${data[i].email}</span><input class="correction-input" id="up-email" type="text" readonly value="${data[i].email}"></span><div><button class="correction-data" type="button">수정</button><button class="up-data" type="button">완료</button><button onclick="findName(${i});" type="button" class="del-btn">삭제</button></div></div></td></tr>`;
          j++;
        }
        countTable.innerHTML = listCount.rows.length;
      });
}
getData();

function postData(event) {
  if (event.target.getAttribute('class') === 'submit-btn') {
    let email = tragetEmail.value;
    fetch(requestURL, {
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
    .then((response) => response.json())
    .then((data) => console.log(data));

    dataJseon.open('post', requestURL);
    dataJseon.setRequestHeader('content-type', 'application/json');
    // let email = tragetEmail.value;
    if (!emailCheck(email)) {
      alert('email을 형식에 맞게 입력하세요.');
    } else {
      // dataJseon.send(JSON.stringify({ id: Number(targetCount.value), name: tragetName.value, age: Number(tragetAge.value), job: targetJob.value, email: tragetEmail.value }));
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
    console.log(event.target)
    event.target.style.display = "none";
    event.target.nextSibling.style.display = "block";
    const updateTr = event.target.parentNode.parentNode.parentNode.parentNode; 
    const updateInput = updateTr.querySelectorAll('input');
    const viewSpan = updateTr.querySelectorAll('.view-data');
    console.log(viewSpan)
    // viewSpan.style.display = "none"
    for(let i = 0; i < updateInput.length; i++){
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
    dataJseon.open('PATCH', `${requestURL}/${Number(patchNum)}`);
    dataJseon.setRequestHeader('content-type', 'application/json');
    dataJseon.send(JSON.stringify({id: Number(targetCount.value), name: upName.value, age: Number(upAge.value), job: upJob.value, email: upemail.value }));
    dataJseon.onload = () => {
      targetList.innerHTML = '';
      getData();
      alert("수정이 완료되었습니다.");
    }
  }
}



document.addEventListener('click', postData)