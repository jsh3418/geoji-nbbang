const { calcKakaoPay } = require("./calc");

describe("calcKakaoPay — 구체 예시 (단위 테스트)", () => {
  test("20,000원을 4명이 N빵 (이미 나누어떨어지는 경우)", () => {
    expect(calcKakaoPay(20000, 4)).toEqual({
      amount: 20000,
      people: 4,
      add: 3,
      inputAmount: 20003,
      perPerson: 5000,
      kakaoPay: 3,
    });
  });

  test("19,000원을 3명이 N빵 (이미 나머지 1이 있는 경우)", () => {
    expect(calcKakaoPay(19000, 3)).toEqual({
      amount: 19000,
      people: 3,
      add: 1,
      inputAmount: 19001,
      perPerson: 6333,
      kakaoPay: 2,
    });
  });

  test("19,001원을 3명이 N빵 (이미 최대 나머지라 보정 불필요)", () => {
    expect(calcKakaoPay(19001, 3)).toEqual({
      amount: 19001,
      people: 3,
      add: 0,
      inputAmount: 19001,
      perPerson: 6333,
      kakaoPay: 2,
    });
  });

  test("4,000원을 4명이 N빵 (원본 유머 예시)", () => {
    expect(calcKakaoPay(4000, 4)).toMatchObject({
      add: 3,
      inputAmount: 4003,
      perPerson: 1000,
      kakaoPay: 3,
    });
  });

  test("45,000원을 3명이 N빵 (밥값 예시)", () => {
    expect(calcKakaoPay(45000, 3)).toMatchObject({
      add: 2,
      inputAmount: 45002,
      perPerson: 15000,
      kakaoPay: 2,
    });
  });

  test("100,000원을 5명이 N빵 (회식 예시)", () => {
    expect(calcKakaoPay(100000, 5)).toMatchObject({
      add: 4,
      inputAmount: 100004,
      perPerson: 20000,
      kakaoPay: 4,
    });
  });
});

describe("calcKakaoPay — 경계값", () => {
  test("최소 인원수 (100원, 2명)", () => {
    expect(calcKakaoPay(100, 2)).toMatchObject({
      add: 1,
      inputAmount: 101,
      perPerson: 50,
      kakaoPay: 1,
    });
  });

  test("금액 = 인원수인 극단 (5원, 5명)", () => {
    expect(calcKakaoPay(5, 5)).toMatchObject({
      add: 4,
      inputAmount: 9,
      perPerson: 1,
      kakaoPay: 4,
    });
  });

  test("큰 금액 (10,000,000원, 7명)", () => {
    const r = calcKakaoPay(10_000_000, 7);
    expect(r.kakaoPay).toBe(6);
    expect(r.perPerson * 7 + r.kakaoPay).toBe(r.inputAmount);
  });
});

describe("calcKakaoPay — 불변성 (속성 기반)", () => {
  test("카카오페이 부담은 항상 people - 1 (최대 이득)", () => {
    for (let people = 2; people <= 50; people++) {
      for (let amount = people; amount <= people + 200; amount++) {
        const r = calcKakaoPay(amount, people);
        expect(r.kakaoPay).toBe(people - 1);
      }
    }
  });

  test("inputAmount === perPerson × people + kakaoPay (수학적 항등식)", () => {
    let seed = 42;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 1000; i++) {
      const people = 2 + Math.floor(rng() * 98);
      const amount = people + Math.floor(rng() * 1_000_000);
      const r = calcKakaoPay(amount, people);
      expect(r.inputAmount).toBe(r.perPerson * people + r.kakaoPay);
    }
  });

  test("0 ≤ add < people", () => {
    for (let people = 2; people <= 30; people++) {
      for (let amount = people; amount <= people * 20; amount++) {
        const r = calcKakaoPay(amount, people);
        expect(r.add).toBeGreaterThanOrEqual(0);
        expect(r.add).toBeLessThan(people);
      }
    }
  });

  test("add === inputAmount - amount", () => {
    for (let people = 2; people <= 20; people++) {
      for (let amount = people; amount <= 1000; amount++) {
        const r = calcKakaoPay(amount, people);
        expect(r.inputAmount - r.amount).toBe(r.add);
      }
    }
  });

  test("정상 입력(amount ≥ people)에서 perPerson ≥ 1", () => {
    for (let people = 2; people <= 50; people++) {
      for (let amount = people; amount <= people * 10; amount++) {
        const r = calcKakaoPay(amount, people);
        expect(r.perPerson).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
