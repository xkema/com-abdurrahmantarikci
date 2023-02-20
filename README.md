# com-abdurrahmantarikci

Static export of Next.js project for abdurrahmantarikci.com website.

## Deployment Notes

- Do not forget to include a `.nojekyll` file under the `docs/` directory to include `_next` directory in the deployment. (Not under the project root!)
- Rename `docs/404/index.html` file to `404.html` and copy it to the `docs/` directory. (As in `docs/404.html`). Do the same for `docs/500/index.html`. (It may not have any effect on GitHub server errors.)
- Do not delete `docs/CNAME` file.
- Do not delete `docs/.nojekyll` file.
- Do not delete `docs/imece` directory. (It is a standalone webpage that manually included to the project.)