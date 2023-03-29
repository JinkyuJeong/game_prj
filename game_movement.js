// 문서 로드 이벤트처리 함수
document.addEventListener("DOMContentLoaded",()=>{
  const startButton = document.querySelector("#start");
  const input = document.querySelector("#hh");
  const chatButton = document.querySelector("#gg");
  const ul = document.querySelector("#view");
  const sysMessage = document.querySelector("#sys_text");
  const sysWinLose = document.querySelector("#winlose");
  const sysNum = [];
  let timer;
  let cnt;
  
  sysMessage.textContent = "[SYSTEM] : 안녕하세요 SYSTEM입니다.";
  input.disabled = true;
  chatButton.disabled = true;

  // 시작버튼 클릭 이벤트처리 함수
  startButton.addEventListener("click",()=>{
    input.placeholder = "";
    removeLi(); 

    startButton.disabled = true;
  
    sysWinLose.style.display = "none";

    createLi("3초 뒤 게임시작...");
    createLi("[SYSTEM] : 숫자좀 생각하고 있을게요.",false,true);
    sysMessage.textContent = "[SYSTEM] : 숫자좀 생각하고 있을게요"; 

    cnt = 60;  
    const second = document.querySelector("#second");
    second.style.color = "black";
    second.style.fontSize = "20px";
    second.style.bottom = "0";
    second.textContent = cnt;

    clearInterval(timer);

    let readyCnt = 3;
    const ready = setInterval(()=>{
      createLi(readyCnt-- + "...");
      if(readyCnt==0) {
        clearInterval(ready);
        createLi("게임을 시작합니다. (제한시간 :60초)");
        systemNum(sysNum);
        input.disabled = false;
        chatButton.disabled = false; 
        createLi("[SYSTEM] : 숫자 3개 생각 완료 ㅎㅎ 답을 맞춰보시죠",false,true);
        sysMessage.textContent = "[SYSTEM] : 숫자 3개 생각 완료 ㅎㅎ 답을 맞춰보시죠"; 
        startTimer();
      }
    },1000);
  });
  
  // input태그에 값을 입력하고 보내기 버튼을 눌렀을경우 이벤트처리 함수
  chatButton.addEventListener("click",()=>{
    if(input.value.trim() !== "") chatAnswer();
  });

  // input태그에 값을 입력하고 엔터키를 눌렀을경우 이벤트처리 함수
  input.addEventListener("keyup",(event)=>{
    if(event.code === "Enter" && input.value.trim() !== "") chatAnswer();
  });

  // 사용자가 입력한 값을 입력창에 넣고 게임을 하는 함수
  const chatAnswer = function() {
    const text = input.value;
    createLi("[USER] : "+ text);
    const num = parseInt(text);

    if((123<=num && num<=987)){
      if(isDuplicate(num)){
        createLi("[운영자] : USER님 중복된 숫자가 있습니다.",true);
        sysMessage.textContent = "[SYSTEM] : USER님이 입력한 숫자에는 중복이 있어요 제대로 입력해주세요.";
      }else if(isDigitZero(num)){
        createLi("[운영자] : USER님 숫자 0이 존재합니다.",true);
        sysMessage.textContent = "[SYSTEM] : USER님이 입력한 숫자에는 0이 있어요 제대로 입력해주세요.";
      }else{
        const myNum = String(num).split('');
        
        let ball=0, strike=0;
        for(let i=0; i<3; i++) {
          for(let j=0; j<3; j++) {
            if(sysNum[i]==myNum[j]) {
              if(i==j) strike++;
              else ball++;
            }
          }
        }

        if(strike === 3){
          createLi("[운영자] : 정답. USER 승리 (기록 : " + (60-cnt) + "초)",false,false,true);
          clearInterval(timer);
          createLi("[SYSTEM] : 제가 졌습니다. ㅠㅠ",false,true);
          sysMessage.textContent = "[SYSTEM] : 제가 졌습니다. ㅠㅠ";
          sysWinLose.textContent = "LOSE";
          sysWinLose.style.display = "block";
          input.value = "";
          input.disabled = true;
          input.placeholder = "게임종료";
          chatButton.disabled = true;
          startButton.disabled = false;
          return;
        }else{
          createLi("[SYSTEM] : " + strike + "스트라이크 " + ball + "볼",false,true);
          sysMessage.textContent = "[SYSTEM] : " + strike + "스트라이크 " + ball + "볼";
        }
      }
    }else{
      createLi("[운영자] : 숫자 3개만 입력하세요.",true);
      sysMessage.textContent = "[SYSTEM] : USER님 정확한 값을 입력해주세요."
    }
    input.value = "";
  }

  // 숫자게임 타이머함수
  const startTimer = function(){
    timer = setInterval(()=>{
      if(cnt==10){
        second.style.color = "red";
        second.style.fontSize = "40px";
        second.style.bottom = "-5px";
        second.textContent = --cnt;
        createLi("[운영자] : " + (cnt+1)+"초 남았습니다.",false, false, true);
        sysMessage.textContent = "[SYSTEM] : 10초만 지나면 저의 승리";
      }else if(cnt==0){
        clearInterval(timer);
        createLi("[운영자] : 시간초과. SYSTEM 승리",false,false,true);
        createLi("[SYSTEM] : 제가 이겼습니다. 개꿀~ 답은 " + sysNum.toString(),false,true);
        input.value = "";
        sysMessage.textContent = "[SYSTEM] : 제가 이겼습니다. 개꿀~";
        sysWinLose.textContent = "WIN";
        sysWinLose.style.display = "block";
        input.disabled = true;
        input.placeholder = "게임종료";
        chatButton.disabled = true;
        startButton.disabled = false;
      }else if (cnt != 60 && cnt%30 == 0){
        createLi("[운영자] : " + cnt+"초 남았습니다.",false, false, true);
        second.textContent = --cnt;
        sysMessage.textContent = "[SYSTEM] : 서두르시길...킥킥";
      }else{
        second.textContent = --cnt;
      }
    },1000);
  }

  // li태그 생성해서 채팅창에 갖다붙이는 함수
  const createLi = function(text, red=false, blue=false, green=false){
    const li = document.createElement("li");
    if(red) li.style.color="red";   // 빨간글씨 출력용
    if(blue) li.style.color="blue"; // 파란글씨 출력용
    if(green) li.style.color="green"; // 초록글씨 출력용
    li.textContent = text;
    ul.appendChild(li);
    
    autoScrollAndFocus();
    input.focus();
  }

  // li태그들이 쌓여 오버플로우가 발생됐을 때 자동으로 시점이 포커싱되는 함수
  const autoScrollAndFocus = function() {
    const lastLi = ul.querySelector("li:last-child");
    lastLi.tabIndex = 0;
    lastLi.focus();
    ul.scrollTo(0, ul.scrollHeight);
  }

  // 시스템 입력값받기
  function systemNum (sysNum){
    sysNum.length=0;
    while(sysNum.length != 3){
      let n = Math.ceil(Math.random()*9);
      if(n!==sysNum[0] && n!==sysNum[1])
        sysNum.push(n);
    }
    return sysNum;
  };

  // ul태그에 달려있는 li태그를 전부 지우는 함수
  const removeLi = function(){
    const lis = document.querySelectorAll("li")
    for(let i = 0; i < lis.length; i++)
      lis[i].remove();
  }

  // 사용자가 입력한 숫자 중복체크하는 함수
  function isDuplicate(n) {
    const digits = String(n).split('');
    return digits[0] === digits[1] || digits[0] === digits[2]
              || digits[1] === digits[2];
  }

  // 사용자가 입력한 숫자중에 0이 들어가 있는지 확인하는 함수
  function isDigitZero(n){
    const digits = String(n).split('');
    return digits[0] === "0" || digits[1] === "0" 
            || digits[2] === "0";
  }
});