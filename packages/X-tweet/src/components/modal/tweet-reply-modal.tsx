import { Input } from '@components/input/input';
import { Tweet as TweetComponent } from '@components/tweet/tweet'; // ✅ updated import
import type { TweetProps } from '@components/tweet/tweet';

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function TweetReplyModal({
  tweet,
  closeModal,
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{ id: tweet.id, username: tweet.user.username }}
      closeModal={closeModal}
    >
      <TweetComponent modal parentTweet {...tweet} /> {/* ✅ updated usage */}
    </Input>
  );
}
