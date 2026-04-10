function calcKakaoPay(amount, people) {
  const remainder = amount % people;
  const add = (people - 1 - remainder + people) % people;
  const inputAmount = amount + add;
  const perPerson = Math.floor(inputAmount / people);
  const kakaoPay = inputAmount % people;
  return { amount, people, add, inputAmount, perPerson, kakaoPay };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calcKakaoPay };
}
