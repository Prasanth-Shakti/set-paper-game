const generateGameID = function () {
  const id1 = generateRandomNumber();
  const id2 = generateRandomNumber();
  return `${id1}-${id2}`;
};

const generateRandomNumber = function () {
  return Math.floor(1000 + Math.random() * 9000);
};

export { generateGameID };
