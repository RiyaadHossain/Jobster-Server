import { months } from './constant';

const getLastNthMonth = (totalMonths: number) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const lastNthMonths = [];

  let subtractYear = 0;
  for (let i = 0; i < totalMonths; i++) {
    // Handle year transitions
    const subtractMonth = i < 12 ? i : (i - 12) % 12;
    const monthIndex = (currentMonth - subtractMonth + 12) % 12;

    if (monthIndex == 11 && i !== 0) subtractYear++;
    const year = currentYear - subtractYear;

    lastNthMonths.push({ month: months[monthIndex], year });
  }

  return lastNthMonths;
};

const getDateFromNthMonthBack = (totalMonths: number) => {
  const currentDate = new Date();
  const pastNthMonth = new Date(
    currentDate.setMonth(currentDate.getMonth() - totalMonths)
  );

  return pastNthMonth;
};

export const DashboardUtils = { getLastNthMonth, getDateFromNthMonthBack };
