-- Remove unnecessary fields from portfolio_settings table
ALTER TABLE portfolio_settings
    DROP COLUMN custom_domain,
    DROP COLUMN custom_css,
    DROP COLUMN custom_js,
    DROP COLUMN meta_description,
    DROP COLUMN meta_keywords,
    DROP COLUMN google_analytics_id; 