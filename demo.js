// const devanagariMap = {
//     'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ii': 'ई', 'u': 'उ', 'uu': 'ऊ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
//     'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ', 'nga': 'ङ',
//     'cha': 'च', 'chha': 'छ', 'ja': 'ज', 'jha': 'झ', 'nya': 'ञ',
//     'ṭa': 'ट', 'ṭha': 'ठ', 'ḍa': 'ड', 'ḍha': 'ढ', 'ṇa': 'ण',
//     'ta': 'त', 'tha': 'थ', 'da': 'द', 'dha': 'ध', 'na': 'न',
//     'pa': 'प', 'pha': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
//     'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व',
//     'sha': 'श', 'ṣa': 'ष', 'sa': 'स', 'ha': 'ह'
// };

// function transliterateToHindi(text) {
//     return text.split(" ").map(word => devanagariMap[word.toLowerCase()] || word).join(" ");
// }

// // Example usage
// console.log("Translated Text:", transliterateToHindi("namaste"));



// const letterMap = {
//     'a': 'अ', 'b': 'ब', 'c': 'क', 'd': 'द', 'e': 'ए', 'f': 'फ', 'g': 'ग', 'h': 'ह',
//     'i': 'इ', 'j': 'ज', 'k': 'क', 'l': 'ल', 'm': 'म', 'n': 'न', 'o': 'ओ', 'p': 'प',
//     'q': 'क', 'r': 'र', 's': 'स', 't': 'त', 'u': 'उ', 'v': 'व', 'w': 'व', 'x': 'क्स',
//     'y': 'य', 'z': 'ज'
// };

// function romanizedToHindi(text) {
//     return text.split('').map(char => letterMap[char.toLowerCase()] || char).join('');
// }

// // Example usage
// console.log(romanizedToHindi("Parvez alam ansari")); // Output: "परवेज" (approximate transliteration)



const transliterationRules = [
    [/aa/g, 'आ'], [/a/g, 'अ'], [/b/g, 'ब'], [/c/g, 'क'], [/d/g, 'द'],
    [/e/g, 'ए'], [/f/g, 'फ'], [/g/g, 'ग'], [/h/g, 'ह'], [/i/g, 'इ'],
    [/j/g, 'ज'], [/k/g, 'क'], [/l/g, 'ल'], [/m/g, 'म'], [/n/g, 'न'],
    [/o/g, 'ओ'], [/p/g, 'प'], [/q/g, 'क'], [/r/g, 'र'], [/s/g, 'स'],
    [/t/g, 'त'], [/u/g, 'उ'], [/v/g, 'व'], [/w/g, 'व'], [/x/g, 'क्ष'],
    [/y/g, 'य'], [/z/g, 'ज'], [/ch/g, 'च'], [/sh/g, 'श'], [/th/g, 'थ'],
    [/ph/g, 'फ'], [/gh/g, 'घ'], [/dh/g, 'ध'], [/bh/g, 'भ']
];

function hinglishToHindi(text) {
    let hindiText = text.toLowerCase();
    transliterationRules.forEach(([pattern, replacement]) => {
        hindiText = hindiText.replace(pattern, replacement);
    });
    return hindiText;
}

// Example usage
console.log(hinglishToHindi("namaste परवेज, alam ansari kumari"));




