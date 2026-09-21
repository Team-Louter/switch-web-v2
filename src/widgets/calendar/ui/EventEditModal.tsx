import { useState } from "react";
import * as S from "./EventEditModal.style.ts";
import type { Member } from "@/shared/types/member";
import { getInitialStartDate, getInitialEndDate } from "../lib/calendarDates";
import { DateInputField } from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "../lib/calendarEvents";
import { MemberDropdown } from "./MemberDropdown";
import type { EventInput } from "@fullcalendar/core";
import { useEventEditor } from "../model/useEventEditor";
import * as paletteToken from '@/shared/styles/values/token';

export interface EventEditModalProps {
    selectedDate?: Date | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEndDate?: Date | null;
    modalMode: string;
    event: EventInput | null;
    setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
}

export function EventEditModal({ selectedDate, selectedEndDate, setIsModalOpen, modalMode, event, setEvents }: EventEditModalProps) {
    const [title, setTitle] = useState<string>(event?.title || '');
    const [content, setContent] = useState<string>(event?.extendedProps?.description || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.assignees?.map((a: { userId: number }) => a.userId) || []
    );
    const [startDate, setStartDate] = useState<string>(getInitialStartDate(event, selectedDate ?? null));
    const [endDate, setEndDate] = useState<string>(getInitialEndDate(event, selectedDate ?? null, selectedEndDate ?? null));
    const [selectedColor, setSelectedColor] = useState<string>(event?.color?.toUpperCase() || calendarHighlight[2]);
    const [allMembers, setAllMembers] = useState<Member[]>([]);

    const { handleSubmit, handleDelete, isSubmitting, isDeleting, error } = useEventEditor({
        modalMode, event, title, content, startDate, endDate,
        selectedColor, selectedMemberIds, allMembers, setEvents, setIsModalOpen,
    });

    const isActionPending = isSubmitting || isDeleting;

    const dateError =
    startDate && endDate && new Date(endDate) < new Date(startDate)
        ? '종료 날짜는 시작 날짜보다 빠를 수 없습니다'
        : '';

    const isFormValid =
        title.trim() !== '' &&
        selectedMemberIds.length > 0 &&
        startDate !== '' &&
        endDate !== '' &&
        dateError === '' &&
        content.trim() !== '';

    return (
        <S.Background>
            <S.Container role="dialog" aria-modal="true" aria-label={`동아리 일정 ${modalMode}하기`}>
                <S.ModalTitle>동아리 일정 {modalMode}하기</S.ModalTitle>

                <TextInputField
                    label="제목"
                    value={title}
                    onChange={setTitle}
                    placeholder="제목을 입력하세요."
                    showLetterCount={50}
                />

                <S.ForRow>
                    <S.Name>담당자 선택</S.Name>
                    <S.ForColumn>
                        <MemberDropdown
                            selectedMemberIds={selectedMemberIds}
                            onSelectChange={setSelectedMemberIds}
                            onMembersLoad={setAllMembers}
                        />
                    </S.ForColumn>
                </S.ForRow>

                <DateInputField
                    label="시작 날짜"
                    value={startDate}
                    onChange={setStartDate}
                />

                <DateInputField
                    label="종료 날짜"
                    value={endDate}
                    onChange={setEndDate}
                    error={dateError}
                />

                <S.ForRow>
                    <S.Name style={{paddingTop: 0}}>색상</S.Name>
                    <S.ColorContainer>
                        {calendarHighlight.map(color => (
                            <S.Color
                                key={color}
                                style={{
                                    backgroundColor: color === 'GOLD'
                                        ? paletteToken.colors.primary.primary50
                                        : color,
                                    border: selectedColor === color ? '1px solid #333' : 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </S.ColorContainer>
                </S.ForRow>

                <TextAreaField
                    label="내용"
                    value={content}
                    onChange={setContent}
                    placeholder="내용을 입력하세요."
                    showLetterCount={250}
                />

                {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}
                <S.Buttons>
                    {modalMode === '편집' && event && (
                        <S.DeleteButton
                            onClick={() => handleDelete(event.scheduleId)}
                            disabled={isActionPending}
                            style={{ opacity: isDeleting ? 0.6 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
                        >
                            {isDeleting ? '삭제 중...' : '삭제'}
                        </S.DeleteButton>
                    )}
                    <S.CancelButton
                        onClick={() => setIsModalOpen(false)}
                        disabled={isActionPending}
                        style={{ opacity: isActionPending ? 0.6 : 1, cursor: isActionPending ? 'not-allowed' : 'pointer' }}
                    >
                        취소
                    </S.CancelButton>
                    <S.ConfirmButton
                        $isValid={isFormValid && !isActionPending}
                        disabled={!isFormValid || isActionPending}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? '저장 중...' : '저장'}
                    </S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}
