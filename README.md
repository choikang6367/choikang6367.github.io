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

- Works 편집기에서 모음·사진 정보 수정, 추가, 삭제, 순서 변경. WebP 변환 결과의 `Works에 추가` 버튼은 현재 모음에 사진 항목을 만들어 줍니다.
- `변경 내용 복사`를 누른 뒤 GitHub의 `src/portfolio-data.json` 편집 화면에서 전체 내용을 붙여넣고 커밋
- 새 사진: 관리 화면에서 이미지를 선택하면 WebP(품질 82%)로 변환됩니다. 변환 파일을 내려받아 GitHub에 올린 뒤 정보 파일에 `/photos/파일명.webp` 경로를 추가
- GitHub에 커밋하면 Actions가 사이트를 다시 배포

사이트 화면은 방문자에게 읽기 전용입니다. 실제 수정 권한은 GitHub 저장소가 검사하며, 쓰기 권한이 있는 계정만 변경을 저장할 수 있습니다.
