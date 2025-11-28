import React from 'react';
import { Media } from '@types/media';
import MediaPreview from './MediaPreview';

interface Props {
  mediaItems: Media[];
}

const MediaList: React.FC<Props> = ({ mediaItems }) => (
  <div>
    {mediaItems.map((item) => (
      <MediaPreview key={item.id} media={item} />
    ))}
  </div>
);

export default MediaList;
