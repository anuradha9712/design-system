import { convertToTwoDigit, _isTimeInAM, _isTimeInPM, checkTimeDifference } from './timePickerUtility';
import { OptionSchema } from '@/components/atoms/dropdown/option';

interface timeObj {
  hour: string;
  min: string;
}

const convertMinTo60 = (time: string) => {
  const timeInNum = parseInt(time, 10) % 60;
  const min = (timeInNum.toString() + '0').slice(0, 2);
  return min;
};

const get24HourCurrentTime = () => {
  const today = new Date();
  return convertToTwoDigit(today.getHours()) + ':' + convertToTwoDigit(today.getMinutes());
};

const convertHourTo24 = (time: string) => {
  const timeInNum = parseInt(time, 10) % 24;
  return timeInNum.toString();
};

const convertHourTo12 = (time: string) => {
  const timeInNum = parseInt(time, 10) % 12;
  return timeInNum.toString();
};

const _checkNumber = (str: string) => {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(str);
};

const _checkNumberWithAMPM = (str: string) => {
  const numberWithAMPMRegex = /^[0-9]+[ AaMmPp]+$/;
  return numberWithAMPMRegex.test(str);
};

const _checkNumberWithSpecialChar = (str: string) => {
  const numberWithSpecialCharRegex = /^[0-9]+[`\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~][0-9]*$/;
  return numberWithSpecialCharRegex.test(str);
};

const _checkNumberWithSpecialCharAPM = (str: string) => {
  const numberWithSpecialCharAPM = /^[0-9]+[`\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~][0-9]+[ AaMmPp]+$/;
  return numberWithSpecialCharAPM.test(str);
};

