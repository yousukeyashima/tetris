// canvas描画
let can = document.getElementById("can");
let con = can.getContext("2d");

// ブロックサイズ
const Block_Size = 30;

// テトロミノのサイズ;
const Tetro_Size =  4;

// フィールドサイズ
const Field_x = 10;
const Field_y = 20;

// キャンバスサイズ
const Screen_W = Block_Size * Field_x;
const Screen_H = Block_Size * Field_y;

// キャンバス幅・高さ・外枠描画
can.width = Screen_W;
can.height = Screen_H;
can.style.border = "4px solid grey";

// テトロミノのスタート地点
const Start_x = Field_x/2 - Tetro_Size/2;
const Start_y = 0;

// ゲームオーバーフラグ
let over = false;

// テトロミノカラー
const Tetro_Colors = [
  "#000",
  "#6CF", //水色
  "#F92", //オレンジ
  "#66F", //青
  "#C5C", //紫
  "#FD2", //黄色
  "#F44", //赤
  "#5B5" //緑
];

// テトロミノの型
const Tetro_Type = [
  // 0,空
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // 0,I型
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // 1,L型
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  // 2,J型
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  // 3,T型
  [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
  ],
  // 4,O型
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  // 5,Z型
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  // 6,S型
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
  ]
]

// テトロミノ
let tetro = [
  [0, 0, 0, 0],
  [1, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0]
];

// テトロミノ座標
let tetro_x = Start_x;
let tetro_y = Start_y;

// テトロミノ形状
let tetro_t;

// 落下速度
const drop_Speed = 700;

// フィールド
let field = [];
for(let y = 0 ; y < Field_y ; y++) {
  field[y] = [];
  for(let x = 0 ; x < Field_x ; x++) {
    field[y][x] = 0;
  }
}

tetro_t = Math.floor(Math.random() * (Tetro_Type.length - 1) +1);
tetro = Tetro_Type[tetro_t];

draw();

setInterval(dropTetro, drop_Speed);

// １ブロック描画
function drawBlock(x, y, c) {
    let draw_x = x * Block_Size;
    let draw_y = y * Block_Size;

    // ブロック
    con.fillStyle = Tetro_Colors[c];
    con.fillRect(draw_x, draw_y, Block_Size, Block_Size);
    // 黒枠
    con.strokeStyle = "black";
    con.strokeRect(draw_x, draw_y, Block_Size, Block_Size);
}

// フィールド描画とテトロミノ描画　
function draw() {
  // 画面クリア
  con.clearRect(0, 0, Screen_W, Screen_H);
  // フィールド描画
  for(let y = 0 ; y < Field_y ; y++) {
    for(let x = 0 ; x < Field_x ; x++) {
      if(field[y][x] != 0) {
        drawBlock(x, y, field[y][x]);
      }
    }
  }
  // テトロミノ描画
  for(let y = 0 ; y < Tetro_Size ; y++) {
    for(let x = 0 ; x < Tetro_Size ; x++) {
      if(tetro[y][x] != 0) {
        drawBlock(tetro_x + x, tetro_y + y, tetro_t);
      }
    }
  }

  if(over == true) {
    let s = "GAME OVER";
    con.font = "40px 'MS ゴシック'";
    let w = con.measureText(s).width;
    let x = Screen_W/2 - w/2;
    let y = Screen_H/2 -20;
    con.lineWidth = 4;
    con.strokeText(s,x,y);
    con.fillStyle = "white";
    con.fillText(s,x,y);
  }
}

// 衝突判定
function checkMove( move_x, move_y, ntetro) {
  if(ntetro == undefined) {
    ntetro = tetro;
  }
  for(let y = 0 ; y < Tetro_Size ; y++) {
    for(let x = 0 ; x < Tetro_Size ; x++) {
      let nx = tetro_x + x + move_x;
      let ny = tetro_y + y + move_y;
      if(ntetro[y][x] != 0) {
        if(ny < 0 ||
          nx < 0 ||
          ny >= Field_y ||
          nx >= Field_x ||
          field[ny][nx] !=0) {
            return false;
          }
      }
    }
  }
  return true;
}

// テトロ固定
function fixTetro() {
  for(let y = 0 ; y < Tetro_Size ; y++) {
    for(let x = 0 ; x < Tetro_Size ; x++) {
      if(tetro[y][x] != 0) {
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
    }
  }
}

// ライン揃ったら消す
function checkLIne() {
  let linec = 0;
  for(let y = 0 ; y < Field_y ; y++) {
    let flag = true;
    for(let x = 0 ; x < Field_x ; x++) {
      if(field[y][x] == 0) {
        flag = false;
        break;
      }
    } 
    
    if(flag == true) {
      linec++;
      for(let ny = y ; ny > 0 ; ny--) {
        for(let nx = 0 ; nx < Field_x ; nx++) {
          field[ny][nx] = field[ny - 1][nx];
        }
      }
    }
  }
}

// 落下処理
function dropTetro() {
  if(over == true) {
    return;
  }

  if(checkMove(0, 1))
        tetro_y++ ;
  else {
    fixTetro();
    checkLIne();

    tetro_t = Math.floor(Math.random() * (Tetro_Type.length - 1) +1);
    tetro = Tetro_Type[tetro_t];
    tetro_x = Start_x;
    tetro_y = Start_y;

    if(!checkMove(0, 0)) {
      over = true;
    }
  }
  draw();
}

// テトロ回転
function rotate() {
  let ntetro = [];
  for(let y = 0 ; y < Tetro_Size ; y++) {
    ntetro[y] = [];
    for(let x = 0 ; x < Tetro_Size ; x++) {
      ntetro[y][x] = tetro[Tetro_Size - 1 - x][y];
    }
  }
  return ntetro
}

// キーボード操作
document.onkeydown = function(event) {
  if(over == true) {
    return;
  }

  switch(event.keyCode) {
    // 左キー入力時
  　case 37:
      if(checkMove(-1, 0))
        tetro_x--;
      break;

    // 上キー入力時
    case 38:
      // 着地点計算
    let plus = 0;
    while(checkMove(0, plus + 1)){
      plus++;
    }
      tetro_y += plus;
      break;

    // 右キー入力時
    case 39:
      if(checkMove(1, 0))
        tetro_x++; //右
      break;
    
    // 下キー入力時
    case 40:
      if(checkMove(0, 1))
        tetro_y++;
      break;

    // スペースキー入力時
    case 32:
      let ntetro = rotate()
      if(checkMove(0, 0, ntetro))
        tetro = ntetro;
      break;
  }
  draw();
}