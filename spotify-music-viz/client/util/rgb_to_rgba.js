export function convertToRGBA(rgb) {
    var rgb2
    var rgb3
    var rgb4
    rgb2 = rgb.replace('rgb', 'rgba')
    rgb3 = rgb2.slice(0,rgb2.length-1)
    rgb4 = rgb3.concat(', 0.10)')
    //console.log(rgb4)
    return rgb4
}