const specialCharRegex = /[`\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

/**
 * @param searchTime in [number special-char number] format
 * @returns timeObj with hour & minute in 24 hour format
 */
const getTimeFromNumberWithSpecialChar = (searchTime: string) => {
  const time = searchTime.split(specialCharRegex);
  const hour = convertHourTo24(time[0]);
  const hh = convertToTwoDigit(hour);

  const min = time[1] !== '' ? convertMinTo60(time[1]) : '00';
  const mm = (min + '0').slice(0, 2);

  return { hour: hh, min: mm };
};

/**
 * If search term only contains number
 * @param searchTerm
 * @returns timeObj with hour & minute in 24 hour format
 */
const getSearchTimeFromNumber = (searchTerm: string, show12HourFormat?: boolean) => {
  const searchLen = searchTerm.length;
  const searchTimeInNum = parseInt(searchTerm, 10);
  const firstTwoTerm = searchTerm.slice(0, 2);
  let hh = '00';
  let mm = '00';

  switch (searchLen) {
    case 1: // if search term length is 1 consider it as hour
      hh = '0' + searchTerm;
      break;

    case 2: // if search term length is 2
      if (searchTimeInNum <= 23 || (show12HourFormat && searchTimeInNum <= 12)) {
        // consider it as hour
        hh = convertToTwoDigit(searchTerm);
      } else {
        // consider first term as hour and last term as min
        hh = '0' + searchTerm[0];
        mm = searchTerm[1] + '0';
      }
      break;

    case 3:
      hh = '0' + searchTerm[0];
      mm = convertMinTo60(searchTerm.slice(1));
      break;

    case 4:
      hh = show12HourFormat ? convertHourTo12(firstTwoTerm) : convertHourTo24(firstTwoTerm);
      mm = convertMinTo60(searchTerm.slice(2));
      break;

    default:
      // set time as -1 in case of invalid time
      hh = '-1';
      mm = '-1';
  }
  return { hour: hh, min: mm };
};

/**
 * @param searchTime in [number APM] format
 * @returns timeObj with hour & minute in 24 hour format
 */
const getTimeFromNumberWithAPM = (searchTime: string) => {
  const timeArr = searchTime.split(/[\saAmMpP]/);
  const { hour, min } = getSearchTimeFromNumber(timeArr[0], true);
  // const zone = _isTimeInAM(searchTime) ? 'AM' : 'PM';

  return { hour, min };
};

/**
 * @param searchTerm entered by user in any format
 * @returns modified search term in 24 hour format
 */
export const formatSearchTerm = (optionList: string[], searchTerm: string) => {
  let searchTime = { hour: '00', min: '00' };

  // If search term only contains numbers
  if (_checkNumber(searchTerm)) {
    const searchTimeInHHMM = getSearchTimeFromNumber(searchTerm);

    // switch to AM/PM based on current time
    searchTime = getCurrentRelativeTime(optionList, searchTimeInHHMM);
  }

  // if search term contains numbers along with [apm]
  else if (_checkNumberWithAMPM(searchTerm)) {
    searchTime = getTimeFromNumberWithAPM(searchTerm);
    searchTime.hour = convert12To24HourFormat(searchTime.hour, searchTerm);
  }

  // if search term contains numbers along with special character
  else if (_checkNumberWithSpecialChar(searchTerm)) {
    const searchTimeInHHMM = getTimeFromNumberWithSpecialChar(searchTerm);

    // switch to AM/PM based on current time
    searchTime = getCurrentRelativeTime(optionList, searchTimeInHHMM);
  }

  // if search term contains numbers, special character & [AmPm]
  else if (_checkNumberWithSpecialCharAPM(searchTerm)) {
    const timeWithoutAPM = searchTerm.replace(/[\saApPmM]/g, '');

    if (_checkNumber(timeWithoutAPM)) {
      searchTime = getSearchTimeFromNumber(timeWithoutAPM, true);
    } else if (_checkNumberWithSpecialChar(timeWithoutAPM)) {
      searchTime = getTimeFromNumberWithSpecialChar(timeWithoutAPM);
    }

    searchTime.hour = convert12To24HourFormat(searchTime.hour, searchTerm);
  }

  return searchTime;
};

/**
 * @param hours
 * @param searchTerm
 * @returns hours based on AM/PM in 24 hour format
 */
const convert12To24HourFormat = (hours: string, searchTerm: string) => {
  if (hours === '12' && _isTimeInAM(searchTerm)) {
    hours = '00';
  } else if (_isTimeInPM(searchTerm)) {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return hours;
};

/**
 * Switch to AM/PM time based on current time
 * @param optionList
 * @param searchTime
 */
const getCurrentRelativeTime = (optionList: string[], searchTime: timeObj) => {
  const searchTimeStr = `${searchTime.hour}:${searchTime.min}`;
  const currentTime = get24HourCurrentTime();
  const greaterTime = checkTimeDifference(currentTime, searchTimeStr);
  const currentTimeIndex = findClosestTimeIndex(optionList, currentTime);
  const searchTimeIndex = findClosestTimeIndex(optionList, searchTimeStr);

  if (greaterTime && currentTimeIndex > searchTimeIndex) {
    const hourIn24Format = parseInt(searchTime.hour, 10) + 12;
    searchTime.hour = hourIn24Format.toString();
  }

  return searchTime;
};

const convert24TimeStrToNum = (time: string) => {
  return parseInt(time.replace(':', ''), 10);
};

const findClosestTimeIndex = (list: string[], searchItem: string) => {
  const searchItemInNum = convert24TimeStrToNum(searchItem);
  let closestItemIndex = 0;
  let optionItemInNum = convert24TimeStrToNum(list[0]);

  let minDiff = Math.abs(searchItemInNum - optionItemInNum);

  for (let index = 0; index < list.length; index++) {
    optionItemInNum = convert24TimeStrToNum(list[index]);
    const diff = Math.abs(searchItemInNum - optionItemInNum);

    if (diff <= minDiff) {
      minDiff = diff;
      closestItemIndex = index;
    }
  }
  return closestItemIndex;
};

/**
 * Get index of search term from option list
 * @param optionList
 * @param searchTerm
 * @returns Index of the search term in option list
 */
export const getSearchIndex = (optionList: string[], searchTerm: string) => {
  const { hour, min } = formatSearchTerm(optionList, searchTerm);
  const searchItem = `${hour}:${min}`;

  const searchIndex = findClosestTimeIndex(optionList, searchItem);

  return searchIndex;
};

const getValueFromOptionList = (optionList: OptionSchema[]) => {
  const list = optionList.map((option: any) => option.value);
  return list;
};

const getSearchValueIndex = (options: OptionSchema[], searchTerm: string): number => {
  const optionList = getValueFromOptionList(options);
  const searchIndex = getSearchIndex(optionList, searchTerm);
  return searchIndex;

  // const result: [] = [];
  // if (searchIndex === -1) return result; // if no option matches search term

  // const dropdownOptionList = document.querySelectorAll('.Dropdown-items');
  // const targetOption = dropdownOptionList[searchIndex + 1] as HTMLDivElement;
  // console.log('targetOption', targetOption, dropdownOptionList);
  // const activeOptionClassName = 'Option--active';

  // remove class from previous selected option
  // dropdownOptionList.forEach((i) => i.classList.remove(activeOptionClassName));

  // add active class to current target option
  // targetOption.classList.add(activeOptionClassName);
  // if (targetOption) {
  //   targetOption.scrollIntoView({ block: 'center' });
  // }
};

export const getScrollIndex = (dropdownOptionList: OptionSchema[], searchTerm: string): number => {
  if (searchTerm === '') {
    // return current time index
    const currTime = get24HourCurrentTime();
    const optionList = getValueFromOptionList(dropdownOptionList);

    const currTimeIndex = findClosestTimeIndex(optionList, currTime);
    console.log('currTimeIndex', currTimeIndex, currTime);
    return currTimeIndex;
  }

  //@todo return -1 in case of invalid search
  return getSearchValueIndex(dropdownOptionList, searchTerm);
};