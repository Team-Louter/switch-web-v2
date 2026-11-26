import { Fragment } from 'react';

import { findCommentLinks } from '../model/commentLinks';
import { extractCommunityKlipyGifLinks } from '../model/klipyGifLink';
import * as S from './CommunityCommentBranch.style';
import { CommunityKlipyGifPreview } from './CommunityKlipyGifPreview';
import { CommunityLinkPreview, CommunityLinkSource } from './CommunityLinkPreview';

interface CommunityCommentBodyProps {
  content: string;
  isDeleted: boolean;
  replyToUserName?: string;
}

export function CommunityCommentBody({
  content,
  isDeleted,
  replyToUserName,
}: CommunityCommentBodyProps) {
  const { text, klipyGifLinks } = isDeleted
    ? { text: content, klipyGifLinks: [] }
    : extractCommunityKlipyGifLinks(content);
  const links = isDeleted ? [] : findCommentLinks(text);
  const previewUrls = new Set(links.map(({ href }) => href));

  return (
    <>
      {(text || replyToUserName) && (
        <S.CommentText $isDeleted={isDeleted}>
          {replyToUserName && <S.CommentMention>@{replyToUserName}</S.CommentMention>}
          {links.map(({ href, start, end }, index) => (
            <Fragment key={start}>
              {text.slice(links[index - 1]?.end ?? 0, start)}
              <CommunityLinkSource href={href}>{text.slice(start, end)}</CommunityLinkSource>
            </Fragment>
          ))}
          {text.slice(links.at(-1)?.end ?? 0)}
        </S.CommentText>
      )}
      {[...previewUrls].map((href) => <CommunityLinkPreview key={href} href={href} />)}
      {klipyGifLinks.map((gifLink, index) => (
        <CommunityKlipyGifPreview
          key={`${gifLink.slug}-${index}`}
          href={gifLink.href}
          slug={gifLink.slug}
        />
      ))}
    </>
  );
}
