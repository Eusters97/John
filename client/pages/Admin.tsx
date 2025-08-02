import PlaceholderPage from "@/components/PlaceholderPage";

export default function Admin() {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Comprehensive admin panel for signal creation, blog management, news scraper control, user management, and analytics. Role-protected access required."
      features={[
        "Signal creator form",
        "Signal management table",
        "Blog CMS with rich text",
        "News scraper controls",
        "User management table",
        "Investment monitoring",
        "Withdrawal processing",
        "Analytics & visitor tracking"
      ]}
    />
  );
}
