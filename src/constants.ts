import { KeyInput, WaitForOptions } from 'puppeteer';

export enum OPTION_NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging',
}

export enum ROLE {
  admin = 'admin',
  user = 'user',
}

export enum STATE_JOB {
  active = 'active',
  completed = 'completed',
  delayed = 'delayed',
  failed = 'failed',
  paused = 'paused',
  waiting = 'waiting',
}

export enum METHOD {
  GET = 'GET',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
//env
export const NODE_ENV = 'NODE_ENV';
export const BUSINESS_LIST = 'BUSINESS_LIST';
export const GOOGLE_EMAIL = 'GOOGLE_EMAIL';
export const GOOGLE_PASSWORD = 'GOOGLE_PASSWORD';
export const JWT_SECRET = 'JWT_SECRET';
export const REDIS_URL = 'REDIS_URL';
export const REDIS_HOST = 'REDIS_HOST';
export const REDIS_POST = 'REDIS_POST';
export const BROWSER_USER_DATA_DIR = 'BROWSER_USER_DATA_DIR';

export const KEYBOARD_ENTER: KeyInput = 'Enter';
export const SECONDS_OF_DAY = 86400000;

//class for website
export const WEBSITE = {
  GOOGLE: {
    URL: 'https://www.google.com',
    MAP_URL: 'https://maps.google.com',
    BUTTON_ACCEPT: '.GzLjMd #L2AGLb',
    INPUT_EMAIL: "*[type='email']",
    INPUT_PASSWORD: "*[type='password']",
    INPUT_SEARCH: "*[name='q']",
    PLACE: '.osrp-blk',
    PLACE_IS_ACTIVE: '#Shyhc',
    PLACESE: 'div[jsmodel="QPRQHf"]',
    PLACESE_ITEM: '.cXedhc a[data-cid][tabindex="0"]',
    PLACESE_ITEM_CID: '.immersive-container [data-cid]',
    PLACESE_ITEM_CONTAINER:
      'g-sticky-content-container block-component .xpdopen .ifM9O',
  },
  FIND_OPEN: {
    URL: 'https://find-open.com',
    CONTAINER: '.companies-list',
    DETAIL: '.company-info',
    NEXT_PAGE: '.pagination .next',
  },
  GOLOCAL_247: {
    URL: 'https://www.golocal247.com',
    CONTAINER: '.businessResult',
    SEARCH_WHAT: '.what[type="search"]',
    SEARCH_WHERE: '.where[type="search"]',
    NEXT_PAGE: '.pagination ul li a ::-p-text(Next)',
  },
  YELLOW_BOT: {
    URL: 'https://www.yellowbot.com',
    CONTAINER: '.resultWrapper .resultInner ',
    SEARCH_WHAT: 'input[name="q"]',
    SEARCH_WHERE: 'input[name="place"]',
    NEXT_PAGE: '.paginationContent ul li a ::-p-text(Next)',
  },
  YELLOW_PAGES: {
    URL: 'https://www.yellowpages.com',
    CONTAINER: '[class="search-results organic"] .result',
    SEARCH_WHAT: 'input[name="search_terms"]',
    SEARCH_WHERE: 'input[name="geo_location_terms"]',
    NEXT_PAGE: '.pagination ul li a[class="next ajax-page"]',
  },
};

export const LINK_PROFILE = {
  google: 'https://www.google.com',
  googleMap: 'https://maps.google.com',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  twitter: 'https://twitter.com/',
  linkedin: 'https://www.linkedin.com/',
  yelp: 'https://www.yelp.com/',
  yellowbot: 'https://www.yellowbot.com',
  golocal247: 'https://www.golocal247.com',
  findOpen: 'https://find-open.com',
};

export const SCRATCH_STATUS = {
  CREATE_SCRATCH: 'CREATE_SCRATCH',
  GET_KEYWORD_BUSINESS: 'GET_KEYWORD_BUSINESS',
  SEARCH_KEYWORD_GOOGLE: 'SEARCH_KEYWORD_GOOGLE',
  GET_PLACE_LIST: 'GET_PLACE_LIST',
};

export const PRISMA_ERROR_CODE = {
  DUPLICATE: 'P2002',
  CONSTRAINT_NOT_FOUND: 'P2025',
};

export const MESSAGE_ERROR = {
  INCORRECT_USERNAME_OR_PASSWORD: 'Incorrect username or password!',
  USER_NOT_EXIST: 'User does not exist!',
  USER_ALREADY_EXISTS: 'User already exists!',
  USERNAME_EXISTS: 'Username already exists!',
  EMAIL_EXISTS: 'Email already exists!',
  PHONE_EXISTS: 'Phone already exists!',
  SIC_EXISTS: 'SIC already exists!',
  NOT_FUND_DATA: 'Not fund data!',
  CATEGORY_EXISTS: 'Category already exists!',
  HAS_EXPIRED: 'Login session has expired!',
};

export const SORT_DIRECTION = ['asc', 'desc'];
export const CATEGORY_SORT_BY = ['name', 'isActive', 'createdAt'];

export const OPTION_GO_TO_PAGE: WaitForOptions = {
  waitUntil: 'domcontentloaded',
};

export enum PERMISSION_SUBJECTS {
  Business = 'Business',
  Category = 'Category',
  ScratchHistory = 'ScratchHistory',
}

export enum ACTION {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum TABLES {
  Policy = 'Policy',
  User = 'User',
  Business = 'Business',
  Category = 'Category',
  ScratchHistory = 'ScratchHistory',
  Setting = 'Setting',
}

export const OPTION_DEFAULT_PUPPETEER = {
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--deterministic-fetch',
    '--disable-features=IsolateOrigins',
    '--disable-site-isolation-trials',
  ],
  ignoreDefaultArgs: ['--disable-extensions'],
};

//regex
export const LETTER_AZ = 'abcdefghijklmnopqrstuvwxyz';
export const REGEX_PHONE_NUMBER =
  /(?:\+\d{1,2}\s*)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}(?:\s?[xX]\d+)?/g;
export const REGEX_ADDRESS =
  /(?:Location|Address)?:?\s*(\d+[^,\n]+,\s*[^,\n]+,\s*[^,\n]+(?:,\s*\w{2}\s*\d{5})?)/gi;
