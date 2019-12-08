/**
 * Known preset layouts to measure against
 */
import {Layout} from "./layout";
const QWERTY= `
  \` 1 2 3 4 5 6 7 8 9 0 - =
   ~ ! @ # $ % ^ & * ( ) _ +
     q w e r t y u i o p [ ] \\
     Q W E R T Y U I O P { } |
     a s d f g h j k l ; ' \\n
     A S D F G H J K L : " \\n
      z x c v b n m , . /
      Z X C V B N M < > ?
  `;

const SERBIAN =`
\` 1 2 3 4 5 6 7 8 9 0 ' +
 ~ ! " # $ % & / ( ) = ? *
   q w e r t z u i o p š đ
   Q W E R T Z U I O P Š Đ
   a s d f g h j k l č ć ž \\n
   A S D F G H J K L Č Ć Ž \\n
    y x c v b n m , . -
    Y X C V B N M ; : _
`;

const qwerty = new Layout("QWERTY", QWERTY);
const serbian = new Layout ("SERBIAN", SERBIAN);

export {serbian};