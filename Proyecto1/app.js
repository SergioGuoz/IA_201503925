
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

var jugadores=["NEGRAS","BLANCAS"];

var jugador;
var oponente;

var heuristicas=[
      120, -20,  20,   5,   5,  20, -20, 120,  
      -20, -40,  -5,  -5,  -5,  -5, -40, -20,  
       20,  -5,  15,   3,   3,  15,  -5,  20,  
        5,  -5,   3,   3,   3,   3,  -5,   5,  
        5,  -5,   3,   3,   3,   3,  -5,   5,  
       20,  -5,  15,   3,   3,  15,  -5,  20,  
      -20, -40,  -5,  -5,  -5,  -5, -40, -20,  
      120, -20,  20,   5,   5,  20, -20, 120,        
  ];

var cadTablero=''
var board=[];

function convertCadToArray(){
  for (var c of cadTablero) {
    board.push(c);    
  }
}

function printTablero(tablero){
  let cadTemp='';
  let indiceX=0;
  for (var i = 0; i <tablero.length; i++) {
    if (i%8==0 && i!=0) {
      console.log(indiceX,cadTemp+'|');
      cadTemp='';
      indiceX++;
    }
    cadTemp+='|'+tablero[i];      
  }
  console.log(cadTemp);
}

function getOponente(jugador) {
  return jugador==1?1:0;
}

function getX(pos){return pos % 8;}
function getY(pos){return Math.floor(pos / 8);}


function minimax(tablero,depth,isMaximizing,indice){
  //printTablero(tablero);
  //console.log(isMaximizing,depth);
  if(depth==3){
    console.log("RET ",indice,heuristicas[indice]);
    return [heuristicas[indice],indice];
  }
  if (isMaximizing) {
    let best=[-999,0]
    let tempMovs=allPosibleMovements(tablero,jugador);
    for (var item of tempMovs ) {
      let tempTablero=fillingMovs(tablero,item,jugador);
      //best=Math.max(,best)
      let valor=minimax(tempTablero,depth+1,false,item[1])
      best=valor[0]>best[0]?valor:best;
      
    }
    console.log('Finalizando iteracion max',best);
    return best;
  }else{
    let best=[999,0];
    let tempMovs=allPosibleMovements(tablero,oponente);
    for (var item of tempMovs) {
      let tempTablero=fillingMovs(tablero,item,oponente);
      let valor=minimax(tempTablero,depth+1,true,item[1]);
      best=valor[0]<best[0]?valor:best;
    }
    console.log('Finalizando iteracion MIN',best);

    return best;
  }
}


function getPosiblesMovimientos(tablero,indice,jug){
  let tempIndex=0;
  let step=[-1,-9,-8,7,1,9,8,7];
  let movimientos=[];
  let enemigo=false;
  for (var i = 0; i < step.length; i++) { // posibles direcciones
    enemigo=false;
    tempIndex=indice

    for (var j = 0; j < 8; j++) { // cantidad maxima de pasos maximos
      tempIndex+=step[i];
      if(tempIndex>=0&&tempIndex<=64){
        if(tablero[tempIndex]==jug){
          break;
        }if(tablero[tempIndex]==2&&!enemigo){
          break;
        }else if(tablero[tempIndex]==2&&enemigo){
          movimientos.push([indice,tempIndex,step[i]]);
          break;
        }else if(tablero[tempIndex]!=jug){
          enemigo=true;
        }
      }else{
        break;
      }
    }
  }

  return movimientos;
}


function fillingMovs(tablero,arr,jug){
  let newTablero=Object.assign([],tablero);
  tempIndex=arr[0];
  
  for (var i = 0; i < 8; i++) {
    tempIndex+=arr[2];
    if( arr[2]>0 && tempIndex<=arr[1] // si step es positivo el indice debe ser menor que el limite superior
      || arr[2]<0 && tempIndex>=arr[1]){ //si step es negativo, el indice debe ser mayor al limite inferior
      newTablero[tempIndex]=jug+'';
    }else{
      break;
    }
  }
  return newTablero;
}

function allPosibleMovements(tablero,jug){
  let movimientos=[];
  for (var i = 0; i < tablero.length; i++) {
    if(tablero[i]==jug){
      movimientos=movimientos.concat(getPosiblesMovimientos(tablero,i));
      
    }
  }
  return movimientos;
}

function iniciar(tablero,jug){
  
  let valor=minimax(tablero,0,true,0);
  let cad=getX(valor[1])+''+getY(valor[1]);
  console.log("RESULTADO (",valor,getX(valor[1]),',',getY(valor[1]),')');
  //document.body.innerHTML=cad;

  return cad;
  
}


app.get('/', (req, res) => {
  turno=req.query.turno;
  estado=req.query.estado;
  console.log(turno,estado);
  jugador=turno;
  oponente=jugador==1?0:1;
  cadTablero=estado;
  convertCadToArray();
  printTablero(board);
  let resultado =iniciar(board,jugador);
  res.send(resultado)
})

app.listen(port, () => {
  console.log(` Running on port :${port}`)
});

