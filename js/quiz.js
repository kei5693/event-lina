const questions = [
  {
    id: 1,
    question: 'What is 2 + 2?',
    answers: [
      { text: '4',correct: true },
      { text: '22', correct: false }
    ]
  },
  {
    id: 2,
    question: 'Who is the best YouTuber?',
    answers: [
      { text: 'Web Dev Simplified', correct: true },
      { text: 'Traversy Media', correct: true },
      { text: 'Dev Ed', correct: true },
      { text: 'Fun Fun Function', correct: true }
    ]
  },
  {
    id: 3,
    question: 'Is web development fun?',
    answers: [
      { text: 'Kinda', correct: false },
      { text: 'YES!!!', correct: true },
      { text: 'Um no', correct: false },
      { text: 'IDK', correct: false }
    ]
  },
  {
    id: 4,
    question: 'What is 4 * 2?',
    answers: [
      { text: '6', correct: false },
      { text: '8', correct: true }
    ]
  }
];
const quizContainer = document.querySelector('#quizContainer');
const quizIndex			= quizContainer.querySelector(':scope > .quizArea > div');
const quizTitle			= quizContainer.querySelector(':scope > .quizArea h2');
const quizAnswer		= quizContainer.querySelector(':scope > .quizArea ul');

const quizButton		= quizContainer.querySelectorAll(':scope > .btnArea > div button');
const quizCount			= quizContainer.querySelector(':scope > .resultArea .result > .count > span');
const quizResult		= quizContainer.querySelector(':scope > .resultArea .result > .info > div');
const quizReset			= quizContainer.querySelector(':scope > .resultArea #btnReset');
let currentIndex		= 0;
let lastIndex				= questions.length;
let selectedAnswer	= null;
let selectedArr				= [];
let resultArr				= [];
let flag						= false;

var quiz = {
  init(){
    quiz.showQuestion(currentIndex);
    quiz.btnEvent();
  },
  resetQuiz(){
    currentIndex = 0;
    selectedArr = [];
    resultArr	= [];
    quizCount.innerHTML = '';
    quizResult.innerHTML = '';
    quiz.showQuestion(currentIndex);
  },
  showQuestion(index){
    // 인덱스에 따른 분기(버튼 노출,결과 표시)
    if (index == 0) {
      quizContainer.classList = 'start';
    } else if (index > lastIndex-1) {
      index = lastIndex-1;
      quizContainer.classList = 'result';
      quiz.showResult();
    } else {
      quizContainer.classList = '';
    }

    // 대상의 모든 자식을 제거
    quizAnswer.innerHTML = '';
    // 반복문은 비 효율적
    // while (quizAnswer.firstChild) {
    // 	quizAnswer.removeChild(quizAnswer.firstChild);
    // }

    // 현재 질문 인덱스 표시
    let status = `<strong>${index+1}</strong> / <strong>${lastIndex}</strong>`
    quizIndex.innerHTML = status;
    
    // 퀴즈 텍스트 변경
    quizTitle.innerText = questions[index].question;
    // 퀴즈 선택지 생성, 선택지 클릭 이벤트
    questions[index].answers.forEach((answer,index) => {
      const li = document.createElement('li');
      const button  = document.createElement('button');

      button.innerText = answer.text;
      button.addEventListener('click', (e)=> {quiz.selectAnswer(e.target, index)});
      quizAnswer.appendChild(li).appendChild(button);
    });
  },
  selectAnswer(answer, index){
    // 선택한 답변 활성화, 인덱스 값 저장
    let targetSiblings = answer.closest('ul').children;
    Array.from(targetSiblings).forEach(el => el.classList.remove('selected'));
    targetSiblings[index].classList.add('selected');

    flag = true;
    selectedAnswer = index;
  },
  answerQuiz(target){
    let quizDirection = target.className;

    if(quizDirection == 'btnNext'){
      if(flag == false) return console.log('선택값 없음');

      selectedArr.push(selectedAnswer);
      currentIndex++;
    } else {
      selectedArr.pop();
      currentIndex--;
    }
    quiz.showQuestion(currentIndex);
    flag = false;
  },
  showResult(){
    questions.forEach((el,index)=>{
      if(el.answers[selectedArr[index]].correct){
        //Object.assign(questions[index], { key: Number(`${index+1}`) });
        resultArr.push(questions[index]);
      }
    });

    quizCount.innerHTML = resultArr.length;

    resultArr.forEach((result, index) => {
      let comma = index < resultArr.length-1 ? ', ' : '';
      quizResult.innerHTML += `${result.id}` + comma;
      //quizResult[0].innerHTML = '';
    });
    console.log(resultArr);
  },
  btnEvent(){
    quizButton.forEach(button => {
      button.addEventListener('click', (e) => {
        quiz.answerQuiz(e.target);
      });
    });
    quizReset.addEventListener('click', () => {
      quiz.resetQuiz();
    });
  }
}
quiz.init();