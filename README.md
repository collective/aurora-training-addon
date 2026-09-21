# Aurora Training Project 🚀

[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)
[![Black code style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![CI](https://github.com/collective/aurora-training-project/actions/workflows/main.yml/badge.svg)](https://github.com/collective/aurora-training-project/actions/workflows/main.yml)

Plone Aurora training project with a Python CMFPlone backend.

## What this project demonstrates 🎓

Beyond the standard monorepo scaffold, this training project ships a couple of
examples in the frontend add-on
([`frontend/packages/aurora-training-project`](frontend/packages/aurora-training-project))
that exercise different Aurora extension points:

- **The Likes feature** — a slot component, a server-side `rootLoaderData`
  utility, a resource route, and an **extra backend** (a Prisma/SQLite database)
  plugged into an Aurora app alongside Plone.
- **The Highlight block** — a registry ("Plone") block that demonstrates the
  block anatomy, a schema-driven settings form, block width, and a custom
  background-color **style field** with a React Aria color-swatch widget.

Both features are covered by Playwright acceptance tests under
[`frontend/acceptance`](frontend/acceptance).

### The Likes feature 👍

Every page shows a 👍 **Like** button with the number of times that URL has been
liked; clicking it increments the count in place. Under the hood it wires
together:

- **A slot component** — `LikeButton` is registered into the `contentArea` slot,
  so it renders on content views
  ([`slots/LikeButton.tsx`](frontend/packages/aurora-training-project/slots/LikeButton.tsx),
  [`config/slots.ts`](frontend/packages/aurora-training-project/config/slots.ts)).
- **A `rootLoaderData` server utility** — runs server-side, reads the current
  path's like count from the database, and merges it into the root loader data
  (exposed as `rootData.likes`), so the count is server-rendered
  ([`config/server.ts`](frontend/packages/aurora-training-project/config/server.ts)).
- **A resource route** — `/@likes/*` returns the count for a path on `GET` and
  increments it on `POST`; the button's `fetcher` uses it for live updates
  ([`routes/api.likes.ts`](frontend/packages/aurora-training-project/routes/api.likes.ts),
  [`config/routes.ts`](frontend/packages/aurora-training-project/config/routes.ts)).
- **An extra backend** — a [Prisma](https://www.prisma.io/) ORM + SQLite store (a
  single `UrlLike` model keyed by pathname) that lives entirely outside Plone's
  ZODB, showing how to integrate a secondary datastore
  ([`prisma/schema.prisma`](frontend/packages/aurora-training-project/prisma/schema.prisma),
  [`lib/prisma.ts`](frontend/packages/aurora-training-project/lib/prisma.ts)).

The Likes acceptance tests live in
[`frontend/acceptance/tests/likes.test.ts`](frontend/acceptance/tests/likes.test.ts).

> [!NOTE]
> The Likes data lives in a local SQLite database. See the **Set up the Likes
> database (Prisma)** section below for the one-time setup.

### The Highlight block 🎨

A registry ("Plone") block that highlights a short message. It is a compact tour
of how a block is built and styled in Aurora
([`blocks/Highlight`](frontend/packages/aurora-training-project/blocks/Highlight)):

- **Block registration** — the block config (`view`, `edit`, `blockSchema`,
  icon, category) is registered into `config.blocks.blocksConfig`
  ([`blocks/Highlight/index.ts`](frontend/packages/aurora-training-project/blocks/Highlight/index.ts),
  [`config/blocks.ts`](frontend/packages/aurora-training-project/config/blocks.ts)).
- **Inline editing vs. settings form** — the title and body are edited inline on
  the canvas, while the styling controls live in the schema-driven settings form
  ([`blocks/Highlight/HighlightBlockEdit.tsx`](frontend/packages/aurora-training-project/blocks/Highlight/HighlightBlockEdit.tsx),
  [`blocks/Highlight/schema.tsx`](frontend/packages/aurora-training-project/blocks/Highlight/schema.tsx)).
- **Block width** — exposed through the shared `blockWidth` style field
  (`widget: 'width'`, `styleField: true`); the block content fills the selected
  width in the public view
  ([`styles/highlight.css`](frontend/packages/aurora-training-project/styles/highlight.css)).
- **A custom style field** — `backgroundColor` is a project-defined style field.
  A `styleFieldDefinition` maps the stored id (for example `amber`) to a
  `--highlight-bg` CSS custom property, and a custom settings widget built on
  React Aria's `ColorSwatchPicker` picks the value
  ([`config/blocks.ts`](frontend/packages/aurora-training-project/config/blocks.ts),
  [`blocks/Highlight/HighlightColorWidget.tsx`](frontend/packages/aurora-training-project/blocks/Highlight/HighlightColorWidget.tsx),
  [`blocks/Highlight/palette.ts`](frontend/packages/aurora-training-project/blocks/Highlight/palette.ts)).
- **Add-on styles** — view and editor styles are loaded through the add-on
  `styles/publicui.css` and `styles/cmsui.css` convention
  ([`styles/publicui.css`](frontend/packages/aurora-training-project/styles/publicui.css),
  [`styles/cmsui.css`](frontend/packages/aurora-training-project/styles/cmsui.css)).

The Highlight acceptance tests live in
[`frontend/acceptance/tests/highlight.test.ts`](frontend/acceptance/tests/highlight.test.ts).

## Quick Start 🏁

### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
-   [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
-   Node.js 24 and pnpm
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)


### Installation 🔧

1.  Clone this repository, then change your working directory.

    ```shell
    git clone git@github.com:collective/aurora-training-project.git
    cd aurora-training-project
    ```

2.  Install this code base.

    ```shell
    make install
    ```


### Set up the Likes database (Prisma) 🗄️

The Likes feature stores its data in a local **SQLite** database managed by
[Prisma](https://www.prisma.io/), separate from the Plone backend. Set it up once
after installing.

1.  Generate the Prisma client. (This also runs automatically as part of
    `make install`, so you can usually skip it.)

    ```shell
    pnpm --filter aurora-training-project prisma:generate
    ```

2.  Create the SQLite database and its schema.

    ```shell
    pnpm --filter aurora-training-project prisma:db:push
    ```

    This creates `frontend/packages/aurora-training-project/prisma/dev.db` with a
    single `UrlLike` table. The database file and the generated client are
    git-ignored.

`DATABASE_URL` is already configured in the frontend `package.json` scripts
(`dev`, `start`, `start:prod`, and the `prisma:*` commands), so you don't need to
set any environment variable to run the app or the tools.

Handy Prisma commands (run from the repository root):

| Command | Description |
| --- | --- |
| `pnpm --filter aurora-training-project prisma:generate` | Regenerate the Prisma client after editing the schema |
| `pnpm --filter aurora-training-project prisma:db:push` | Sync the schema to the SQLite database |
| `pnpm --filter aurora-training-project prisma:migrate` | Create and apply a migration |
| `pnpm --filter aurora-training-project prisma:studio` | Open Prisma Studio to browse the data |

Once the database exists, start the servers (below) and the 👍 Like button will
work on every page.


### Fire Up the Servers 🔥

1.  Create a new Plone site on your first run.

    ```shell
    make backend-create-site
    ```

2.  Start the backend at http://localhost:8080/.

    ```shell
    make backend-start
    ```

3.  In a new shell session, start the frontend at http://localhost:3000/.

    ```shell
    make frontend-start
    ```

Voila! Your Plone site should be live and kicking! 🎉

### Local Stack Deployment 📦

Deploy a local Docker Compose environment that includes the following.

- Docker images for Backend and Frontend 🖼️
- A stack with a Traefik router and a PostgreSQL database 🗃️
- Accessible at [http://aurora-training-project.localhost](http://aurora-training-project.localhost) 🌐

Run the following commands in a shell session.

```shell
make stack-create-site
make stack-start
```

And... you're all set! Your Plone site is up and running locally! 🚀

## Project structure 🏗️

This monorepo consists of the following distinct sections:

- **backend**: Houses the API and Plone installation, utilizing pip instead of buildout, and includes a policy package named aurora.training.project.
- **frontend**: Contains the Aurora application and project add-on.
- **devops**: Encompasses Docker stack, Ansible playbooks, and cache settings.
- **docs**: Scaffold for writing documentation for your project.

### Why this structure? 🤔

- All necessary codebases to run the site are contained within the repository (excluding existing add-ons for Plone and React).
- Specific GitHub Workflows are triggered based on changes in each codebase (refer to .github/workflows).
- Simplifies the creation of Docker images for each codebase.
- Demonstrates Plone installation/setup without buildout.

## Code quality assurance 🧐

To check your code against quality standards, run the following shell command.

```shell
make check
```

### Format the codebase

To format and rewrite the code base, ensuring it adheres to quality standards, run the following shell command.

```shell
make format
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Python code formatting, imports sorting  | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | `zpretty` | XML and ZCML formatting  | -- |
| frontend | ESLint | Fixes most common frontend issues | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js) |
| frontend | prettier | Format JS and Typescript code  | [`frontend/.prettierrc`](.frontend/.prettierrc) |
| frontend | Stylelint | Format Styles (css, less, sass)  | [`frontend/.stylelintrc`](.frontend/.stylelintrc) |

Formatters can also be run within the `backend` or `frontend` folders.

### Linting the codebase
or `lint`:

 ```shell
make lint
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Checks code formatting, imports sorting  | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | Pyroma | Checks Python package metadata  | -- |
| backend | check-python-versions | Checks Python version information  | -- |
| backend | `zpretty` | Checks XML and ZCML formatting  | -- |
| frontend | ESLint | Checks JS / Typescript lint | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js) |
| frontend | prettier | Check JS / Typescript formatting  | [`frontend/.prettierrc`](.frontend/.prettierrc) |
| frontend | Stylelint | Check Styles (css, less, sass) formatting  | [`frontend/.stylelintrc`](.stylelintrc) |

Linters can be run individually within the `backend` or `frontend` folders.


## Internationalization 🌐

Generate translation files for Plone and Aurora with ease:

```shell
make i18n
```

## Credits and acknowledgements 🙏

Generated using [Cookieplone (2.0.0b3)](https://github.com/plone/cookieplone) and [cookieplone-templates (662183a)](https://github.com/plone/cookieplone-templates/commit/662183adfd8f2271ed2c6c65419171737723430a) on 2026-09-13 11:51:27.245162. A special thanks to all contributors and supporters!
