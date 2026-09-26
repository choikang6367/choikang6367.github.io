import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const frames = [
  {
    src: '/photos/urban-evening.jpg',
    alt: '해가 진 뒤 도시 도로를 오가는 자동차의 불빛',
    title: '도시의 속도',
    note: '저녁이 내려앉은 길 위, 잠깐 느려진 장면.',
    roll: 'ARCHIVE SET / 01',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/lamp-after-dusk.jpg',
    alt: '푸른 저녁 하늘 아래 켜진 가로등과 건물',
    title: '푸른 시간',
    note: '낮과 밤 사이, 빛이 가장 오래 머무는 순간.',
    roll: 'ARCHIVE SET / 02',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/bridge-at-blue-hour.jpg',
    alt: '다리 아래로 이어지는 길과 저녁의 풍경',
    title: '다리 아래',
    note: '익숙한 길도 빛이 바뀌면 다른 장면이 된다.',
    roll: 'ARCHIVE SET / 03',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/night-court.jpg',
    alt: '밤의 운동장과 멀리 보이는 불빛',
    title: '늦은 밤의 운동장',
    note: '하루가 끝난 뒤에도 불이 켜져 있던 곳.',
    roll: 'ARCHIVE SET / 04',
    camera: '미기록',
    film: '500T',
  },
  {
    src: '/photos/station-window.jpg',
    alt: '밤에 바라본 역 주변의 창과 불빛',
    title: '창 너머의 밤',
    note: '지나가는 풍경을 창가에 잠시 붙잡아 둔다.',
    roll: 'ARCHIVE SET / 05',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/parking-light.jpg',
    alt: '밤 주차장에 남은 조명과 자동차',
    title: '남겨진 불빛',
    note: '사람이 떠난 자리에서 더 선명해진 색.',
    roll: 'ARCHIVE SET / 06',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/night-light.jpg',
    alt: '어둠 속에서 번지는 따뜻한 빛',
    title: '빛의 가장자리',
    note: '초점 밖으로 번져나간 작은 온기.',
    roll: 'ARCHIVE SET / 07',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/shop-sign.jpg',
    alt: '저녁 거리의 가게 간판',
    title: '문 닫기 전',
    note: '하루의 끝을 알리는 동네의 오래된 간판.',
    roll: 'ARCHIVE SET / 08',
    camera: '미기록',
    film: '500T',
  },
  {
    src: '/photos/frame-notes.jpg',
    alt: '필름 촬영에 관한 손글씨 메모',
    title: '필름의 메모',
    note: '사진을 찍고 난 뒤 남겨둔 작은 기록.',
    roll: 'ARCHIVE SET / 09',
    camera: '미기록',
    film: '미기록',
  },
];

export function App() {
  const [active, setActive] = useState(0);
  const current = frames[active];

  const move = useCallback((step) => {
    setActive((index) => (index + step + frames.length) % frames.length);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  return (
    <main className="portfolio-shell" id="top">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="필름 아카이브 홈">
          FILM <span>ARCHIVE</span>
        </a>
        <p className="header-caption">ANALOG PHOTOGRAPHS <span>·</span> PERSONAL ARCHIVE</p>
      </header>

      <section className="works-section" id="works" aria-labelledby="works-title">
        <h1 className="sr-only" id="works-title">빛이 머문 장면들</h1>
        <div className="gallery-layout">
          <div className="image-column">
            <div className="photo-frame">
              <img
                key={current.src}
                className="hero-photo"
                src={current.src}
                alt={current.alt}
                fetchPriority="high"
              />
              <span className="photo-grain" aria-hidden="true" />
              <span className="photo-corner photo-corner-top" aria-hidden="true">{current.roll}</span>
              <span className="photo-corner photo-corner-bottom" aria-hidden="true">FRAME {String(active + 1).padStart(2, '0')}</span>
            </div>
          </div>

          <aside className="frame-details" aria-live="polite" aria-atomic="true">
            <div className="details-topline">
              <span className="detail-current">{String(active + 1).padStart(2, '0')}</span>
              <span className="details-rule" />
              <span>{String(frames.length).padStart(2, '0')}</span>
            </div>
            <div className="detail-copy">
              <h2>{current.title}</h2>
              <p className="detail-meta">{current.roll}</p>
              <p className="frame-note">{current.note}</p>
              <dl className="capture-details">
                <div>
                  <dt>CAMERA</dt>
                  <dd>{current.camera}</dd>
                </div>
                <div>
                  <dt>FILM</dt>
                  <dd>{current.film}</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="carousel-controls" aria-label="사진 이동">
            <button type="button" className="arrow-button" onClick={() => move(-1)} aria-label="이전 사진">
              <ChevronLeft aria-hidden="true" strokeWidth={1.35} />
            </button>
            <button type="button" className="arrow-button" onClick={() => move(1)} aria-label="다음 사진">
              <ChevronRight aria-hidden="true" strokeWidth={1.35} />
            </button>
          </div>
        </div>

        <div className="filmstrip-wrap">
          <div className="filmstrip-label">
            <span>THE CONTACT SHEET</span>
            <span>01 — 09</span>
          </div>
          <div className="filmstrip" role="group" aria-label="사진 선택">
            {frames.map((frame, index) => (
              <button
                key={frame.src}
                type="button"
                className={`film-thumb${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
                aria-label={`${String(index + 1).padStart(2, '0')}번 사진: ${frame.title}`}
                aria-pressed={index === active}
              >
                <span className="thumb-image-wrap">
                  <img src={frame.src} alt="" loading="lazy" />
                  <span className="thumb-number">{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className="thumb-name">{frame.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>FILM ARCHIVE</span>
        <span>MADE OF LIGHT & TIME</span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
