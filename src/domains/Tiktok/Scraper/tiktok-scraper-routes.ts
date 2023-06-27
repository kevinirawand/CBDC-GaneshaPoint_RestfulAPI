import BaseRoutes from '../../../base_claseses/base-routes';
import tryCatch from '../../../utils/tryCatcher';
import tiktokScraperController from './tiktok-scraper-controller';

class TestRoutes extends BaseRoutes {
   public routes(): void {
      this.router.get('/scrape', tryCatch(tiktokScraperController.scrape));
   }
}

export default new TestRoutes().router;
