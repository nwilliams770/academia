"use strict";
// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of
// the foreground and background are aligned.
function composite(bgImg, fgImg, fgOpac, fgPos) {
    // Determine if the foreground even covers the background. If not, we can skip the blending process.
    const intersectionBounds = calculateIntersectionBounds({ width: bgImg.width, height: bgImg.height }, { width: fgImg.width, height: fgImg.height }, fgPos);
    if (intersectionBounds === null) {
        return;
    }
    const { startX, startY, endX, endY } = intersectionBounds;
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const bgIndex = coordinateToIndex({ x, y }, { width: bgImg.width, height: bgImg.height });
            const fgCoord = bgToFgCoordinates({ x, y }, fgPos);
            const fgIndex = coordinateToIndex(fgCoord, { width: fgImg.width, height: fgImg.height });
            const bgPixel = [
                bgImg.data[bgIndex],
                bgImg.data[bgIndex + 1],
                bgImg.data[bgIndex + 2],
                bgImg.data[bgIndex + 3]
            ];
            const fgPixel = [
                fgImg.data[fgIndex],
                fgImg.data[fgIndex + 1],
                fgImg.data[fgIndex + 2],
                fgImg.data[fgIndex + 3]
            ];
            const blendedPixel = alphaComposite(bgPixel, fgPixel, fgOpac);
            bgImg.data[bgIndex] = blendedPixel[0];
            bgImg.data[bgIndex + 1] = blendedPixel[1];
            bgImg.data[bgIndex + 2] = blendedPixel[2];
            bgImg.data[bgIndex + 3] = blendedPixel[3];
        }
    }
}
function alphaComposite(bgPixel, fgPixel, fgOpac) {
    // Normalize alpha values to [0, 1] range
    const fgPixelAlphaNormalized = fgPixel[3] / 255;
    const bgPixelAlphaNormalized = bgPixel[3] / 255;
    // Calculate effective foreground alpha considering the opacity set in the slider
    const effectiveFgAlpha = fgPixelAlphaNormalized * fgOpac;
    // Calculate output alpha
    const outAlpha = effectiveFgAlpha + bgPixelAlphaNormalized * (1 - effectiveFgAlpha);
    // Calculate output color channels
    const outColor = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        outColor[i] = Math.round((fgPixel[i] * effectiveFgAlpha + bgPixel[i] * bgPixelAlphaNormalized * (1 - effectiveFgAlpha)) / (outAlpha || 1));
    }
    return [outColor[0], outColor[1], outColor[2], Math.round(outAlpha * 255)];
}
// coordinateToIndex converts a 2D coordinate to a 1D index in the ImageData.data array.
// The ImageData.data array is a 1D array of RGBA values, so each pixel takes up 4 indices in the array.
function coordinateToIndex(position, dimensions) {
    const { x, y } = position;
    if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) {
        throw new Error("Position is out of bounds");
    }
    return (y * dimensions.width + x) * 4;
}
function calculateIntersectionBounds(bgDimensions, fgDimensions, fgOffset) {
    const startX = Math.max(0, fgOffset.x);
    const startY = Math.max(0, fgOffset.y);
    const endX = Math.min(bgDimensions.width, fgOffset.x + fgDimensions.width);
    const endY = Math.min(bgDimensions.height, fgOffset.y + fgDimensions.height);
    // Check if there's no intersection
    if (endX <= startX || endY <= startY) {
        console.log('No intersection between foreground and background images');
        return null;
    }
    return { startX, startY, endX, endY };
}
function bgToFgCoordinates(bgPos, fgOffset) {
    return {
        x: bgPos.x - fgOffset.x,
        y: bgPos.y - fgOffset.y
    };
}
