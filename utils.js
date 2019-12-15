//use to parse tag string into an array where all leading and trailing whitespace is removed and all alphabetical charactes are converted into lowercase
const tagParser = tagStr => {
  return tagStr.split(",")
    .filter(char => {
      return char !== "" && char !== " ";
    })
    .map(char => {
      return whitespaceRemover(char);
    });
}

const whitespaceRemover = singleTag => {
  let strToReturn = "";

  for (const char of singleTag) {
    if (char !== " ") {
      strToReturn += char.toLowerCase();
    }
  }

  return strToReturn;
}

module.exports = {tagParser};
