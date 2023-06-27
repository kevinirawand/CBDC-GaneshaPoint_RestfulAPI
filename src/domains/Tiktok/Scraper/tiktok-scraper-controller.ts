import { Request, Response } from 'express';
import tiktokScraperServices from './tiktok-scraper-services';
import axios from 'axios';
import db from '../../../models';
import delay from '../../../utils/delay';

class TiktokScraperController {
   public scrape = async (req: Request, res: Response): Promise<Response> => {
      let cursor: number = 0;

      let result = await tiktokScraperServices.getUserFeed2(cursor);
      console.info(result.data);
      console.info(`HAS MORE : ${result.data.hasMore}`);
      console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      console.info('==========================');
      let i: number = 0;
      result.data.itemList.forEach((result: any) => {
         console.info(
            `${i + 1} : ${new Date(result.createTime * 1000)} | ${result.id}`,
         );
         i++;
      });

      // result = await tiktokScraperServices.getUserFeed2(1685264595000);
      // console.info(result.data);
      // console.info(`HAS MORE : ${result.data.hasMore}`);
      // console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      // console.info('==========================');
      // let j: number = 0;
      // result.data.itemList.forEach((result: any) => {
      //    console.info(
      //       `${j + 1} : ${new Date(result.createTime * 1000)} | ${result.id}`,
      //    );
      //    i++;
      // });

      // while (result.data.hasMore.toString() == 'true') {
      //    cursor += 10000;
      //    result = await tiktokScraperServices.getUserFeed2(cursor);

      //    console.info(`HAS MORE : ${result.data.hasMore}`);
      //    console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      //    console.info('==========================');
      //    let i: number = 0;
      //    result.data.itemList.forEach((result: any) => {
      //       console.info(
      //          `${i + 1} : ${new Date(result.createTime * 1000)} | ${
      //             result.id
      //          }`,
      //       );
      //       i++;
      //    });
      // }

      // const { 'x-tt-params': xTtParams } = payloads.signature;
      // const { user_agent: userAgent } = payloads.navigator;

      // const results = await axios({
      //    method: 'GET',
      //    headers: {
      //       'user-agent': userAgent,
      //       'x-tt-params': xTtParams,
      //    },
      //    url: TT_REQ_PERM_URL,
      // });

      // console.info(results);

      // await tiktokScraperServices.init();

      // await tiktokScraperServices.goToUserPage(usernameTesting);

      // const followerAmount: string =
      //    await tiktokScraperServices.getFollowerAmount();

      // const results = await tiktokScraperServices.getUserFeed();
      // for (let i: number = 0; i < results.length; i++) {
      //    console.info(`Scraping akun ke-${i}`);
      //    // await delay(5000);
      //    await tiktokScraperServices.goToFeedPage(results[i] || '');
      //    // await delay(5000);

      //    const feedCommentAmount: number =
      //       await tiktokScraperServices.getFeedCommentAmount();
      //    const feedLikeAmount: number =
      //       await tiktokScraperServices.getFeedLikeAmount();

      //    await db.tbl_scraping.create({
      //       tiktok_username: usernameTesting,
      //       url: results[i],
      //       follower_count: followerAmount,
      //       like_count: feedLikeAmount,
      //       comment_count: feedCommentAmount,
      //    });
      // }

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'THIS TEST FROM TT',
         },
      });
   };
}

export default new TiktokScraperController();
