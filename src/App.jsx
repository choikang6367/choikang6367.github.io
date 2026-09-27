import { useEffect, useRef, useState } from 'react';
import portfolioData from './portfolio-data.json';
import PhotoConverter from './PhotoConverter';
import WorksEditor from './WorksEditor';

const defaultProjects = portfolioData.projects;
const instagramUrl = portfolioData.instagramUrl;
const editContentUrl =
  'https://github.com/choikang6367/choikang6367.github.io/edit/main/src/portfolio-data.json';
const isEditMode = new URLSearchParams(window.location.search).get('edit') === '1';

const routeFromHash = (availableProjects) => {
  const hash = window.location.hash.slice(1);
  if (hash === 'about') return { page: 'about', projectId: availableProjects[0].id };

  const requestedId = hash.startsWith('works/')
    ? hash.slice('works/'.length)
    : availableProjects[0].id;
  const projectId = availableProjects.some((project) => project.id === requestedId)
    ? requestedId
    : availableProjects[0].id;

  return { page: 'works', projectId };
};

export function App() {
  const [projects, setProjects] = useState(defaultProjects);
  const [route, setRoute] = useState(() => routeFromHash(defaultProjects));
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
      setRoute(routeFromHash(projects));
      setMenuOpen(false);
      setSelectedIndex(null);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projects]);

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

          {isEditMode && (
            <section className="editor-panel" aria-label="사이트 관리">
              <h2>관리 모드</h2>
              <a href="#works-editor-title">
                Works 편집 <span aria-hidden="true">↓</span>
              </a>
              <p>
                모음과 사진 정보를 고친 뒤 GitHub에 저장할 수 있어요.
              </p>
              <PhotoConverter />
            </section>
          )}
        </nav>
      </header>

      <main className="site-main" id="main-content">
        {route.page === 'works' && isEditMode && (
          <WorksEditor
            projects={projects}
            onChange={setProjects}
            instagramUrl={instagramUrl}
            editContentUrl={editContentUrl}
          />
        )}

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
