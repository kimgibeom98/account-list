# account-list
회원관리 기능을 구현한 미니프로젝트입니다.

## 사용된 기술 스택
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

## 기술 사항
* 분류별 검색기능
  +  이름, 이메일 - 키워드 포함검색
  + 직업, 나이 - 완전일치 검색
* 검색 결과 리스트에서 문자열에 포함된 검색 키워드는 하이라이트 처리
* 회원 생성기능
  + 이메일 - 정규식을 통한 유효성 검사
* 회원 삭제기능
* 회원정보 수정기능
* 예외처리
  + API 요청실패시 예외처리
  + 분류별 검색시 회원이 존재하지않을때 예외처리
  + API 요청후 5초가 지난 뒤 응답이 없을경우 알림출력
* 페이지 우측 상단에 [오픈시간] [마감시간]을 각각 API를 통해 조회한 값을 표시
* 페이지 내에 발생하는 모든 동작은 새로고침이 발생하지 않도록 SPA 구현
