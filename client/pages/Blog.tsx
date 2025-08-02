import PlaceholderPage from "@/components/PlaceholderPage";

export default function Blog() {
  return (
    <PlaceholderPage
      title="Trading Blog"
      description="SEO-optimized articles covering forex education, trading strategies, and market news. Our expert analysis and educational content will help you become a better trader."
      features={[
        "Educational forex articles",
        "Trading strategy guides", 
        "Market analysis posts",
        "Filterable by tags",
        "Author profiles",
        "Read time estimates",
        "SEO optimization"
      ]}
    />
  );
}
