const projectDetailsData = {
    covid: {
      title: "Covid Geo Analysis",
      topic: "Data Analytics",
      date: "2025-08-01",
      banner: "project1.jpg",
      tools: ["Python", "Pandas", "Matplotlib"],
      type: "Data Cleaning",
      github: "https://github.com/example/covid-project",
      toc: true,
      content: [
        { type: "header", text: "Overview" },
        { type: "text", text: "This project analyzed COVID-19 infection data focusing on public transport’s role." },
        { type: "image", src: "covid-chart.jpg", alt: "Covid Data Chart" },
        { type: "header", text: "Methodology" },
        { type: "text", text: "Data was collected from government sources and processed in Python." }
      ]
    },
    sentiment: {
      title: "App Sentiment Study",
      topic: "Data Analytics",
      date: "2025-07-15",
      banner: "project2.jpg",
      tools: ["Python", "NLTK", "Seaborn"],
      type: "Sentiment Analysis",
      github: "https://github.com/example/app-sentiment",
      toc: true,
      content: [
        { type: "header", text: "Project Goals" },
        { type: "text", text: "We explored how sentiment affects app usage patterns." },
        { type: "image", src: "sentiment-graph.jpg", alt: "Sentiment Graph" }
      ]
    },
    sales: {
      title: "Sales Forecast",
      topic: "Data Analytics",
      date: "2025-06-20",
      banner: "project3.jpg",
      tools: ["Python", "Scikit-learn", "Matplotlib"],
      type: "Predictive Modeling",
      github: "https://github.com/example/sales-forecast",
      toc: false,
      content: [
        { type: "header", text: "Introduction" },
        { type: "text", text: "Forecasted sales for Q3 using historical sales data." },
        { type: "image", src: "sales-predict.jpg", alt: "Sales Prediction" }
      ]
    },
    etl: {
      title: "Retail ETL Pipeline",
      topic: "Data Engineering",
      date: "2025-06-05",
      banner: "project4.jpg",
      tools: ["Python", "SQL", "Airflow"],
      type: "ETL Development",
      github: "https://github.com/example/retail-etl",
      toc: false,
      content: [
        { type: "header", text: "Overview" },
        { type: "text", text: "Built an automated ETL pipeline for retail data collection and transformation." }
      ]
    }
    // Add other projects here
  };