import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

const frames = [
  {
    src: '/photos/urban-evening.jpg',
    alt: '해가 진 뒤 도시 도로를 오가는 자동차의 불빛',
    title: '도시의 속도',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/lamp-after-dusk.jpg',
    alt: '푸른 저녁 하늘 아래 켜진 가로등과 건물',
    title: '푸른 시간',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/bridge-at-blue-hour.jpg',
    alt: '다리 아래로 이어지는 길과 저녁의 풍경',
    title: '다리 아래',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/night-court.jpg',
    alt: '밤의 운동장과 멀리 보이는 불빛',
    title: '늦은 밤의 운동장',
    camera: '미기록',
    film: '500T',
  },
  {
    src: '/photos/station-window.jpg',
    alt: '밤에 바라본 역 주변의 창과 불빛',
    title: '창 너머의 밤',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/parking-light.jpg',
    alt: '밤 주차장에 남은 조명과 자동차',
    title: '남겨진 불빛',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/night-light.jpg',
    alt: '어둠 속에서 번지는 따뜻한 빛',
    title: '빛의 가장자리',
    camera: '미기록',
    film: '미기록',
  },
  {
    src: '/photos/shop-sign.jpg',
    alt: '저녁 거리의 가게 간판',
    title: '문 닫기 전',
    camera: '미기록',
    film: '500T',
  },
  {
    src: '/photos/frame-notes.jpg',
    alt: '필름 촬영에 관한 손글씨 메모',
    title: '필름의 메모',
    camera: '미기록',
    film: '미기록',
  },
];

export function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const closeViewer = () => {
    setSelectedIndex(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const moveFrame = (step) => {
    setSelectedIndex((current) => (current + step + frames.length) % frames.length);
  };

  useEffect(() => {
    if (selectedIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') moveFrame(-1);
      if (event.key === 'ArrowRight') moveFrame(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const selectedFrame = selectedIndex === null ? null : frames[selectedIndex];

  return (
    <div className="portfolio-shell">
      <aside className="side-rail" aria-label="사이트 메뉴">
        <a className="wordmark" href="#works" aria-label="필름 아카이브 홈">
          <span className="wordmark-mark">C</span>
          <span className="wordmark-name">CHOIKANG</span>
        </a>

        <nav className="rail-middle" aria-label="주요 메뉴">
          <a className="rail-heading" href="#works">Works</a>
          <a className="rail-project" href="#works">
            <strong>Untitled</strong>
            <span>Seoul, Korea</span>
            <span>35mm Film</span>
          </a>
          <div className="rail-secondary-links">
            <button
              className="rail-text-link"
              type="button"
              aria-expanded={aboutOpen}
              aria-controls="about-details"
              onClick={() => setAboutOpen((open) => !open)}
            >
              About
            </button>
            {aboutOpen && (
              <div className="about-details" id="about-details">
                <span>35MM FILM ARCHIVE</span>
                <span>CHOIKANG · SEOUL</span>
              </div>
            )}
            <a
              className="rail-social"
              href="https://www.instagram.com/trytastingfilm/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </nav>

        <span className="rail-index">© CHOIKANG</span>
      </aside>

      <main id="works" className="works-main">
        <header className="works-heading">
          <div>
            <p className="section-eyebrow">SELECTED FRAMES / 01</p>
            <h1>Works</h1>
          </div>
          <span className="frame-count"><b>09</b> FRAMES</span>
        </header>

        <section className="photo-grid" aria-label="필름 사진 모음">
          {frames.map((frame, index) => (
            <button
              className="photo-card"
              key={frame.src}
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedIndex(index);
              }}
              aria-label={`${frame.title} 사진 크게 보기`}
            >
              <span className="card-image-wrap">
                <img src={frame.src} alt={frame.alt} loading={index < 6 ? 'eager' : 'lazy'} />
                <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="card-open" aria-hidden="true">↗</span>
              </span>
              <span className="card-caption">
                <span className="card-title">{frame.title}</span>
                <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              </span>
            </button>
          ))}
        </section>

        <footer className="site-footer">
          <span>35MM FILM ARCHIVE</span>
          <span>© CHOIKANG</span>
        </footer>
      </main>

      {selectedFrame && (
        <div
          className="viewer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <section className="photo-viewer" role="dialog" aria-modal="true" aria-label={selectedFrame.title}>
            <button
              className="viewer-close"
              type="button"
              onClick={closeViewer}
              ref={closeButtonRef}
              aria-label="사진 닫기"
            >
              <X aria-hidden="true" />
            </button>

            <button className="viewer-arrow viewer-previous" type="button" onClick={() => moveFrame(-1)} aria-label="이전 사진">
              <ChevronLeft aria-hidden="true" />
            </button>

            <figure className="viewer-figure">
              <img className="viewer-image" src={selectedFrame.src} alt={selectedFrame.alt} />
              <figcaption className="viewer-caption">
                <div className="viewer-title-row">
                  <span className="viewer-number">{String(selectedIndex + 1).padStart(2, '0')} / 09</span>
                  <h2>{selectedFrame.title}</h2>
                </div>
                <dl className="viewer-metadata">
                  <div>
                    <dt>CAMERA</dt>
                    <dd>{selectedFrame.camera}</dd>
                  </div>
                  <div>
                    <dt>FILM</dt>
                    <dd>{selectedFrame.film}</dd>
                  </div>
                </dl>
              </figcaption>
            </figure>

            <button className="viewer-arrow viewer-next" type="button" onClick={() => moveFrame(1)} aria-label="다음 사진">
              <ChevronRight aria-hidden="true" />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
