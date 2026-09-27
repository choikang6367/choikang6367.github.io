import { useState } from 'react';

const newFrame = () => ({
  src: '/photos/파일명.webp',
  alt: '',
  title: '새 사진',
  camera: '미기록',
  film: '미기록',
});

const newProject = () => {
  const id = `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    title: '새 Works',
    navTitle: '새 Works',
    details: [],
    year: '',
    layout: 'grid',
    frames: [],
  };
};

export function WorksEditor({ projects, onChange, instagramUrl, editContentUrl }) {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? '');
  const [copyStatus, setCopyStatus] = useState('');
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  if (!activeProject) return null;

  const updateProject = (changes) => {
    onChange(
      projects.map((project) =>
        project.id === activeProject.id ? { ...project, ...changes } : project,
      ),
    );
  };

  const updateFrame = (frameIndex, changes) => {
    updateProject({
      frames: activeProject.frames.map((frame, index) =>
        index === frameIndex ? { ...frame, ...changes } : frame,
      ),
    });
  };

  const moveItem = (items, index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return items;

    const reordered = [...items];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    return reordered;
  };

  const addProject = () => {
    const project = newProject();
    onChange([...projects, project]);
    setActiveProjectId(project.id);
    setCopyStatus('');
  };

  const removeProject = () => {
    if (projects.length <= 1) return;
    const remaining = projects.filter((project) => project.id !== activeProject.id);
    onChange(remaining);
    setActiveProjectId(remaining[0].id);
    setCopyStatus('');
  };

  const addFrame = () => {
    updateProject({ frames: [...activeProject.frames, newFrame()] });
    setCopyStatus('');
  };

  const removeFrame = (frameIndex) => {
    updateProject({
      frames: activeProject.frames.filter((_, index) => index !== frameIndex),
    });
    setCopyStatus('');
  };

  const copyForGithub = async () => {
    const data = JSON.stringify({ instagramUrl, projects }, null, 2);

    try {
      await navigator.clipboard.writeText(data);
      setCopyStatus('복사했어요. GitHub 파일을 열어 전체 내용을 붙여넣고 커밋하세요.');
    } catch {
      setCopyStatus('복사에 실패했어요. 브라우저의 클립보드 권한을 확인해주세요.');
    }
  };

  return (
    <section className="works-editor" aria-labelledby="works-editor-title">
      <header className="works-editor-header">
        <div>
          <h2 id="works-editor-title">Works 편집</h2>
          <p>모음과 사진 정보를 바꾸면 오른쪽 작품 화면에 바로 반영됩니다.</p>
        </div>
        <button className="editor-action" type="button" onClick={addProject}>
          모음 추가
        </button>
      </header>

      <div className="works-editor-collections" aria-label="편집할 Works 모음">
        {projects.map((project, index) => (
          <div className="works-editor-collection" key={project.id}>
            <button
              className={
                'works-editor-tab' +
                (project.id === activeProject.id ? ' is-selected' : '')
              }
              type="button"
              aria-pressed={project.id === activeProject.id}
              onClick={() => setActiveProjectId(project.id)}
            >
              {project.navTitle || project.title || '제목 없는 모음'}
            </button>
            <button
              className="editor-move"
              type="button"
              aria-label={`${project.navTitle || project.title} 위로 이동`}
              disabled={index === 0}
              onClick={() => onChange(moveItem(projects, index, -1))}
            >
              ↑
            </button>
            <button
              className="editor-move"
              type="button"
              aria-label={`${project.navTitle || project.title} 아래로 이동`}
              disabled={index === projects.length - 1}
              onClick={() => onChange(moveItem(projects, index, 1))}
            >
              ↓
            </button>
          </div>
        ))}
      </div>

      <div className="works-editor-fields">
        <label>
          모음 제목
          <input
            value={activeProject.title}
            onChange={(event) => updateProject({ title: event.target.value })}
          />
        </label>
        <label>
          메뉴 이름
          <input
            value={activeProject.navTitle}
            onChange={(event) => updateProject({ navTitle: event.target.value })}
          />
        </label>
        <label>
          연도
          <input
            value={activeProject.year}
            onChange={(event) => updateProject({ year: event.target.value })}
          />
        </label>
        <label>
          갤러리 형태
          <select
            value={activeProject.layout}
            onChange={(event) => updateProject({ layout: event.target.value })}
          >
            <option value="grid">그리드</option>
            <option value="panorama">파노라마</option>
          </select>
        </label>
        <label className="works-editor-details">
          메뉴 상세 정보 (줄마다 하나씩)
          <textarea
            rows={Math.max(2, activeProject.details.length)}
            value={activeProject.details.join('\n')}
            onChange={(event) =>
              updateProject({
                details: event.target.value.split('\n').filter((detail) => detail !== ''),
              })
            }
          />
        </label>
      </div>

      <div className="works-editor-photos-header">
        <h3>사진 {activeProject.frames.length}장</h3>
        <div className="works-editor-actions">
          <button
            className="editor-action editor-action-muted"
            type="button"
            disabled={projects.length <= 1}
            onClick={removeProject}
          >
            모음 삭제
          </button>
          <button className="editor-action" type="button" onClick={addFrame}>
            사진 추가
          </button>
        </div>
      </div>

      {activeProject.frames.length === 0 ? (
        <p className="works-editor-empty">사진을 추가하고 이미지 경로와 정보를 입력하세요.</p>
      ) : (
        <div className="works-editor-photos">
          {activeProject.frames.map((frame, index) => (
            <article className="works-editor-photo" key={`${frame.src}-${index}`}>
              <header className="works-editor-photo-header">
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <div className="works-editor-actions">
                  <button
                    className="editor-move"
                    type="button"
                    aria-label={`${frame.title} 위로 이동`}
                    disabled={index === 0}
                    onClick={() => updateProject({ frames: moveItem(activeProject.frames, index, -1) })}
                  >
                    ↑
                  </button>
                  <button
                    className="editor-move"
                    type="button"
                    aria-label={`${frame.title} 아래로 이동`}
                    disabled={index === activeProject.frames.length - 1}
                    onClick={() => updateProject({ frames: moveItem(activeProject.frames, index, 1) })}
                  >
                    ↓
                  </button>
                  <button
                    className="editor-action editor-action-muted"
                    type="button"
                    onClick={() => removeFrame(index)}
                  >
                    삭제
                  </button>
                </div>
              </header>
              <div className="works-editor-photo-fields">
                <label className="works-editor-wide">
                  이미지 경로
                  <input
                    value={frame.src}
                    onChange={(event) => updateFrame(index, { src: event.target.value })}
                    placeholder="/photos/example.webp"
                  />
                </label>
                <label>
                  사진 제목
                  <input
                    value={frame.title}
                    onChange={(event) => updateFrame(index, { title: event.target.value })}
                  />
                </label>
                <label>
                  대체 텍스트
                  <input
                    value={frame.alt}
                    onChange={(event) => updateFrame(index, { alt: event.target.value })}
                  />
                </label>
                <label>
                  카메라
                  <input
                    value={frame.camera}
                    onChange={(event) => updateFrame(index, { camera: event.target.value })}
                  />
                </label>
                <label>
                  필름
                  <input
                    value={frame.film}
                    onChange={(event) => updateFrame(index, { film: event.target.value })}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="works-editor-publish">
        <button className="editor-action" type="button" onClick={copyForGithub}>
          변경 내용 복사
        </button>
        <a href={editContentUrl} target="_blank" rel="noreferrer">
          GitHub에서 저장 ↗
        </a>
        <p aria-live="polite">
          {copyStatus || '저장하려면 내용을 복사해 GitHub의 portfolio-data.json 전체를 바꾸고 커밋하세요.'}
        </p>
      </div>
    </section>
  );
}

export default WorksEditor;
