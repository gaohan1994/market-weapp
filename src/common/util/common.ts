import dayJs from 'dayjs';

export function dateHelper (date: number): string {
  return dayJs(date).format('YYYY-MM-DD');
}

/**
 * @todo [计算一年的周]
 * @Author: Ghan 
 * @Date: 2020-01-15 15:41:35 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-01-28 23:30:25
 */
export function createWeeks (year: number = 2020) {
  let weeks: string[][] = [];
  /**
   * @param {ONE_DAY} number 一天的时间
   */
  const ONE_DAY = 1000 * 60 * 60 * 24;
  let start = new Date(year, 0, 1);
  let end = new Date(year, 11, 31);

  /**
   * 
   * @param {firstDay} 第一天的日期
   * @param {lastDay} 最后一天的日期
   */
  let firstDay = start.getDay() || 7;
  let lastDay = end.getDay() || 7;

  /**
   * @param {startTime} 每周的起始日期
   * @param {endTime} 每周的结束日期
   */
  let startTime = +start;
  let endTime = startTime + (7 - firstDay) * ONE_DAY;
  // @ts-ignore
  let _endTime = end - (7 - lastDay) * ONE_DAY;

  weeks.push([dateHelper(startTime), dateHelper(endTime)]);

  startTime = endTime + ONE_DAY;
  endTime = endTime + 7 * ONE_DAY;
  while (endTime < _endTime) {
    weeks.push([dateHelper(startTime), dateHelper(endTime)]);
    startTime = endTime + ONE_DAY;
    endTime = endTime + 7 * ONE_DAY;
  }
  weeks.push([dateHelper(startTime), dateHelper(+end)]);
  return weeks;
}

export function getMonthEndDate (month: number) {
  switch (month + 1) {
    case 2: {
      return 28;
    }
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12: {
      return 31;
    }
    default: {
      return 30;
    }
  }
}