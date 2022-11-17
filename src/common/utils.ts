/**
 * 补0
 * @param {Number} num 需要操作的数
 */
function appendZero(num: number) {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
}

/**
 * 格式化日期
 * @param {Date} time 日期
 */
export function formatDate(time: Date) {
  const year = time.getFullYear();
  const month = appendZero(time.getMonth() + 1);
  const date = appendZero(time.getDate());
  const week = "日一二三四五六".charAt(time.getDay());
  const hour = appendZero(time.getHours());
  const minute = appendZero(time.getMinutes());
  const second = appendZero(time.getSeconds());
  return `${year}-${month}-${date}(周${week}) ${hour}:${minute}:${second}`;
}
