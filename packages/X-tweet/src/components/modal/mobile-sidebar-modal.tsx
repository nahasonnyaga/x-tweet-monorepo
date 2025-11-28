"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@lib/context/auth-context";
import { useModal } from "@lib/hooks/useModal";
import { Button } from "@components/ui/button";
import { UserAvatar } from "@components/user/user-avatar";
import { NextImage } from "@components/ui/next-image";
import { UserName } from "@components/user/user-name";
import { UserUsername } from "@components/user/user-username";
import { MainHeader } from "@components/home/main-header";
import { MobileSidebarLink } from "@components/sidebar/mobile-sidebar-link";
import { HeroIcon } from "@components/ui/hero-icon";
import { Modal } from "./modal";
import { ActionModal } from "./action-modal";
import { DisplayModal } from "./display-modal";
import type { NavLink } from "@components/sidebar/sidebar";
import type { User } from "@lib/types/user";

export type MobileNavLink = Omit<NavLink, "canBeHidden">;

const topNavLinks: Readonly<MobileNavLink[]> = [
  { href: "/trends", linkName: "Topics", iconName: "ChatBubbleBottomCenterTextIcon" },
  { href: "/bookmarks", linkName: "Bookmarks", iconName: "BookmarkIcon" },
  { href: "/lists", linkName: "Lists", iconName: "Bars3BottomLeftIcon", disabled: true },
  { href: "/people", linkName: "Twitter Circle", iconName: "UserGroupIcon" },
];

const bottomNavLinks: Readonly<MobileNavLink[]> = [
  { href: "/settings", linkName: "Settings and privacy", iconName: "Cog8ToothIcon", disabled: true },
  { href: "/help-center", linkName: "Help center", iconName: "QuestionMarkCircleIcon", disabled: true },
];

type Stats = [string, string, number];

type MobileSidebarModalProps = Pick<
  User,
  "name" | "username" | "verified" | "photoURL" | "following" | "followers" | "coverPhotoURL"
> & { closeModal: () => void };

