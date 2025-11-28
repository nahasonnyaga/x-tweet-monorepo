import React from 'react';
import { Media } from '@types/media';

interface Props {
  media: Media;
}

const MediaPreview: React.FC<Props> = ({ media }) => {
  if (media.type.startsWith('image')) {
    return <img src={media.url} alt={media.description || 'media'} />;
  } else if (media.type.startsWith('video')) {
    return <video controls src={media.url} />;
  }
  return null;
};

export default MediaPreview;
