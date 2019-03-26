const {Builder} = require('selenium-webdriver');
const {Channel, Options} = require('selenium-webdriver/firefox');
const fs = require('fs');

let options = new Options().setBinary(Channel.NIGHTLY).windowSize({width:1920,height:1080});
const driver = new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

async function test(input) {
  try {
    for (item of input) {
      try {
        await driver.get(item.url);
        let data = await driver.executeScript(function() {
          return Array.from(
            document.querySelectorAll('svg[class*="logo"],img[class*="logo"],*[class*="logo"] svg,*[class*="logo"] img,svg[id*="logo"],img[id*="logo"],*[id*="logo"] svg,*[id*="logo"] img,a[href="/"] svg,a[href="/"] img,div[class*="logo"],div[id*="logo"],a[href="/"] div,a[href="/"]')
          ).map(
            x => {
              let img, bgcolor, node = x;
              do {
                bgcolor = window.getComputedStyle(node).backgroundColor;
                node = node.parentNode;
              } while (bgcolor == "rgba(0, 0, 0, 0)" && node.tagName);

              if(x.tagName == "DIV" || x.tagName == "A") {
                let s = window.getComputedStyle(x).backgroundImage;
                if (s) {
                  let t = s.match(/url\(\s*["']?([^"']+)['"]?\s*\)/);
                  if (t) {
                    img = t[1];
                  } else {
                    img = null;
                  }
                } else {
                  img = null;
                }
              } else if (x.tagName == 'svg') {
                img = x.outerHTML;
              } else if (x.tagName == 'IMG') {
                img = x.src;
              } else {
                console.log(x.tagName);
                img = x;
              };
              return {img, bgcolor};
            }
          ).filter(x => x.img != null);
        });
        console.log(JSON.stringify({item, data}));
      } catch (e) {
        console.log(JSON.stringify({item, data:[], error: true}));
      }
    }
  } catch (e) {
    console.log('error', e);
  } finally {
    await driver.quit();
  }
}
try {
  test(JSON.parse(fs.readFileSync("/dev/stdin", "utf-8")));
} catch (e) {
  console.error('Please supply JSON array with objects containing an "url" property to the stdin.');
}
