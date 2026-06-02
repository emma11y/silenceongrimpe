import { VideoItem } from '@shared/models/video-item';

const VIDEO_TOKEN_PATTERN = /\[\[video:\s*([\s\S]*?)\s*\]\]/gi;
const THUMBNAIL_TOKEN_PATTERN = /\[\[thumbnail:\s*([\s\S]*?)\s*\]\]/gi;
const TRANSCRIPTION_TOKEN_PATTERN = /\[\[transcription:\s*([\s\S]*?)\s*\]\]/gi;
const VIDEO_BLOCK_TOKEN_PATTERN =
  /\[\[video:\s*([\s\S]*?)\s*\]\]\s*\[\[thumbnail:\s*([\s\S]*?)\s*\]\]\s*\[\[transcription:\s*([\s\S]*?)\s*\]\]/gi;

function escapeHtmlAttribute(value: string | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildVideoPlayerTag(video: VideoItem, index: number): string {
  return [
    '<div class="video-container">',
    '<app-video-player',
    ` data-video-id="${index}"`,
    ` data-video-src="${escapeHtmlAttribute(video.src)}"`,
    ` data-video-thumbnail="${escapeHtmlAttribute(video.thumbnail)}"`,
    ` data-video-transcription="${escapeHtmlAttribute(video.transcription)}"`,
    ` data-article="true"`,
    '></app-video-player>',
    '</div>',
  ].join('');
}

export function createVideoToken(video: VideoItem): string {
  return `[[video:${video.src}]][[thumbnail:${video.thumbnail}]][[transcription:${video.transcription}]]`;
}

export function extractVideos(value: string): VideoItem[] {
  if (!value) {
    return [];
  }

  const videoTokens = Array.from(value.matchAll(VIDEO_TOKEN_PATTERN));
  const thumbnailTokens = Array.from(value.matchAll(THUMBNAIL_TOKEN_PATTERN));
  const transcriptionTokens = Array.from(
    value.matchAll(TRANSCRIPTION_TOKEN_PATTERN),
  );

  const items: VideoItem[] = [];

  for (let index = 0; index < videoTokens.length; index++) {
    const src = videoTokens[index][1];
    const thumbnail = thumbnailTokens[index][1];
    const transcription = transcriptionTokens[index][1].trim();

    items.push({
      id: index,
      src,
      thumbnail,
      transcription,
    });
  }

  return items;
}

export function buildHtmlWithVideos(html: string): string {
  if (!html) {
    return html;
  }

  let index = 0;

  return html.replace(
    VIDEO_BLOCK_TOKEN_PATTERN,
    (_match, src: string, thumbnail: string, transcription: string) => {
      const video: VideoItem = {
        id: index,
        src: src.trim(),
        thumbnail: thumbnail.trim(),
        transcription: transcription.trim(),
      };

      const markup = buildVideoPlayerTag(video, index);
      index += 1;

      return markup;
    },
  );
}
