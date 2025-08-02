import PlaceholderPage from "@/components/PlaceholderPage";

export default function News() {
  return (
    <PlaceholderPage
      title="Forex News"
      description="Auto-updated CPI and forex news from top financial sources including Investing.com, ForexFactory, and DailyFX. Stay informed with the latest market-moving events."
      features={[
        "Real-time news updates",
        "CPI and economic indicators",
        "News from multiple sources",
        "Automated news scraping",
        "Category filtering",
        "Time-based sorting",
        "Admin manual override"
      ]}
    />
  );
}
