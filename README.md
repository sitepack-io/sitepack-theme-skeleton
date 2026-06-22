# SitePack Theme Skeleton

This is a new theme skeleton for SitePack. This package is open-source and re-usable for our customers to build their own custom themes.

## Requirements

To register and run an theme, you need a **SitePack Partner Account**.
- **Register for free**: [https://sitepack.eu/partners](https://sitepack.eu/partners)

## Resources

- **[Theme Development Documentation](https://sitepack.dev/docs/themes/overview)** 
- **[SitePack Developer documentation](https://sitepack.dev)** 
- **[Partner Portal](https://sitepack.eu/partners)** 
- **[SitePack Website Builder](https://sitepack.eu)**
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

## Custom Templates

SitePack themes can define custom templates in `theme.json`. These templates can be used for specific pages and can have custom fields that are manageable in the SitePack admin.

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
- **usps** (`list`): A list of Unique Selling Points.

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved. For more information on building themes, check the [official SitePack documentation](https://sitepack.dev/docs/themes/overview).

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more details.

---

**Disclaimer**

SitePack provides this theme skeleton as-is for our customers and the open-source community. We do not provide any guarantees and are not responsible for any issues, damages, or data loss resulting from the use of this software.
