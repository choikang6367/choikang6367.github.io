import { useState } from 'react';

const uploadPhotosUrl =
  'https://github.com/choikang6367/choikang6367.github.io/upload/main/public/photos';
const webpQuality = 0.82;

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const convertToWebp = async (file) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일을 선택해주세요.');
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('이미지를 읽지 못했습니다.');
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result?.type === 'image/webp') {
        resolve(result);
      } else {
        reject(new Error('이 브라우저에서 WebP 변환을 지원하지 않습니다.'));
      }
    }, 'image/webp', webpQuality);
  });

  const filename = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${filename}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
};

const downloadFile = (file) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const getSavingsText = (originalSize, convertedSize) => {
  if (!originalSize) return '';

  const savings = Math.round((1 - convertedSize / originalSize) * 100);
  return savings >= 0 ? `${savings}% 절감` : `${Math.abs(savings)}% 증가`;
};

export function PhotoConverter({ onAddToWorks }) {
  const [items, setItems] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleSelection = async (event) => {
    if (isConverting) return;

    const files = Array.from(event.currentTarget.files ?? []);
    setItems([]);
    if (files.length === 0) return;

    setIsConverting(true);
    const convertedItems = [];

    for (const [index, file] of files.entries()) {
      try {
        const webpFile = await convertToWebp(file);
        convertedItems.push({
          id: `${file.name}-${file.lastModified}-${index}`,
          originalName: file.name,
          originalSize: file.size,
          webpFile,
        });
      } catch (error) {
        convertedItems.push({
          id: `${file.name}-${file.lastModified}-${index}`,
          originalName: file.name,
          originalSize: file.size,
          error: error instanceof Error ? error.message : '변환하지 못했습니다.',
        });
      }

      setItems([...convertedItems]);
    }

    setIsConverting(false);
  };

  const addToWorks = (itemId) => {
    const selected = items.find((item) => item.id === itemId);
    if (!selected?.webpFile) return;

    const wasAdded = onAddToWorks(selected.webpFile);
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, addStatus: wasAdded ? 'added' : 'duplicate' }
          : item,
      ),
    );
  };

  return (
    <div className="webp-converter">
      <label className="webp-picker-label" htmlFor="photo-converter-input">
        WebP 변환
      </label>
      <input
        id="photo-converter-input"
        className="webp-file-input"
        type="file"
        accept="image/*"
        multiple
        disabled={isConverting}
        onChange={handleSelection}
      />
      <p className="webp-help">
        사진을 고르면 품질 82%로 자동 변환합니다. WebP를 저장·업로드한 뒤 현재
        Works 모음에 추가할 수 있어요.
      </p>

      {isConverting && <p className="webp-status" role="status">변환 중…</p>}

      {items.length > 0 && (
        <ul className="webp-results" aria-live="polite">
          {items.map((item) => (
            <li className="webp-result" key={item.id}>
              <div className="webp-result-info">
                <strong>{item.webpFile?.name ?? item.originalName}</strong>
                {item.webpFile ? (
                  <>
                    <span>
                      {formatSize(item.originalSize)} → {formatSize(item.webpFile.size)} ·{' '}
                      {getSavingsText(item.originalSize, item.webpFile.size)}
                    </span>
                    <code>/photos/{item.webpFile.name}</code>
                  </>
                ) : (
                  <span>{item.error}</span>
                )}
              </div>
              {item.webpFile && (
                <div className="webp-result-actions">
                  <button
                    className="webp-download"
                    type="button"
                    onClick={() => downloadFile(item.webpFile)}
                  >
                    저장
                  </button>
                  <button
                    className="webp-download"
                    type="button"
                    disabled={Boolean(item.addStatus)}
                    onClick={() => addToWorks(item.id)}
                  >
                    {item.addStatus === 'added'
                      ? 'Works에 추가됨'
                      : item.addStatus === 'duplicate'
                        ? '이미 추가됨'
                        : 'Works에 추가'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {items.some((item) => item.webpFile) && (
        <a className="webp-upload-link" href={uploadPhotosUrl} target="_blank" rel="noreferrer">
          변환한 사진 GitHub에 올리기 ↗
        </a>
      )}
    </div>
  );
}

export default PhotoConverter;
