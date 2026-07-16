# SitePack Theme Skeleton

This is a new theme skeleton for SitePack. This package is open-source and re-usable for our customers to build their own custom themes.

## Requirements

To register and run an theme, you need a **SitePack Partner Account**.
- **Register for free**: [https://admin.sitepack.eu/partners](https://admin.sitepack.eu/partners)

## Resources

- **[Theme Development Documentation](https://sitepack.dev/docs/themes/overview)** 
- **[SitePack Developer documentation](https://sitepack.dev)** 
- **[Partner Portal](https://admin.sitepack.eu/partners)** 
- **[SitePack Website Builder & Online store builder](https://sitepack.eu)**
- **[SitePack documentation](https://help.sitepack.eu)**

## Features

- **Standard Templates**: Includes 404, account, article, blog, cart, category, index, page, and product templates.
- **Layouts & Snippets**: Base layout with modular snippets for header, footer, and product cards.
- **Configurable**: Includes a basic `theme.json` and `settings_schema.json` to get started.
- **Supported Features**: Ready for webshop, blog, and wishlist integrations.

## Getting Started

The typical development workflow for a SitePack theme requires the **SitePack CLI**. It must be used for new themes with `sitepack theme:init` and to build/sync themes using `sitepack theme:watch`.

1.  **Install the SitePack CLI**: Follow the [installation instructions](https://sitepack.dev/docs/cli/installation) to set up the CLI on your machine.
2.  **Initialize**: Start a new project with `sitepack theme:init`.
3.  **Develop & Build**: Use the CLI to develop locally and see your changes in real-time. Use `sitepack theme:watch` to sync your changes with SitePack servers and build your theme. This command uses the `.sitepackignore` file to determine which files should not be synced.
4.  **Preview**: Test your theme on a development store to ensure everything looks perfect.
5.  **Package & Upload**: Once ready, package your theme and upload it to the SitePack Marketplace.

## Project Structure

- `config/`: Contains theme configuration and settings schema.
- `layouts/`: Base layout templates.
- `snippets/`: Reusable code snippets (e.g., header, footer).
- `templates/`: Main and custom page templates (e.g., home, product, category, blog, account, cart).
- `theme.json`: Theme metadata and supported features.
- `.sitepackignore`: Files and folders to ignore when syncing with SitePack servers.

## Theme Configuration (`theme.json`)

The `theme.json` file is the heart of your theme. It defines the theme metadata, supported features, custom settings, and templates.

### Metadata

- `uuid`: A unique identifier for the theme.
- `name`: The display name of the theme.
- `author`: The developer or team who created the theme.
- `version`: The current version of the theme.
- `supports_site`: Set to `true` if the theme supports standard websites.
- `supports_online_store`: Set to `true` if the theme supports e-commerce features.

### Theme Settings

Developers can define custom settings that users can adjust in the SitePack admin. These settings are defined in the `settings` array.

#### Required Settings

The following settings are **mandatory** and are always added from SitePack core to ensure proper website designs:

- **heading-font** (`font`): The font used for headings (default: `Open_Sans`).
- **body-font** (`font`): The font used for body text (default: `Open_Sans`).
- **main-color** (`colour`): The primary brand color (default: `#ca992f`).
- **main-color-text** (`colour`): The text color used on top of the main color (default: `#ffffff`).
- **secondary-color** (`colour`): Secondary brand color (default: `#129171`).
- **secondary-color-text** (`colour`): Text color on secondary color (default: `#ffffff`).
- **link-color** (`colour`): The default color for hyperlinks (default: `#ca992f`).
- **link-active-color** (`colour`): The color for links when hovered or active (default: `#b38a2a`).
- **link-text-decoration** (`options`): The text decoration for links (default: `underline`).
- **border-radius** (`pixels`): Default border radius for elements (default: `5px`).
- **container-width** (`pixels`): Maximum width of the site container (default: `1200px`).

#### Available Settings in Skeleton

These settings are already defined in the skeleton and can be customized or expanded:

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text-color` | `colour` | `#333333` | General body text color. |
| `background-color` | `colour` | `#ffffff` | General page background color. |
| `content-background-color` | `colour` | `#ffffff` | Background color for content areas. |
| `blog-background-color` | `colour` | `#ffffff` | Background color for blog pages. |
| `category-background-color` | `colour` | `#ffffff` | Background color for category pages. |
| `header-background-color` | `colour` | `darkblue` | Background color for the header. |
| `header-text-color` | `colour` | `#ffffff` | Text color in the header. |
| `header-topbar-color` | `colour` | `#2b2b2b` | Background color for the top bar. |
| `header-topbar-text-color` | `colour` | `#ffffff` | Text color in the top bar. |
| `footer-background-color` | `colour` | `#3f434a` | Background color for the footer. |
| `footer-text-color` | `colour` | `#f1f1f1` | Text color in the footer. |
| `footer-title-color` | `colour` | `#f1f1f1` | Title color in the footer. |
| `copyright-background-color` | `colour` | `#ffffff` | Background for the copyright area. |
| `copyright-text-color` | `colour` | `#000000` | Text color for the copyright area. |
| `label-background-color` | `colour` | `#cfcfcf` | Background color for labels/badges. |

## Custom Templates

SitePack themes can define custom templates in `theme.json`. These templates allow you to create unique layouts for specific pages with manageable fields in the SitePack admin.

### Landing Page (`landing-page`)

The `landing-page` template is an example of a custom template. It includes the following fields:

- **hero-title** (`text`): The main hero title.
- **hero-sub-head** (`text`): The main hero sub heading.
- **hero-sub-paragraph** (`textarea`): The main hero sub paragraph.
- **hero-image** (`image`): The main hero image.
- **hero-cta-label** (`text`): The main hero CTA label.
- **hero-cta-url** (`text`): The main hero CTA URL.
- **features-title** (`text`): Features title.
- **feature-1-title** (`text`): Feature 1 title.
- **feature-1-text** (`textarea`): Feature 1 text.
- **feature-2-title** (`text`): Feature 2 title.
- **feature-2-text** (`textarea`): Feature 2 text.
- **feature-3-title** (`text`): Feature 3 title.
- **feature-3-text** (`textarea`): Feature 3 text.
- **usps** (`list`): A list of Unique Selling Points.

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved. For more information on building themes, check the [official SitePack documentation](https://sitepack.dev/docs/themes/overview).

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more details.

---

**Disclaimer**

SitePack provides this theme skeleton as-is for our customers and the open-source community. We do not provide any guarantees and are not responsible for any issues, damages, or data loss resulting from the use of this software.
