/**
 * 颜色
 * @param vm
 * @param color
 */
export const lotozeColor = (vm, color) => {
  vm.handContext.strokeStyle = color;
}

/**
 * 换行
 * @param vm
 */
export const lotozeLineFeed = (vm) => {
  vm.fontArr.push("<br/>");
  vm.lastIndex = vm.fontArr.length;
  // vm.renderFonts();
}

/**
 * 空格
 * @param vm
 */
export const lotozeFlankSpace = (vm) => {
  vm.fontArr.push("space");
  // vm.renderFonts();
}

/**
 * 笔触大小
 * @param vm
 */
export const lotozeBrushSize = (vm, size) => {
  vm.handContext.lineWidth = size;
}
