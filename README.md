# 빛이 머문 장면들

필름으로 기록한 도시와 일상의 장면을 모은 사진 아카이브입니다.

GitHub Pages 주소: https://choikang6367.github.io/

## 로컬에서 보기

```sh
npm ci
npm run dev
```

`main` 브랜치에 변경을 올리면 GitHub Actions가 사이트를 빌드하고 GitHub Pages에 배포합니다.

## 사진과 정보 수정

사이트 주소 뒤에 `?edit=1`을 붙여 열면 관리 링크가 나타납니다.

- 사진 제목, 카메라, 필름, 모음 정보: `src/portfolio-data.json`에서 수정
- 새 사진: `public/photos`에 업로드한 뒤 정보 파일에 `/photos/파일명` 경로를 추가
- GitHub에 커밋하면 Actions가 사이트를 다시 배포

사이트 화면은 방문자에게 읽기 전용입니다. 실제 수정 권한은 GitHub 저장소가 검사하며, 쓰기 권한이 있는 계정만 변경을 저장할 수 있습니다.
