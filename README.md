# MSG 2026 관악구 축제 바이브코딩 레포지토리

### 팀원
|이름|역할|이메일|
|---|---|---|
|강태우|개발|s2601@e-mirim.hs.kr|
|김수빈|개발|s2603@e-mirim.hs.kr|
|박준현|개발|s2544@e-mirim.hs.kr |
|윤기진|개발|s2546@e-mirim.hs.kr|
|강지윤|디자인|d2501@e-mirim.hs.kr|


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
git push origin 브랜치명
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

### skill
- front : React
- back: node.js(express)
- db : mysql, railway

### 갤러리 페이지

- 주소: `http://localhost:5173/gallery`
- 서버: `server` 폴더에서 `.env`에 DB 정보를 설정한 뒤 `npm start`
- 클라이언트: `client` 폴더에서 `npm install` 후 `npm run dev`
- 운영자가 공개 승인한 작품(`sessions.is_public = TRUE`)만 표시됩니다.
- 작품 이미지와 닉네임을 표시하며, 썸네일 선택 또는 좌우 버튼으로 작품을 이동합니다.
- 목록은 1분마다 자동 갱신됩니다. 선택한 작품은 유지하며, 숨겨진 탭에서는 조회를 쉬고 돌아오면 즉시 갱신합니다. 갱신 실패 시 기존 목록을 유지하고 다음 주기에 재시도합니다.
- 목록 조회 실패 시 다시 시도할 수 있습니다. 승인된 작품이 없으면 빈 목록 안내가 표시됩니다.
- 서버 API 테스트: `server` 폴더에서 `npm test` (실제 DB를 변경하지 않습니다.)
- 클라이언트 빌드 확인: `client` 폴더에서 `npm run build`


### 주의

- ⚠️ **절대 `main` 브랜치에서 직접 작업하지 말 것** — 반드시 개인 브랜치(`feat/...`)에서 작업
- ⚠️ **충돌(conflict) 발생 시 혼자 해결하려 하지 말고 선배 호출**
- ⚠️ **모르는 게 있으면 헤매지 말고 바로 선배 호출**
- ⚠️ **.env 파일은 절대 공유하지 말 것**

