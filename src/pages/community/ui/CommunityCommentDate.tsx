import { useCallback, useSyncExternalStore } from 'react';

import { formatCommunityDate, formatCommunityRelativeDate } from '@/entities/community';

import * as S from './CommunityCommentBranch.style';

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface DateSubscription {
  timestamp: number;
  nextUpdate: number;
  notify: () => void;
}

const subscriptions = new Set<DateSubscription>();
let timer: number | undefined;
let scheduledAt = Infinity;

function nextUpdateAt(timestamp: number, now: number) {
  const age = Math.max(0, now - timestamp);
  const unit = age < MINUTE ? SECOND : age < HOUR ? MINUTE : age < DAY ? HOUR : DAY;
  // 일 이상 된 표시(주·개월·년 포함)는 작성 시각 기준으로 하루 경계에서만 바뀔 수 있습니다.
  return timestamp + (Math.floor(age / unit) + 1) * unit;
}

function scheduleUpdate(nextUpdate: number) {
  if (nextUpdate >= scheduledAt) return;
  window.clearTimeout(timer);
  scheduledAt = nextUpdate;
  // 미래 작성 시각도 브라우저 타이머의 최대 지연 범위 안에서 다시 확인합니다.
  timer = window.setTimeout(updateDates, Math.min(DAY, nextUpdate - Date.now()));
}

function updateDates() {
  scheduledAt = Infinity;
  const now = Date.now();
  let earliest = Infinity;
  for (const subscription of subscriptions) {
    if (subscription.nextUpdate <= now) {
      subscription.nextUpdate = nextUpdateAt(subscription.timestamp, now);
      subscription.notify();
    }
    earliest = Math.min(earliest, subscription.nextUpdate);
  }
  scheduleUpdate(earliest);
}

function subscribeDate(createdAt: string, notify: () => void) {
  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) return () => {};
  const subscription = { timestamp, nextUpdate: nextUpdateAt(timestamp, Date.now()), notify };
  subscriptions.add(subscription);
  scheduleUpdate(subscription.nextUpdate);
  return () => {
    subscriptions.delete(subscription);
    if (subscriptions.size === 0) {
      window.clearTimeout(timer);
      scheduledAt = Infinity;
    }
  };
}

interface CommunityCommentDateProps {
  createdAt: string;
}

export function CommunityCommentDate({ createdAt }: CommunityCommentDateProps) {
  const subscribe = useCallback((notify: () => void) => subscribeDate(createdAt, notify), [createdAt]);
  const label = useSyncExternalStore(subscribe, () => formatCommunityRelativeDate(createdAt));
  return (
    <S.CommentDate dateTime={createdAt} title={formatCommunityDate(createdAt)}>
      {label}
    </S.CommentDate>
  );
}
