# MSG 2026 관악구 축제 바이브코딩 레포지토리

### 개발 세팅

- mysql 설치 확인
- Node.js 설치 확인: `node -v`
- Git 설치 확인: `git -v`

### 로컬 세팅

1. 레포 가져오기
   `git clone https://github.com/yxo1in/MSG_2026_ai_project.git`
2. vs code 실행

```
cd MSG_2026_ai_project
code .
```

3. server 패키지 설치

```
cd server
npm install
``` 

4. client 패키지 설치

```
cd client
npm install
```

5. `.env` 파일 생성 (선배한테 요청)

6. migrate.js 실행
   ```
   cd server
   node migrate.js
   ```

8. mysql workbench에 데이터베이스 추가하기 (선배한테 요청)

### 이슈 생성 방법

1. GitHub 레포 → **Issues** 탭 클릭
2. **New issue** 클릭
3. 템플릿 선택 (원하는 유형 클릭)

   | 템플릿 | 언제 쓰나요 |
   |---|---|
   | 🐛 bug | 오류가 나거나 예상과 다르게 동작할 때 |
   | ✨ feat | 새로운 기능을 추가하고 싶을 때 |
   | 🔧 fix | 버그는 아니지만 수정/개선이 필요할 때 |

4. 템플릿 양식대로 내용 작성 후 **Submit new issue**
5. 작업 시작할 때 브랜치 이름에 이슈 내용 반영하면 좋음
   예: `feat/12-login-page` (12는 이슈 번호)
6. 관련 PR 만들 때 본문에 `Closes #이슈번호` 적어두면, merge 시 이슈가 자동으로 닫힘

### 개발 흐름

0. **최신 main 받아오기**

```
git checkout main
git pull origin main
```

1. **개인 브랜치 생성**

```
git checkout -b feat/자기이름 or 이슈 이름
```

2. **브랜치로 체크아웃** (이미 만든 브랜치가 있는 경우)

```
git checkout feat/브랜치이름
```

3. **작업 후 커밋**

```
git add .
git commit -m "커밋 메시지 작성"
```

커밋 메시지는 무엇을 했는지 간단히: `feat: 로그인 페이지 UI 구현` 등

4. **원격 저장소에 푸시**

```
git push origin feat/브랜치이름
```

5. **메인에 병합 (Pull Request)**

- GitHub에서 `feat/브랜치이름` → `main`으로 **Pull Request** 생성
- 팀원 리뷰/확인 후 **Merge**
- 병합 완료되면 로컬에서 최신 main 받아오기:

```
git checkout main
git pull origin main
```

### 주의

- ⚠️ **절대 `main` 브랜치에서 직접 작업하지 말 것** — 반드시 개인 브랜치(`feat/...`)에서 작업
- ⚠️ **충돌(conflict) 발생 시 혼자 해결하려 하지 말고 선배 호출**
- ⚠️ **모르는 게 있으면 헤매지 말고 바로 선배 호출**
