import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import Signer from 'tiktok-signature';
import axios from 'axios';
import { executablePath } from 'puppeteer';
import db from '../../../models';
import 'dotenv/config';
import Tpayloads from '../../../interfaces/payloads-interface';

class TiktokScraperServices {
   private browser: any;
   private page: any;

   private TT_REQ_USER_AGENT: string =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56';

   public init = async (): Promise<void> => {
      this.browser = await puppeteer.launch({
         headless: false,
      });
      this.page = await this.browser.newPage();
      puppeteer.use(pluginStealth());
   };

   public goToUserPage = async (username: string): Promise<void> => {
      await this.page.goto(`https://www.tiktok.com/@${username}`, {
         timeout: 0,
      });
   };

   public getUserFeed = async (): Promise<string[]> => {
      // await this.page.waitForNavigation();
      setTimeout(async (): Promise<void> => {
         await this.page.reload({
            waitUntil: ['networkidle0', 'domcontentloaded'],
         });
      }, 1000 * 60 * 3);

      await this.autoScroll();

      setTimeout(() => {}, 120000);

      await this.autoScroll();

      setTimeout(() => {}, 120000);

      await this.autoScroll();

      setTimeout(() => {}, 120000);

      await this.autoScroll();

      let results: string[] = [];

      const hrefArr = await this.page.evaluate(() =>
         Array.from(
            document.querySelectorAll("div [data-e2e='user-post-item-list'] a"),
            (a) => a.getAttribute('href'),
         ),
      );

      hrefArr.forEach(async (result: string) => {
         if (
            result != 'https://www.tiktok.com/' &&
            !result.includes('/tag') &&
            result.includes('https://www.tiktok.com/@')
         ) {
            results.push(result);
         }
      });
      return results;
   };

   public autoScroll = async (): Promise<void> => {
      await this.page.evaluate(async () => {
         await new Promise((resolve: any): void => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval((): void => {
               var scrollHeight = document.body.scrollHeight;
               window.scrollBy(0, distance);
               totalHeight += distance;

               if (totalHeight >= scrollHeight - window.innerHeight) {
                  clearInterval(timer);
                  resolve();
               }
            }, 100);
         });
      });
   };

   public getFollowerAmount = async (): Promise<string> => {
      const followerElement = await this.page.$(
         '#main-content-others_homepage > div > div.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2.enm41492 > h3 > div:nth-child(2) > strong',
      );

      const followerAmount = await (
         await followerElement.getProperty('textContent')
      ).jsonValue();
      return followerAmount;
   };

   public getFeedCommentAmount = async (): Promise<number> => {
      const commentElement = await this.page.$(
         '#main-content-video_detail > div > div.tiktok-12kupwv-DivContentContainer.ege8lhx2 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx3 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-14a6qal-DivVideoContainer.eqrezik6 > div.tiktok-79f36w-DivActionBarWrapper.eqrezik7 > div > button:nth-child(2) > strong',
      );

      const commentAmount = await (
         await commentElement.getProperty('textContent')
      ).jsonValue();

      return parseInt(commentAmount);
   };

   public getFeedLikeAmount = async (): Promise<number> => {
      const likeElement = await this.page.$(
         '#main-content-video_detail > div > div.tiktok-12kupwv-DivContentContainer.ege8lhx2 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx3 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-14a6qal-DivVideoContainer.eqrezik6 > div.tiktok-79f36w-DivActionBarWrapper.eqrezik7 > div > button:nth-child(1) > strong',
      );

      const likeAmount = await (
         await likeElement.getProperty('textContent')
      ).jsonValue();

      return parseInt(likeAmount);
   };

   public goToFeedPage = async (feedUrl: string): Promise<void> => {
      await this.page.waitForTimeout(4000);
      await this.page.goto(feedUrl, {
         timeout: 0,
      });
      await this.page.waitForTimeout(4000);
   };

   public getSignature = async (username: string): Promise<any> => {
      const SEC_UID: string =
         'MS4wLjABAAAAupyUB9Jb53gU_NSPgMqNnxePNl4cdiiCZ6ppAQbuBaFnKhtQXBK8PnC7v_0hM3zr';

      let PARAMS: any = {
         aid: '1988',
         count: 30,
         secUid: SEC_UID,
         cursor: 0,
         cookie_enabled: true,
         screen_width: 0,
         screen_height: 0,
         browser_language: '',
         browser_platform: '',
         browser_name: '',
         browser_version: '',
         browser_online: '',
         timezone_name: 'Europe/London',
      };

      const signer = new Signer(null, this.TT_REQ_USER_AGENT);
      await signer.init();

      const qsObject = new URLSearchParams(PARAMS);
      const qs = qsObject.toString();

      const unsignedUrl = `https://m.tiktok.com/api/post/item_list/?${qs}`;
      const signature = await signer.sign(unsignedUrl);
      const navigator = await signer.navigator();
      await signer.close();

      const payloads: object = {
         xTtParams: signature['x-tt-params'],
         userAgent: navigator.user_agent,
      };

      return payloads;
   };

   public getUserFeed2 = async (cursor: number): Promise<any> => {
      const usernameTesting: string = 'musiklirik_1';
      console.info(`CURSOR FROM USER FEED : ${cursor}`);
      const payloads = await this.getSignature(usernameTesting, cursor);

      // console.info(payloads);

      const option = {
         method: 'GET',
         headers: {
            'user-agent': payloads.userAgent,
            'x-tt-params': payloads.xTtParams,
         },
         url: 'https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=1&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36%20Edg%2F107.0.1418.56&channel=tiktok_web&cookie_enabled=true&device_id=7165118680723998214&device_platform=web_pc&focus_state=true&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=RO&referer=&region=RO&screen_height=1440&screen_width=2560&tz_name=Europe%2FBucharest&webcast_language=en&msToken=G3C-3f8JVeDj9OTvvxfaJ_NppXWzVflwP1dOclpUOmAv4WmejB8kFwndJufXBBrXbeWNqzJgL8iF5zn33da-ZlDihRoWRjh_TDSuAgqSGAu1-4u2YlvCATAM2jl2J1dwNPf0_fk9dx1gJxQ21S0=&X-Bogus=DFSzswVYxTUANS/JS8OTqsXyYJUo&_signature=_02B4Z6wo00001CoOkNwAAIDBCa--cQz5e0wqDpRAAGoE8f',
      };

      return axios(option);
   };
}

export default new TiktokScraperServices();
