# Template Hooks

This file documents the available `app_block` hooks in the theme. These hooks allow developers to inject custom functionality at specific positions in the rendering process.

## Global Hooks (layouts/base.twig)

- `head_after`: Just before the closing `</head>` tag.
- `body_start`: Immediately after the opening `<body>` tag.
- `body_end`: Just before the closing `</body>` tag.

## Header Hooks (snippets/header.twig)

- `header_before`: Immediately before the `<header>` element.
- `header_after`: Immediately after the `</header>` element.

## Footer Hooks (snippets/footer.twig)

- `footer_before`: Immediately before the `<footer>` element.
- `footer_after`: Immediately after the `</footer>` element.

## Home Page Hooks (templates/index.twig)

- `index_before`: At the start of the home page content.
- `index_after`: At the end of the home page content.

## Product Page Hooks (templates/product.twig)

- `product_details_before`: At the start of the product details content.
- `product_details_after`: At the end of the product details content.
- `product_gallery_before`: Before the product gallery.
- `product_gallery_after`: After the product gallery.
- `product_image_before`: Before the main product image.
- `product_image_after`: After the main product image.
- `product_price_before`: Before the product price.
- `product_price_after`: After the product price.
- `product_meta_before`: Before the product meta information (brand, SKU).
- `product_meta_after`: After the product meta information.
- `product_stock_before`: Before the product stock information.
- `product_stock_after`: After the product stock information.
- `product_short_description_before`: Before the product short description.
- `product_short_description_after`: After the product short description.
- `product_usps`: For displaying product Unique Selling Points.
- `product_description_before`: Before the product description.
- `product_description_after`: After the product description.
- `product_specifications_before`: Before the product specifications accordion.
- `product_specifications_after`: After the product specifications accordion.
- `product_downloads_before`: Before the product downloads accordion.
- `product_downloads_after`: After the product downloads accordion.
- `product_form_before`: Inside the add-to-cart form, before the inputs.
- `product_form_after`: Inside the add-to-cart form, after the button.
- `product_recommendations_before`: Before the product recommendations section (cross-sells, related).
- `product_recommendations_after`: After the product recommendations section.

## Category Page Hooks (templates/category.twig)

- `category_before`: At the start of the category page content.
- `category_after`: At the end of the category page content.

## Cart Page Hooks (templates/cart.twig)

- `cart_before`: At the start of the cart page content.
- `cart_after`: At the end of the cart page content.
- `cart_item_before`: Before each line item row in the cart.
- `cart_item_after`: After each line item row in the cart.
- `cart_item_image_before`: Before the product image in a cart item.
- `cart_item_image_after`: After the product image in a cart item.
- `cart_item_quantity_before`: Before the quantity input in a cart item.
- `cart_item_quantity_after`: After the quantity input in a cart item.
- `cart_buttons_after`: In the cart summary, after the checkout buttons.

## Blog Page Hooks (templates/blog.twig)

- `blog_before`: At the start of the blog listing page content.
- `blog_after`: At the end of the blog listing page content.
- `blog_article_before`: Before each article summary in the blog listing.
- `blog_article_after`: After each article summary in the blog listing.
- `blog_article_image_before`: Before the article image in the blog listing.
- `blog_article_image_after`: After the article image in the blog listing.

## Article Page Hooks (templates/article.twig)

- `article_before`: At the start of the article page content.
- `article_after`: At the end of the article page content.
- `article_image_before`: Before the main article image.
- `article_image_after`: After the main article image.
- `article_content_before`: Before the main article content.
- `article_content_after`: After the main article content.
- `article_tag_before`: Before each tag in the article.
- `article_tag_after`: After each tag in the article.

## Account Page Hooks (templates/account.twig)

- `account_before`: At the start of the account page content.
- `account_after`: At the end of the account page content.
- `account_dashboard_start`: At the start of the account dashboard container.
- `account_dashboard_end`: At the end of the account dashboard container.
- `account_order_before`: Before each order item in the history.
- `account_order_after`: After each order item in the history.
- `account_address_before`: Before each address item.
- `account_address_after`: After each address item.

## Static Page Hooks (templates/page.twig)

- `page_before`: At the start of the static page content.
- `page_after`: At the end of the static page content.

## Legal Page Hooks (templates/legal.twig)

- `legal_page_before`: At the start of the legal page content.
- `legal_page_after`: At the end of the legal page content.

## Tag Page Hooks (templates/tag.twig)

- `tag_before`: At the start of the tag listing page content.
- `tag_after`: At the end of the tag listing page content.
- `tag_article_before`: Before each article summary in the tag listing.
- `tag_article_after`: After each article summary in the tag listing.

## Landing Page Hooks (templates/landing-page.twig)

- `landing_before`: At the start of the landing page content, before the hero section.
- `landing_after`: At the end of the landing page content, after the features section.

## 404 Error Page Hooks (templates/404.twig)

- `error_404_before`: At the start of the 404 page content.
- `error_404_after`: At the end of the 404 page content.

## Product Card Snippet Hooks (snippets/product-card.twig)

- `product_card_before`: Before the product card container.
- `product_card_after`: After the product card container.
- `product_card_image_before`: Before the product image in the card.
- `product_card_info_before`: Before the product title and price in the card.
- `product_card_info_after`: After the product title and price in the card.
