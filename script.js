'use strict';

// グローバル変数
let correctCnt = 0;         //正解数
let questionNum = 0;        //問題番号
let questionData = [];      //取得した問題データ

// ヘッダーの作成
function createHeader(element,text){
    let elm = document.createElement(element);
    elm.textContent = text;
    document.getElementById('title').appendChild(elm);
};

// 問題情報の取得処理
document.getElementById('startBtn').addEventListener('click', ()=>{
    document.getElementById('title').textContent = null;
    createHeader('h1', '取得中');
    document.getElementById('message').textContent = '少々お待ちください';
    document.getElementById('startBtn').remove();
    
    fetch('https://opentdb.com/api.php?amount=10')
        .then((response)=>{
            if(response.ok){
                return response.json();
            } else {
                throw new Error('問題の取得に失敗しました'); 
            }
        })
        .catch((error)=>{
            document.getElementById('title').textContent = error.message;
            document.getElementById('message').textContent = null;
        })
        .then((apiData)=>{
            questionData = apiData.results;
            questionGenerate();
        });
});

// 問題文の生成
function questionGenerate(){
    let targetArr = questionData[questionNum];

    // 問題データの準備
    let questionTitle =  '問題' + Number(questionNum+1);
    let category = '[ジャンル] ' + targetArr['category'];
    let difficulty = '[難易度] ' + targetArr['difficulty'];
    let question = targetArr['question'];
    let correct_answer = targetArr['correct_answer'];
    let answerArr = targetArr['incorrect_answers'];
    
    let insertPos = Math.floor(Math.random()*answerArr.length);
    answerArr.splice(insertPos, 0, correct_answer);

    // ヘッダー、問題文の出力
    document.getElementById('title').textContent = null;
    createHeader('h1', questionTitle);
    createHeader('h2', category);
    createHeader('h2', difficulty);
    document.getElementById('message').textContent = question;
    
    // 選択肢の出力
    questionNum++;
    document.getElementById('choices').textContent = null;
    for(let i = 0; i < answerArr.length; i++){
        let ansBtn = document.createElement('button');
        ansBtn.textContent = answerArr[i];
        ansBtn.addEventListener('click', ()=>{
            if(questionNum < 10){
                if(event.target.textContent === correct_answer){correctCnt++};
                questionGenerate();
            } else {
                resultsOutoput();
            }
        });
        let p = document.createElement('p');
        p.appendChild(ansBtn);
        document.getElementById('choices').appendChild(p);
    };
};

// 結果の出力
function resultsOutoput(){
    document.getElementById('title').textContent = null;
    createHeader('h1', `あなたの正解数は${correctCnt}です！！`);
    document.getElementById('message').textContent = '再度チャレンジしたい場合は以下をクリック！！';
    let restartBtn = document.createElement('button');
    restartBtn.textContent = 'ホームに戻る';
    restartBtn.addEventListener('click', ()=>{
        location.reload();
    });
    document.getElementById('choices').textContent = null;
    document.getElementById('choices').appendChild(restartBtn);
};

