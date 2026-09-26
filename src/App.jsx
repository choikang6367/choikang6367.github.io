import { useEffect, useRef, useState } from 'react';

const userFrames = [
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

const makeReferenceFrames = (collection, entries) =>
  entries.map(([file, title]) => ({
    src: '/reference/works/' + collection + '/' + file,
    alt: title,
    title,
    camera: '미기록',
    film: '미기록',
  }));

const referenceUntitledFrames = makeReferenceFrames('Untitled', [
  ['012-daisy.jpeg', '012 daisy'],
  ['011-cloud-and-tree.jpeg', '011 cloud and tree'],
  ['010-dry.jpeg', '010 dry'],
  ['009-foxtail.jpeg', '009 foxtail'],
  ['008-gangneung.jpeg', '008 gangneung'],
  ['007-goldfish.jpeg', '007 goldfish'],
  ['006-Lahaina-Noon.jpeg', '006 Lahaina Noon'],
  ['005-lotus.jpeg', '005 lotus'],
  ['004-way-to-hangang.jpeg', '004 way to hangang'],
  ['003-snack-bar.jpeg', '003 snack bar'],
  ['002-watch.jpeg', '002 watch'],
  ['001-on-a-date.jpeg', '001 on a date'],
  ['000-collisionism.jpeg', '000 collisionism'],
]);

const bangkokFrames = makeReferenceFrames('Bangkok', [
  ['005-Express.jpeg', '005 Express'],
  ['004-Dawm-Arun.jpeg', '004 Dawm Arun'],
  ['003-glasses.jpeg', '003 glasses'],
  ['002-red-lantern.jpeg', '002 red lantern'],
  ['001-sky.jpeg', '001 sky'],
  ['000-Pride.jpeg', '000 Pride'],
]);

const panoramaFrames = makeReferenceFrames('Panorama', [
  ['006-subway-in-bangkok.jpeg', '006 subway in bangkok'],
  ['005-black-taxi.jpeg', '005 black taxi'],
  ['004-tennis.jpeg', '004 tennis'],
  ['003-painting.jpeg', '003 painting'],
  ['002-drink.jpeg', '002 drink'],
  ['001-yeouido.jpeg', '001 yeouido'],
]);

const projects = [
  {
    id: 'seoul',
    title: 'Untitled',
    navTitle: 'Untitled',
    details: ['Seoul, Korea', '35mm Film'],
    year: '2026',
    layout: 'grid',
    frames: userFrames,
  },
  {
    id: 'untitled',
    title: 'Untitled',
    navTitle: 'Untitled · Archive',
    details: [],
    year: '2026',
    layout: 'grid',
    frames: referenceUntitledFrames,
  },
  {
    id: 'bangkok',
    title: 'Bangkok, Thailand',
    navTitle: 'Bangkok, Thailand',
    details: [],
    year: '2026',
    layout: 'grid',
    frames: bangkokFrames,
  },
  {
    id: 'panorama',
    title: 'Panorama',
    navTitle: 'Panorama',
    details: [],
    year: '',
    layout: 'panorama',
    frames: panoramaFrames,
  },
];

const instagramUrl = 'https://www.instagram.com/trytastingfilm/';

const routeFromHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'about') return { page: 'about', projectId: 'seoul' };

  const requestedId = hash.startsWith('works/') ? hash.slice('works/'.length) : 'seoul';
  const projectId = projects.some((project) => project.id === requestedId)
    ? requestedId
    : 'seoul';

  return { page: 'works', projectId };
};

export function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const currentProject =
    projects.find((project) => project.id === route.projectId) ?? projects[0];
  const selectedFrame =
    selectedIndex === null ? null : currentProject.frames[selectedIndex];

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(routeFromHash());
      setMenuOpen(false);
      setSelectedIndex(null);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeViewer = () => {
    setSelectedIndex(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const moveFrame = (step) => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      const total = currentProject.frames.length;
      return (current + step + total) % total;
    });
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>

      <header className="site-header">
        <a className="site-title" href="#works" onClick={closeMenu}>
          CHOIKANG
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label="메뉴"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>Menu</span>
          <span className="menu-icon" aria-hidden="true" />
        </button>

        <nav
          className={'site-nav' + (menuOpen ? ' is-open' : '')}
          id="site-nav"
          aria-label="주 메뉴"
        >
          <div className="nav-group">
            <a
              className={'nav-link' + (route.page === 'works' ? ' is-active' : '')}
              href="#works"
              onClick={closeMenu}
            >
              Works
            </a>
            <div className="project-nav" aria-label="작품 모음">
              {projects.map((project) => (
                <a
                  className={
                    'project-link' +
                    (route.page === 'works' && route.projectId === project.id
                      ? ' is-active'
                      : '')
                  }
                  href={'#works/' + project.id}
                  key={project.id}
                  aria-current={
                    route.page === 'works' && route.projectId === project.id
                      ? 'page'
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  <span>{project.navTitle}</span>
                  {project.details.length > 0 && (
                    <span className="project-details">
                      {project.details.map((detail) => (
                        <span key={detail}>{detail}</span>
                      ))}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <a
            className={'nav-link' + (route.page === 'about' ? ' is-active' : '')}
            href="#about"
            onClick={closeMenu}
          >
            About
          </a>

          <a
            className="nav-link external-link"
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Instagram <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main className="site-main" id="main-content">
        {route.page === 'about' ? (
          <section className="about-inner" aria-labelledby="about-title">
            <h1 id="about-title">About</h1>
            <div className="about-copy">
              <p>A photographer.</p>
              <ul className="camera-list">
                <li>SEOUL, KOREA</li>
                <li>35MM FILM</li>
              </ul>
              <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
                @trytastingfilm <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        ) : (
          <section
            className="project"
            data-project={currentProject.title}
            aria-labelledby="project-title"
          >
            <header className="project-header">
              <h1 id="project-title">{currentProject.title}</h1>
              {currentProject.year && <p>{currentProject.year}</p>}
            </header>

            <div
              className={
                'gallery' +
                (currentProject.layout === 'panorama' ? ' is-panorama' : '')
              }
              aria-label={currentProject.title + ' 사진 모음'}
            >
              {currentProject.frames.map((frame, index) => (
                <figure className="gallery-item" key={frame.src}>
                  <button
                    className="image-button"
                    type="button"
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedIndex(index);
                    }}
                    aria-label={frame.title + ' 크게 보기'}
                  >
                    <img
                      src={frame.src}
                      alt={frame.alt}
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                  </button>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedFrame && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedFrame.title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={closeViewer}
            ref={closeButtonRef}
            aria-label="사진 닫기"
          >
            ×
          </button>

          <button
            className="lightbox-control"
            type="button"
            onClick={() => moveFrame(-1)}
            aria-label="이전 사진"
          >
            ←
          </button>

          <figure className="lightbox-stage">
            <img className="lightbox-image" src={selectedFrame.src} alt={selectedFrame.alt} />
            <figcaption className="lightbox-caption">
              <span className="lightbox-title">{selectedFrame.title}</span>
              <dl className="photo-metadata">
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

          <button
            className="lightbox-control"
            type="button"
            onClick={() => moveFrame(1)}
            aria-label="다음 사진"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
