import { PostgradPortalAppPage } from './app.po';

describe('postgrad-portal-app App', () => {
  let page: PostgradPortalAppPage;

  beforeEach(() => {
    page = new PostgradPortalAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
