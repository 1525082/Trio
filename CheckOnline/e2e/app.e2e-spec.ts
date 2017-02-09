import { CheckOnlinePage } from './app.po';

describe('check-online App', function() {
  let page: CheckOnlinePage;

  beforeEach(() => {
    page = new CheckOnlinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
