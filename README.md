# SitePack Theme Skeleton

This is a new theme skeleton for SitePack. This package is open-source and re-usable for our customers to build their own custom themes.

## Requirements

To register and run an app, you need a **SitePack Partner Account**.
- **Register for free**: [https://sitepack.eu/partners](https://sitepack.eu/partners)

## Resources

- **Official Website**: [sitepack.dev](https://sitepack.dev)
- **Theme Development Documentation**: [Theme Overview](https://sitepack.dev/docs/themes/overview)
- **Partner Portal**: [SitePack Partners](https://sitepack.eu/partners)

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
- `templates/`: Main page templates (e.g., home, product, category, blog, account, cart).
- `theme.json`: Theme metadata and supported features.
- `.sitepackignore`: Files and folders to ignore when syncing with SitePack servers.

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved. For more information on building themes, check the [official SitePack documentation](https://sitepack.dev/docs/themes/overview).

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more details.

---

**Disclaimer**

SitePack provides this theme skeleton as-is for our customers and the open-source community. We do not provide any guarantees and are not responsible for any issues, damages, or data loss resulting from the use of this software.
