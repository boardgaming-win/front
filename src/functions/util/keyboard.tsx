const hangeulMap: { [key: string]: string } = {
    'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f', 'ㅁ': 'a',
    'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W',
    'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g', 'ㅏ': 'k', 'ㅐ': 'o',
    'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j', 'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h',
    'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nj', 'ㅞ': 'np',
    'ㅟ': 'nl', 'ㅠ': 'b', 'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l'
};

function convertToEnglish(event: any): string {
    const keyCode = event.keyCode || event.which;
  
    const inputValue = event.target.value;
    let convertedText = undefined;
  
    if (keyCode !== 8 && keyCode !== 46) {  // Backspace와 Delete 키는 예외 처리
      convertedText = '';
      for (let i = 0; i < inputValue.length; i++) {
        const char = inputValue[i];
        if (hangeulMap[char]) {
          convertedText += hangeulMap[char];
        } else {
          convertedText += char;
        }
      }
    }
    
    return convertedText || inputValue;
}

export {
  convertToEnglish
};