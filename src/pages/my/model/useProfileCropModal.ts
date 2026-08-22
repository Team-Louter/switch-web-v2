import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, PointerEvent } from 'react'

const CROP_AREA_SIZE = 640
const OUTPUT_IMAGE_SIZE = 338
const PROFILE_IMAGE_MIME_TYPE = 'image/jpeg'

type UseProfileCropModalParams = {
  initialState: ProfileCropState
  onComplete: (
    croppedImageSrc: string,
    nextCropState: ProfileCropState,
  ) => void
}

export type ProfileCropPosition = {
  x: number
  y: number
}

export type ProfileCropState = {
  position: ProfileCropPosition
  zoomValue: number
}

type ImageSize = {
  width: number
  height: number
}

type ImageFrame = ImageSize & {
  left: number
  top: number
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}

const getZoomScale = (zoomValue: number) => 1 + zoomValue / 100

const getBaseImageSize = (imageSize: ImageSize, cropAreaSize: ImageSize) => {
  const imageRatio = imageSize.width / imageSize.height
  const cropAreaRatio = cropAreaSize.width / cropAreaSize.height

  if (imageRatio >= cropAreaRatio) {
    return {
      width: cropAreaSize.height * imageRatio,
      height: cropAreaSize.height,
    }
  }

  return {
    width: cropAreaSize.width,
    height: cropAreaSize.width / imageRatio,
  }
}

const getDisplayedImageSize = (
  imageSize: ImageSize,
  cropAreaSize: ImageSize,
  zoomScale: number,
) => {
  const baseImageSize = getBaseImageSize(imageSize, cropAreaSize)

  return {
    width: baseImageSize.width * zoomScale,
    height: baseImageSize.height * zoomScale,
  }
}

const getBoundedImagePosition = (
  nextPosition: ProfileCropPosition,
  displayedImageSize: ImageSize,
  cropAreaSize: ImageSize,
) => {
  const maxX = Math.max((displayedImageSize.width - cropAreaSize.width) / 2, 0)
  const maxY = Math.max(
    (displayedImageSize.height - cropAreaSize.height) / 2,
    0,
  )

  return {
    x: Math.min(Math.max(nextPosition.x, -maxX), maxX),
    y: Math.min(Math.max(nextPosition.y, -maxY), maxY),
  }
}

export function useProfileCropModal({
  initialState,
  onComplete,
}: UseProfileCropModalParams) {
  const cropAreaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const [imagePosition, setImagePosition] =
    useState<ProfileCropPosition>(initialState.position)
  const [imageSize, setImageSize] = useState<ImageSize>({
    width: 1,
    height: 1,
  })
  const [cropAreaSize, setCropAreaSize] = useState<ImageSize>({
    width: CROP_AREA_SIZE,
    height: CROP_AREA_SIZE,
  })
  const [zoomValue, setZoomValue] = useState(initialState.zoomValue)
  const zoomScale = getZoomScale(zoomValue)
  const displayedImageSize = useMemo(
    () => getDisplayedImageSize(imageSize, cropAreaSize, zoomScale),
    [cropAreaSize, imageSize, zoomScale],
  )
  const boundedImagePosition = useMemo(
    () =>
      getBoundedImagePosition(imagePosition, displayedImageSize, cropAreaSize),
    [cropAreaSize, displayedImageSize, imagePosition],
  )
  const imageFrame: ImageFrame = useMemo(
    () => ({
      left:
        (cropAreaSize.width - displayedImageSize.width) / 2 +
        boundedImagePosition.x,
      top:
        (cropAreaSize.height - displayedImageSize.height) / 2 +
        boundedImagePosition.y,
      width: displayedImageSize.width,
      height: displayedImageSize.height,
    }),
    [boundedImagePosition, cropAreaSize, displayedImageSize],
  )

  useEffect(() => {
    const cropArea = cropAreaRef.current

    if (!cropArea) {
      return
    }

    const updateCropAreaSize = () => {
      setCropAreaSize({
        width: cropArea.clientWidth,
        height: cropArea.clientHeight,
      })
    }

    updateCropAreaSize()

    const resizeObserver = new ResizeObserver(updateCropAreaSize)
    resizeObserver.observe(cropArea)

    return () => resizeObserver.disconnect()
  }, [])

  const getBoundedPosition = (
    nextPosition: ProfileCropPosition,
    nextDisplayedImageSize = displayedImageSize,
  ) =>
    getBoundedImagePosition(nextPosition, nextDisplayedImageSize, cropAreaSize)

  const handleImageLoad = () => {
    const image = imageRef.current

    if (!image) {
      return
    }

    const nextImageSize = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
    const nextDisplayedImageSize = getDisplayedImageSize(
      nextImageSize,
      cropAreaSize,
      zoomScale,
    )

    setImageSize(nextImageSize)
    setImagePosition((prevPosition) =>
      getBoundedPosition(prevPosition, nextDisplayedImageSize),
    )
  }

  const handleImagePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: boundedImagePosition.x,
      originY: boundedImagePosition.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleImagePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    setImagePosition(
      getBoundedPosition({
        x: dragState.originX + event.clientX - dragState.startX,
        y: dragState.originY + event.clientY - dragState.startY,
      }),
    )
  }

  const handleImagePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }

  const handleZoomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextZoomValue = Number(event.target.value)
    const nextZoomScale = getZoomScale(nextZoomValue)
    const zoomRatio = nextZoomScale / zoomScale
    const nextDisplayedImageSize = getDisplayedImageSize(
      imageSize,
      cropAreaSize,
      nextZoomScale,
    )

    setZoomValue(nextZoomValue)
    setImagePosition(
      getBoundedPosition(
        {
          x: boundedImagePosition.x * zoomRatio,
          y: boundedImagePosition.y * zoomRatio,
        },
        nextDisplayedImageSize,
      ),
    )
  }

  const handleComplete = () => {
    const cropArea = cropAreaRef.current
    const image = imageRef.current

    if (!cropArea || !image) {
      return
    }

    const cropAreaRect = cropArea.getBoundingClientRect()
    const imageRect = image.getBoundingClientRect()
    const sourceScaleX = image.naturalWidth / imageRect.width
    const sourceScaleY = image.naturalHeight / imageRect.height
    const sourceX = (cropAreaRect.left - imageRect.left) * sourceScaleX
    const sourceY = (cropAreaRect.top - imageRect.top) * sourceScaleY
    const sourceWidth = cropAreaRect.width * sourceScaleX
    const sourceHeight = cropAreaRect.height * sourceScaleY
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    canvas.width = OUTPUT_IMAGE_SIZE
    canvas.height = OUTPUT_IMAGE_SIZE
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      OUTPUT_IMAGE_SIZE,
      OUTPUT_IMAGE_SIZE,
    )
    onComplete(canvas.toDataURL(PROFILE_IMAGE_MIME_TYPE), {
      position: boundedImagePosition,
      zoomValue,
    })
  }

  return {
    cropAreaRef,
    handleComplete,
    handleImageLoad,
    handleImagePointerDown,
    handleImagePointerMove,
    handleImagePointerUp,
    handleZoomChange,
    imageFrame,
    imageRef,
    zoomValue,
  }
}