export function MobileSidebarModal({
  name,
  username,
  verified,
  photoURL,
  following,
  followers,
  coverPhotoURL,
  closeModal,
}: MobileSidebarModalProps): JSX.Element {
  const router = useRouter();
  const { signOut } = useAuth();
  const { open: displayOpen, openModal: displayOpenModal, closeModal: displayCloseModal } = useModal();
  const { open: logOutOpen, openModal: logOutOpenModal, closeModal: logOutCloseModal } = useModal();

  const allStats: Readonly<Stats[]> = [
    ["following", "Following", following.length],
    ["followers", "Followers", followers.length],
  ];

  const userLink = `/user/${username}`;
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtags] = useState([
    "#React",
    "#NextJS",
    "#TailwindCSS",
    "#OpenAI",
    "#Firebase",
    "#WebDev",
    "#UIUX",
  ]);

  const filteredHashtags = hashtags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      closeModal();
    }
  };

  return (
    <>
      {/* Display Modal */}
      <Modal
        className="items-center justify-center xs:flex"
        modalClassName="max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation"
        open={displayOpen}
        closeModal={displayCloseModal}
      >
        <DisplayModal closeModal={displayCloseModal} />
      </Modal>

      {/* Log Out Modal */}
      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={logOutOpen}
        closeModal={logOutCloseModal}
      >
        <ActionModal
          useIcon
          focusOnMainBtn
          title="Log out of X?"
          description="You can always log back in at any time. If you just want to switch accounts, you can do that by adding another account."
          mainBtnLabel="Log out"
          action={signOut}
          closeModal={logOutCloseModal}
        />
      </Modal>

      {/* Header */}
      <MainHeader
        useActionButton
        className="flex flex-row-reverse items-center justify-between"
        iconName="XMarkIcon"
        title="Account info"
        tip="Close"
        action={closeModal}
      />

      {/* Profile + Stats */}
      <section className="mt-0.5 flex flex-col gap-2 px-4">
        <Link href={userLink} className="relative h-20 rounded-md cursor-pointer block">
          {coverPhotoURL ? (
            <NextImage
              useSkeleton
              imgClassName="rounded-md"
              src={coverPhotoURL}
              alt={name}
              layout="fill"
            />
          ) : (
            <div className="h-full rounded-md bg-light-line-reply dark:bg-dark-line-reply" />
          )}
        </Link>

        <div className="mb-8 ml-2 -mt-4">
          <UserAvatar
            className="absolute -translate-y-1/2 bg-main-background p-1 hover:brightness-100 [&>figure>span]:[transition:200ms] [&:hover>figure>span]:brightness-75"
            username={username}
            src={photoURL}
            alt={name}
            size={60}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-main-sidebar-background p-4">
          <div className="flex flex-col">
            <UserName name={name} username={username} verified={verified} className="-mb-1" />
            <UserUsername username={username} />
          </div>

          <div className="text-secondary flex gap-4">
            {allStats.map(([id, label, stat]) => (
              <Link href={`${userLink}/${id}`} key={id} className="hover-animation">
                <div className="flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-light-primary focus-visible:border-b-light-primary dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary">
                  <p className="font-bold">{stat}</p>
                  <p className="text-light-secondary dark:text-dark-secondary">{label}</p>
                </div>
              </Link>
            ))}
          </div>

          <i className="h-0.5 bg-light-line-reply dark:bg-dark-line-reply" />

          {/* Navigation Links */}
          <nav className="flex flex-col">
            <MobileSidebarLink href={`/user/${username}`} iconName="UserIcon" linkName="Profile" />
            {topNavLinks.map((link) => (
              <MobileSidebarLink {...link} key={link.href} />
            ))}
          </nav>

          <i className="h-0.5 bg-light-line-reply dark:bg-dark-line-reply" />

          {/* Bottom Menu & Search */}
          <div className="flex gap-2 overflow-x-auto p-2">
            {bottomNavLinks.map((link) => (
              <MobileSidebarLink bottom {...link} key={link.href} />
            ))}

            <form
              onSubmit={handleSearch}
              className="flex items-center bg-light-line-reply dark:bg-dark-line-reply rounded-full px-3 py-1 flex-shrink-0 w-48"
            >
              <input
                type="text"
                placeholder="Search hashtags or users..."
                className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <HeroIcon
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                  iconName="MagnifyingGlassIcon"
                />
              </button>
            </form>

            <Button
              className="accent-tab accent-bg-tab flex items-center gap-2 rounded-md p-1.5 font-bold transition hover:bg-light-primary/10 focus-visible:ring-2 dark:hover:bg-dark-primary/10 flex-shrink-0"
              onClick={displayOpenModal}
            >
              <HeroIcon className="h-5 w-5" iconName="PaintBrushIcon" />
              Display
            </Button>

            <Button
              className="accent-tab accent-bg-tab flex items-center gap-2 rounded-md p-1.5 font-bold transition hover:bg-light-primary/10 focus-visible:ring-2 dark:hover:bg-dark-primary/10 flex-shrink-0"
              onClick={logOutOpenModal}
            >
              <HeroIcon className="h-5 w-5" iconName="ArrowRightOnRectangleIcon" />
              Log out
            </Button>
          </div>

          {/* Hashtag Section */}
          <div className="mt-4 rounded-xl bg-main-background p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <HeroIcon
                className="h-5 w-5 text-light-secondary dark:text-dark-secondary"
                iconName="HashtagIcon"
              />
              <p className="font-semibold text-light-primary dark:text-dark-primary">
                Trending Hashtags
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredHashtags.length > 0 ? (
                filteredHashtags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/trends/${tag.replace("#", "")}`}
                    className="text-sm text-light-primary dark:text-dark-primary bg-light-line-reply dark:bg-dark-line-reply rounded-full px-3 py-1 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  No hashtags found
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
