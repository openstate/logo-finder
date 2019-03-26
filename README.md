# Install

To use with Firefox, make sure you have the geckodriver in your PATH, e.g. the same directory.

```bash
curl -L https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-linux64.tar.gz | tar xfz -
yarn install
```

Use:
```bash
echo '[{"url":"https://openstate.eu/"}]' | yarn -s scrape | jq .
```
will result in:
```json
{
  "item": {
    "url": "https://openstate.eu/"
  },
  "data": [
    {
      "bgcolor": "rgb(255, 255, 255)",
      "img": "https://openstate.eu/wp-content/themes/open-state-theme/dist/images/logo-open-state.svg"
    },
    {
      "bgcolor": "rgb(232, 248, 252)",
      "img": "https://openstate.eu/wp-content/themes/open-state-theme/dist/images/logo-ckan.svg"
    }
  ]
}
```

# Room for improvements

- Dockerize (using RemoteWebDriver)
- Improve connection errors
- Abort long loading resouces
- Handle svg use case:
```html
<svg viewBox="0 0 200 25"><use xlink:href="sprite.svg#logo"/></svg>
```
- Compare input url with final url