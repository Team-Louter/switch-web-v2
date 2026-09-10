import { useEffect, useRef, useState } from 'react';

import * as S from './CommunityDetailPage.style';

type NumberChangeDirection = 'increase' | 'decrease';

interface NumberTransition {
  current: number;
  direction: NumberChangeDirection;
  previous: number;
  key: number;
  shouldSpinAll: boolean;
}

interface CommunityRollingNumberProps {
  value: number;
}

interface NumberCharacter {
  current: string;
  previous: string;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function getNumberCharacters(
  previousValue: string,
  currentValue: string,
): NumberCharacter[] {
  const characterCount = Math.max(previousValue.length, currentValue.length);

  return Array.from({ length: characterCount }, (_, index) => {
    const previousIndex = previousValue.length - characterCount + index;
    const currentIndex = currentValue.length - characterCount + index;

    return {
      previous: previousValue[previousIndex] ?? '',
      current: currentValue[currentIndex] ?? '',
    };
  });
}

function isNumberCharacter(value: string) {
  return /^[0-9]$/.test(value);
}

function getIncreasingValues(
  from: number,
  to: number,
  minimumFullRotations: number,
) {
  const values = [from];
  const distance = (to - from + 10) % 10;
  const totalSteps = distance + minimumFullRotations * 10;

  for (let step = 1; step <= totalSteps; step += 1) {
    values.push((from + step) % 10);
  }

  return values.map(String);
}

function getRollingValues(
  previous: string,
  current: string,
  direction: NumberChangeDirection,
  shouldSpin: boolean,
) {
  if (!isNumberCharacter(previous) || !isNumberCharacter(current)) {
    return [current];
  }

  const previousNumber = Number(previous);
  const currentNumber = Number(current);
  const minimumFullRotations = shouldSpin ? 1 : 0;

  return direction === 'increase'
    ? getIncreasingValues(previousNumber, currentNumber, minimumFullRotations)
    : getIncreasingValues(currentNumber, previousNumber, minimumFullRotations);
}

export function CommunityRollingNumber({ value }: CommunityRollingNumberProps) {
  const previousValueRef = useRef(value);
  const [transition, setTransition] = useState<NumberTransition>({
    current: value,
    direction: 'increase',
    previous: value,
    key: 0,
    shouldSpinAll: false,
  });

  useEffect(() => {
    const previousValue = previousValueRef.current;

    if (previousValue === value) {
      return;
    }

    previousValueRef.current = value;
    setTransition({
      current: value,
      direction: value > previousValue ? 'increase' : 'decrease',
      previous: previousValue,
      key: Date.now(),
      shouldSpinAll: true,
    });
  }, [value]);

  const previousCharacters = formatNumber(transition.previous);
  const currentCharacters = formatNumber(transition.current);
  const characters = getNumberCharacters(previousCharacters, currentCharacters);

  return (
    <S.RollingNumber
      role="status"
      aria-label={formatNumber(value)}
      aria-live="polite"
    >
      {characters.map((character, index) => {
        const previousDigit = isNumberCharacter(character.previous)
          ? character.previous
          : '0';
        const shouldAnimate =
          isNumberCharacter(character.current) &&
          (transition.shouldSpinAll ||
            character.previous !== character.current);
        const values = getRollingValues(
          previousDigit,
          character.current,
          transition.direction,
          transition.shouldSpinAll,
        );
        const animationDelayMs = (characters.length - index - 1) * 90;

        return (
          <S.RollingNumberCharacter
            key={`${transition.key}-${index}-${character.current}`}
            $isAnimated={shouldAnimate}
            aria-hidden="true"
          >
            {shouldAnimate ? (
              <S.RollingNumberTrack
                $animationDelayMs={animationDelayMs}
                $direction={transition.direction}
                $stepCount={values.length}
              >
                {values.map((rollingValue, rollingIndex) => (
                  <S.RollingNumberValue
                    key={`${transition.key}-${index}-${rollingIndex}`}
                  >
                    {rollingValue}
                  </S.RollingNumberValue>
                ))}
              </S.RollingNumberTrack>
            ) : (
              character.current
            )}
          </S.RollingNumberCharacter>
        );
      })}
    </S.RollingNumber>
  );
}
