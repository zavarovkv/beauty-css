# Releasing

Publishing is an explicit maintainer action. CI on a regular push validates the code and builds a
reviewable demo; it does not publish to npm or deploy a website.

## First npm publication

1. Create your account at npmjs.com, verify your email and enable two-factor authentication.
2. Check availability with `npm view beauty-css --registry https://registry.npmjs.org`. An absent
   package does not reserve the name; the registry decides whether the first publication is allowed.
3. Run `npm ci`, `npm run check`, and `npm run test:browser`. Inspect the English/Russian demo on
   desktop and mobile in both color schemes.
4. Run `npm pack --dry-run` and review the published file allowlist. The package has no runtime
   dependencies or install-time hooks.
5. Sign in and publish from the repository root:

```sh
npm login --registry https://registry.npmjs.org
npm publish --access public --registry https://registry.npmjs.org
```

`publishConfig` already targets the public registry, even if the local default is a corporate proxy.
Complete authentication and 2FA yourself; never put a token or one-time code in the repository.
Update the README and demo installation status after the publication succeeds.

## Subsequent releases with trusted publishing

Configure the npm package's trusted publisher for:

- Owner: `zavarovkv`
- Repository: `beauty-css`
- Workflow: `release.yml`

With npm 11.15 or newer, create the relationship once and complete npm's interactive 2FA challenge:

```sh
npm trust github beauty-css --repository zavarovkv/beauty-css --file release.yml --allow-publish --registry https://registry.npmjs.org
gh variable set NPM_PUBLISHING_ENABLED --body true --repo zavarovkv/beauty-css
```

The npm UI can configure the same relationship. It must allow direct `npm publish` for automatic
releases. `NPM_PUBLISHING_ENABLED` is a non-secret repository switch, not a credential; set it to
`false` to disable the publishing job. Until it is enabled, a GitHub release uploads its verified
CSS and package archive and skips the npm job. This requires no long-lived npm token in GitHub.
The npm job receives only the OIDC permission needed for trusted publishing. See
[npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

For each release:

1. Update `package.json`, the lockfile, changelog and relevant documentation. Use semantic versions.
2. Build and test. Commit the source and the exact generated `dist/` together.
3. Tag that commit as `v<package version>` and publish its GitHub release with meaningful notes.
4. `release.yml` checks the tag/version, runs checks, rejects a distribution diff and publishes the
   package with provenance. It runs only on a published GitHub release, after verification succeeds.
   Stable releases use npm's `latest` tag; GitHub prereleases use `next`. The publisher installs from
   the lockfile without dependency caching and receives no npm token.

Never reuse an npm version. Tag/manifest/package versions must agree. Avoid removing or changing a
public token's meaning without a documented version change. A preview release below 1.0 can change
its API; explain those changes explicitly.

## Consumer updates

Update a consuming theme's pinned artifact only after the upstream release is available. Check its
manifest hash and retain the MIT license. Build and inspect representative pages before shipping
the consumer update. Library releases and theme releases have independent version numbers.
