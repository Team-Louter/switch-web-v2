import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`

export const Content = styled.section`
  width: 100%;

  > p { margin: 0; padding: 3px 0; }
  > h1, > h2, > h3, > h4, > h5, > h6 {
    margin: 0;
    padding: 12px 0 3px;
    white-space: pre-wrap;
  }
`

export const Figure = styled.figure`
  margin: 0;
  padding: 3px 0;

  img { display: block; }
  figcaption { margin-top: 8px; white-space: pre-wrap; }
`

export const VideoEmbed = styled.div`
  position: relative;
  width: min(100%, 720px);
  aspect-ratio: 16 / 9;
  margin: 8px 0;
  overflow: hidden;
  border-radius: 8px;
  background: #0e0d0c;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`

export const LoadingSkeleton = styled.div`
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 3px 0;
`

export const SkeletonLine = styled.span<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f3f2f1 25%, #e8e7e3 50%, #f3f2f1 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
