import { useEffect, useRef, useState } from 'react';
import { PiCaretDown, PiPencilSimpleLineBold } from 'react-icons/pi';

import { POST_CATEGORY_OPTIONS, type PostCategory } from '@/entities/community';

import { preloadCommunityWritePage } from '../loadCommunityWritePage';
import {
  CategoryTab,
  CategoryTabs,
  MobileCategoryButton,
  MobileCategoryButtonLabel,
  MobileCategoryMenu,
  MobileCategoryOption,
  MobileCategoryPanel,
  WriteButton,
} from './CommunityListHeader.style';
import { Header, TabActionRow } from './CommunityList.style';

interface CategoryTabItem {
  value: PostCategory | null;
  label: string;
}

const CATEGORY_TABS: readonly CategoryTabItem[] = [
  { value: null, label: '전체글' },
  ...POST_CATEGORY_OPTIONS,
];

interface CommunityListHeaderProps {
  selectedCategory: PostCategory | null;
  actions?: {
    onCategorySelect: (category: PostCategory | null) => void;
    onWritePost: () => void;
  };
}

export function CommunityListHeader({
  selectedCategory,
  actions,
}: CommunityListHeaderProps) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuButtonRef = useRef<HTMLButtonElement>(null);

  const selectedCategoryLabel =
    CATEGORY_TABS.find((category) => category.value === selectedCategory)
      ?.label ?? CATEGORY_TABS[0].label;

  const handleCategorySelect = (category: PostCategory | null) => {
    actions?.onCategorySelect(category);
    setIsCategoryMenuOpen(false);
  };

  const handleMobileCategorySelect = (category: PostCategory | null) => {
    handleCategorySelect(category);
    categoryMenuButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!isCategoryMenuOpen) {
      return;
    }

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !categoryMenuRef.current?.contains(target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryMenuOpen]);

  return (
    <Header inert={!actions}>
      <TabActionRow>
        <CategoryTabs role="tablist" aria-label="게시글 카테고리">
          {CATEGORY_TABS.map((category) => (
            <CategoryTab
              key={category.label}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category.value}
              $active={selectedCategory === category.value}
              onClick={() => handleCategorySelect(category.value)}
            >
              {category.label}
            </CategoryTab>
          ))}
        </CategoryTabs>
        <MobileCategoryMenu ref={categoryMenuRef}>
          <MobileCategoryButton
            ref={categoryMenuButtonRef}
            type="button"
            aria-controls="community-category-menu"
            aria-expanded={isCategoryMenuOpen}
            aria-haspopup="menu"
            onClick={() =>
              setIsCategoryMenuOpen((isOpen) => !isOpen)
            }
          >
            <MobileCategoryButtonLabel>
              <span>{selectedCategoryLabel}</span>
              <PiCaretDown size={18} aria-hidden="true" />
            </MobileCategoryButtonLabel>
          </MobileCategoryButton>
          <MobileCategoryPanel
            id="community-category-menu"
            aria-hidden={!isCategoryMenuOpen}
            role="menu"
            $open={isCategoryMenuOpen}
          >
            {CATEGORY_TABS.map((category) => (
              <MobileCategoryOption
                key={category.label}
                type="button"
                role="menuitemradio"
                aria-checked={selectedCategory === category.value}
                $active={selectedCategory === category.value}
                onClick={() => handleMobileCategorySelect(category.value)}
              >
                {category.label}
              </MobileCategoryOption>
            ))}
          </MobileCategoryPanel>
        </MobileCategoryMenu>
        <WriteButton
          size="sm"
          onClick={actions?.onWritePost}
          onPointerEnter={actions && preloadCommunityWritePage}
          onFocus={actions && preloadCommunityWritePage}
        >
          <PiPencilSimpleLineBold size={16} aria-hidden="true" />
          글쓰기
        </WriteButton>
      </TabActionRow>
    </Header>
  );
}
