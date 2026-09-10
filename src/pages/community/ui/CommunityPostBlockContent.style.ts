import styled from 'styled-components'

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
