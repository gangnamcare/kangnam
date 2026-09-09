# 강남간호방문요양센터 홈페이지

메인, 센터 소개, 오시는 길, 서비스 상세, 장기요양 안내, 소식/정보, 상담, 채용, 약관 등 지금까지 만든 전체 홈페이지입니다. 센터 소개와 오시는 길의 최신 개선 내용도 포함합니다.

## GitHub에 올리기

1. ZIP의 압축을 풉니다.
2. GitHub 저장소에 `gangnam-care-github-vercel` 폴더 **안의 파일과 dist 폴더 전체**를 올립니다. ZIP 파일 자체를 올리는 방식은 Vercel 소스 배포가 아닙니다.
3. 저장소 최상위에 package.json, vercel.json, build.mjs, site.config.mjs와 dist 폴더가 있어야 합니다.
4. .gitignore도 함께 포함합니다. 기존 Sites 저장소의 Git 이력이나 인증 정보는 이 패키지에 포함하지 않았습니다.

## Vercel에 배포하기

1. GitHub 업로드 후 Vercel에서 새 프로젝트를 만들고 해당 저장소를 연결합니다.
2. 프로젝트 루트는 package.json과 vercel.json이 있는 디렉터리입니다. 폴더 안에 다시 넣어 업로드했다면 Root Directory를 해당 폴더로 지정합니다.
3. Framework Preset: Other / Build Command: node build.mjs / Output Directory: dist.
4. vercel.json에 빌드와 경로 설정이 포함되어 있습니다. 환경 변수나 외부 라이브러리 설치는 현재 사이트에 필요하지 않습니다.
5. Deploy 후 메인, /about, /location, /contact와 없는 주소의 404 화면을 확인합니다.

이 패키지의 로컬 빌드·링크·검사 스크립트는 검증했습니다. 실제 GitHub 업로드와 Vercel 배포는 아직 수행하지 않았습니다.

공식 배포 설정 참고: https://vercel.com/docs/project-configuration

## 수정할 파일

- site.config.mjs: 센터명, 전화, 주소, 운영시간, 사업자 정보, 지도 링크, 교통편, 주차, 서비스 지역
- center-pages.mjs: 센터 소개/오시는 길 콘텐츠
- build.mjs: 나머지 페이지 콘텐츠와 공통 헤더/푸터
- dist/style.css, dist/center.css: 디자인
- dist/app.js: 메뉴, 주소 복사, 상담 양식
- dist/assets/: 최적화된 이미지

dist 안의 CSS, JavaScript와 이미지는 직접 관리하는 원본 자산입니다. dist 폴더를 삭제하거나 Git에서 제외하지 마세요. 콘텐츠 수정 후 `node build.mjs`로 HTML을 다시 생성합니다. 새 경로를 추가하면 vercel.json의 routes도 추가해야 합니다.

## 로컬 확인

Node.js가 설치된 환경에서:

```sh
node build.mjs
node check.mjs
node test-form.mjs
node test-center.mjs
node server.mjs
```

미리보기 주소: http://localhost:4173

## 운영 전 남은 사항

- 대표자 성택암, 사업자등록번호 229-82-63602, 주소 서울시 강남구 테헤란로52길 6 테헤란오피스빌딩 407호, 전화 02-6380-7500, 이메일 help@kangnam.org, 서비스 지역 전국, 운영시간 오전 9시~오후 7시(월~토) 반영 완료
- 교통편 및 주차 정보는 추가 확인 필요
- 실제 취급 복지용구와 서비스 조건·요금 확인
- 상담 수신 API/비공개 저장소 및 관리자 열람 방식 구축
- 개인정보처리방침·이용약관·수집 동의 문구의 검토와 확정
- 실제 공지 및 돌봄 정보 등록 (현재는 빈 목록과 명시된 예시 상세 화면)

현재 온라인 상담은 미연결입니다. 입력 항목만 검증하며 상담 내용은 실제 전송·저장되지 않습니다. 서버가 실제 접수 후 HTTP 2xx와 {"accepted":true,"receiptId":"실제 접수번호"}를 반환할 때만 완료 안내가 나오도록 구현되어 있습니다. API 주소 설정만으로 실제 접수 서버가 만들어지지는 않습니다.

사진은 서비스 설명용 AI 연출 이미지이며 실제 센터 직원/이용자 사진이 아닙니다. 제도 관련 출처와 확인일은 각 관련 페이지에 표시되어 있습니다.
