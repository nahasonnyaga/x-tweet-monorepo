"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { ImageModal } from '@components/modal/image-modal';
import { Modal } from '@components/modal/modal';
import { NextImage } from '@components/ui/next-image';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import type { MotionProps } from 'framer-motion';
import type { ImagesPreview, ImageData } from '@lib/types/file';

type ImagePreviewProps = {
  tweet?: boolean;
  viewTweet?: boolean;
  previewCount: number;
  imagesPreview: ImagesPreview;
  removeImage?: (targetId: string) => () => void;
};

const variants: MotionProps = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.95 },
  transition: { type: 'spring', duration: 0.3 }
};

type PostImageBorderRadius = Record<number, string[]>;

const postImageBorderRadius: Readonly<PostImageBorderRadius> = {
  1: ['rounded-2xl'],
  2: ['rounded-tl-2xl rounded-bl-2xl', 'rounded-tr-2xl rounded-br-2xl'],
  3: ['rounded-tl-2xl rounded-bl-2xl', 'rounded-tr-2xl', 'rounded-br-2xl'],
  4: ['rounded-tl-2xl', 'rounded-tr-2xl', 'rounded-bl-2xl', 'rounded-br-2xl']
};

export function ImagePreview({
  tweet,
  viewTweet,
  previewCount,
  imagesPreview,
  removeImage
}: ImagePreviewProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { open, openModal, closeModal } = useModal();

  useEffect(() => {
    const imageData = imagesPreview[selectedIndex];
    setSelectedImage(imageData);
  }, [selectedIndex, imagesPreview]);

  const handleVideoStop = (): void => {
    if (videoRef.current) videoRef.current.pause();
  };

  const handleSelectedImage = (index: number, isVideo?: boolean) => () => {
    if (isVideo) handleVideoStop();
    setSelectedIndex(index);
    openModal();
  };

  const handleNextIndex = (type: 'prev' | 'next') => () => {
    const nextIndex =
      type === 'prev'
        ? selectedIndex === 0
          ? previewCount - 1
          : selectedIndex - 1
        : selectedIndex === previewCount - 1
        ? 0
        : selectedIndex + 1;
    setSelectedIndex(nextIndex);
  };

  const isTweet = tweet ?? viewTweet;

  return (
    <div
      className={cn(
        'grid grid-cols-2 grid-rows-2 rounded-2xl overflow-hidden',
        isTweet ? 'mt-2 gap-0.5' : 'mt-2 gap-1',
        viewTweet ? 'h-auto max-h-[500px] w-full' : 'max-h-[250px] sm:max-h-[300px] w-full'
      )}
    >
      <Modal
        modalClassName={cn('flex justify-center w-full items-center relative', isTweet && 'h-full')}
        open={open}
        closeModal={closeModal}
        closePanelOnClick
      >
        <ImageModal
          tweet={isTweet}
          imageData={selectedImage as ImageData}
          previewCount={previewCount}
          selectedIndex={selectedIndex}
          handleNextIndex={handleNextIndex}
        />
      </Modal>

      <AnimatePresence mode="popLayout">
        {imagesPreview.map(({ id, src, alt, type }, index) => {
          const isVideo = type?.includes('video');

          return (
            <motion.button
              type="button"
              className={cn(
                'accent-tab group relative transition-all duration-300 ease-in-out overflow-hidden',
                isTweet ? postImageBorderRadius[previewCount][index] : 'rounded-2xl',
                {
                  'col-span-2 row-span-2': previewCount === 1,
                  'row-span-2': previewCount === 2 || (index === 0 && previewCount === 3)
                }
              )}
              {...variants}
              onClick={preventBubbling(handleSelectedImage(index, isVideo))}
              layout={!isTweet}
              key={id}
            >
              {isVideo ? (
                <video
                  ref={videoRef}
                  className={cn(
                    `relative h-auto w-full max-h-[500px] object-cover cursor-pointer transition hover:brightness-75`,
                    isTweet ? postImageBorderRadius[previewCount][index] : 'rounded-2xl'
                  )}
                  src={src}
                  controls
                  muted
                />
              ) : (
                <NextImage
                  className="relative w-full h-auto max-h-[500px] object-cover cursor-pointer transition hover:brightness-75"
                  imgClassName={cn(isTweet ? postImageBorderRadius[previewCount][index] : 'rounded-2xl')}
                  previewCount={previewCount}
                  layout="responsive"
                  src={src}
                  alt={alt}
                  useSkeleton={isTweet}
                  width={500} // ✅ Required for Next.js responsive images
                  height={500} // ✅ Required for Next.js responsive images
                />
              )}

              {removeImage && (
                <Button
                  className="group absolute top-1 left-1 bg-light-primary/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                  onClick={preventBubbling(removeImage(id))}
                >
                  <HeroIcon className="h-5 w-5 text-white" iconName="XMarkIcon" />
                  <ToolTip className="translate-y-2" tip="Remove" />
                </Button>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
