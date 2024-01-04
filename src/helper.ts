import slugify from 'slugify';
import * as fs from 'fs-extra';
import { LINK_PROFILE } from './constants';

export const parseSafe = (s) => {
  try {
    return JSON.parse(s);
  } catch (_) {
    return undefined;
  }
};

export const sumNumberArray = (array: Array<any>) => {
  return array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
};

export const setDelay = (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const generateSlug = (text: string): string => {
  const splitText = text.replace(/['&]/g, '');
  return slugify(splitText, {
    lower: true,
  });
};

export const transformTextSearch = (str: any) =>
  str
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    .trim()
    .split(' ')
    .join(' & ');

export const getFiles = (dataDir: string): string[] => {
  try {
    const files = fs.readdirSync(dataDir);
    console.log('files', files);
    return files;
  } catch (err) {
    console.error('Error reading userDataDir:', err);
    return [];
  }
};

export const formatPhoneNumber = (phone: string) => {
  return phone?.replace(/\D/g, '')?.slice(-10);
};

export const parseUSAddress = (address: string) => {
  const parts = address?.split(',').map((part) => part.trim());

  const country = parts?.[3] ? parts?.pop() : undefined;
  const zipCodeAndState = parts?.[2] ? parts?.pop() : undefined;
  const city = parts?.[1] ? parts?.pop() : undefined;
  const street = parts?.[0] ? parts?.join(',') : undefined;
  const parseZipCodeAndState = zipCodeAndState
    ? zipCodeAndState?.split(' ')?.map((part) => part.trim())
    : undefined;

  return {
    country,
    zip: parseZipCodeAndState?.[1],
    state: parseZipCodeAndState?.[0],
    city,
    street,
  };
};

export const parseWebsite = (links: string[]) => {
  return links.map((link: string) => {
    let type = null;
    for (const key in LINK_PROFILE) {
      if (link.startsWith(LINK_PROFILE[key])) {
        type = key;
        break;
      }
    }
    return { link, type };
  });
};

export const removeDuplicates = (arr: any[]) => {
  const uniqueArr = [];

  arr.forEach((item) => {
    if (!uniqueArr.includes(item)) {
      uniqueArr.push(item);
    }
  });

  return uniqueArr;
};

export const promisesSequentially = async (promises: any[], limit: number) => {
  const results = [];
  let currentIndex = 0; // Index of the fulfilled promise

  // Function executes the next promise in the sequence
  async function executeNext() {
    const index = currentIndex; // Save the current index to ensure the correct promise is made
    currentIndex++; // Increase the index to prepare for the next promise

    if (index >= promises.length) return; // If the index exceeds the number of promises, end

    const result = await promises[index](); // Wait for the promise to complete
    results[index] = result; // Add the result at the correct index
    await executeNext(); // Callback the rule to execute the next promise
  }

  // Create a promise for each execution and add it to the executingPromises array
  const executingPromises = [];
  for (let i = 0; i < limit; i++) {
    executingPromises.push(executeNext());
  }

  // Wait for all promises in executingPromises to complete
  await Promise.all(executingPromises);
  return results;
};
