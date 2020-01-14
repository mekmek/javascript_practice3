'use strict';

// グローバル変数
let correctCnt = 0;         //正解数
let questionNum = 0;        //問題番号
// let questionData = [];      //取得した問題データ

// ヘッダーの作成
function createHeader(element,text){
    const elm = document.createElement(element);
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
        .then(response =>{
            if(response.ok){
                return response.json();
            } else {
                throw new Error('問題の取得に失敗しました'); 
            }
        })
        .catch(error =>{
            document.getElementById('title').textContent = error.message;
            document.getElementById('message').textContent = null;
        })
        .then(apiData =>{
            const questionData = apiData.results;
            questionGenerate(questionData);
        });
});

// 問題文の生成
function questionGenerate(questionData){
    const targetArr = questionData[questionNum];

    // 問題データの準備
    const questionTitle =  '問題' + Number(questionNum+1);
    const category = '[ジャンル] ' + targetArr['category'];
    const difficulty = '[難易度] ' + targetArr['difficulty'];
    const question = targetArr['question'];
    const correct_answer = targetArr['correct_answer'];
    const answerArr = targetArr['incorrect_answers'];
    
    const insertPos = Math.floor(Math.random()*answerArr.length);
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
    answerArr.forEach(value => {
        const ansBtn = document.createElement('button');
        ansBtn.textContent = value;
        ansBtn.addEventListener('click', ()=>{
            if(questionNum < 10){
                if(event.target.textContent === correct_answer){correctCnt++};
                questionGenerate(questionData);
            } else {
                resultsOutoput();
            }
        });
        const p = document.createElement('p');
        p.appendChild(ansBtn);
        document.getElementById('choices').appendChild(p);
    });
};

// 結果の出力
function resultsOutoput(){
    document.getElementById('title').textContent = null;
    createHeader('h1', `あなたの正解数は${correctCnt}です！！`);
    document.getElementById('message').textContent = '再度チャレンジしたい場合は以下をクリック！！';
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'ホームに戻る';
    restartBtn.addEventListener('click', ()=>{
        location.reload();
    });
    document.getElementById('choices').textContent = null;
    document.getElementById('choices').appendChild(restartBtn);
};

