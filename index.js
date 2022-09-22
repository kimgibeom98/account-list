const requestURL = 'http://localhost:3000/accoounts'
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

async function postData(event) {
  if (event.target.getAttribute('class') === 'submit-btn') {
    let email = tragetEmail.value;
    if(!emailCheck(email)){
      alert('email을 형식에 맞게 입력하세요.');
    }else{
      if(listCount.rows.length < 15){
        console.log(listCount.rows.length);
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
    await serarchFetch(post);
    clearInterval(countTime);
  }catch(err){
      alert(err);
      countTable.innerHTML = listCount.rows.length;
  }
  }
function showValue(target) {
    searchType.value = target.value;
}

function countTime(){
  setTimeout(function(){
    if( listCount.rows.length === 0){
      return false
    }
  }, 5000);
  return true
}

function emailCheck(email) {
  let regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email != '' && email != 'undefined' && regex.test(email));
}

document.addEventListener('click', postData)

