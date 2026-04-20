# 💸 카카오페이 N빵 지원금 극대화기

> 실제 금액과 인원수만 넣으면, 카카오페이의 잔돈 지원금을 **최대**로 받도록 입력해야 할 금액을 계산해드립니다.

🔗 **[바로 써보기](https://jsh3418.github.io/geoji-nbbang/)**

---

## 🤔 이게 뭔가요?

카카오페이의 N빵(더치페이) 기능은 **금액이 인원수로 나누어떨어지지 않을 때 발생하는 잔돈을 카카오페이가 지원금으로 채워주는** 재미있는 특징이 있습니다.

즉, 나머지가 클수록 지원금이 커집니다. 예를 들어:

- 4,000원을 4명이 N빵 → 1,000원씩, 지원금 0원 😐
- **4,003원을 4명이 N빵 → 1,001원씩, 3원은 카카오페이가 대신 지원** 🎉

이 계산기는 **1회 최대 이득인 `(인원수 − 1)원`** 을 받아낼 수 있도록 입력해야 할 금액을 즉시 알려줍니다.

> 원본 유머: [X(@sepiroot)의 게시글](https://x.com/sepiroot/status/1445586800605478913)

---

## 🧮 계산 공식

핵심 로직은 [calc.js](calc.js)에 있습니다.

```js
function calcKakaoPay(amount, people) {
  const remainder = amount % people;
  const add = (people - 1 - remainder + people) % people;
  const inputAmount = amount + add;
  const perPerson = Math.floor(inputAmount / people);
  const kakaoPay = inputAmount % people;
  return { amount, people, add, inputAmount, perPerson, kakaoPay };
}
```

| 필드 | 의미 |
| --- | --- |
| `amount` | 실제 결제해야 할 원래 금액 |
| `people` | N빵할 인원수 |
| `add` | 카카오페이에 추가로 입력할 보정 금액 |
| `inputAmount` | **카카오페이에 입력할 최종 금액** (`amount + add`) |
| `perPerson` | 1인당 청구되는 금액 (내림) |
| `kakaoPay` | 카카오페이가 지원해주는 금액 (= `people - 1`) |

### 수학적 성질

- 항상 `kakaoPay === people - 1` (최대 이득)
- 항상 `0 ≤ add < people`
- 항상 `inputAmount === perPerson × people + kakaoPay`

---

## 📱 사용 예시

| 실제 금액 | 인원 | 입력할 금액 | 1인당 | 지원금 |
| ---: | ---: | ---: | ---: | ---: |
| 20,000원 | 4명 | **20,003원** | 5,000원 | +3원 |
| 19,000원 | 3명 | **19,001원** | 6,333원 | +2원 |
| 45,000원 | 3명 | **45,002원** | 15,000원 | +2원 |
| 100,000원 | 5명 | **100,004원** | 20,000원 | +4원 |

---

## 🛠 기술 스택

- **Vanilla JavaScript** — 빌드 도구 없음, 번들러 없음
- **HTML + CSS** — 단일 파일 ([index.html](index.html))
- **Jest** — 테스트 프레임워크

브라우저와 Node.js 모두에서 동일한 [calc.js](calc.js)를 공유하도록 UMD 스타일 export 가드를 사용합니다.

```js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { calcKakaoPay };
}
```

---

## 🚀 시작하기

### 로컬에서 실행

별도 빌드 과정 없이 [index.html](index.html)을 브라우저로 바로 열면 됩니다.

```bash
# 간단한 정적 서버로 띄우기 (선택)
npx serve .
# 혹은
python3 -m http.server
```

### 테스트 실행

```bash
npm install
npm test           # 1회 실행
npm run test:watch # 변경 감지 모드
```

테스트는 [calc.test.js](calc.test.js)에 정의되어 있으며, 다음 세 가지 층위로 구성됩니다.

1. **구체 예시 테스트** — 실제 사용 상황 (회식, 밥값 등)
2. **경계값 테스트** — 최소 인원, 극단 금액, 큰 금액
3. **속성(property-based) 테스트** — 수학적 불변성을 랜덤 샘플링으로 1,000회 검증

---

## 📂 프로젝트 구조

```
geoji-nbbang/
├── index.html       # UI + 앱 스크립트 (단일 파일 SPA)
├── calc.js          # 핵심 계산 로직 (브라우저/Node 겸용)
├── calc.test.js     # Jest 테스트
├── og-image.png     # OG 공유용 이미지
├── package.json
└── package-lock.json
```

---

## 📜 라이선스

유머에서 시작된 장난감 프로젝트입니다. 자유롭게 사용하세요.

> ⚠️ 실제 카카오페이 정책이 변경될 수 있으므로, 본 계산기의 결과는 참고용입니다.
