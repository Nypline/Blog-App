import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { Link } from "react-router-dom";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const contentfulClient = createClient({
    space: "9cbe8t5ezxep",
    accessToken: "nAs6nVtKP9k0ZKhD-M8PBRhrwd-UNxWLi6GciYQg0Cw",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await contentfulClient.getEntries();
        setArticles(response?.items || []);
      } catch (err) {
        console.error("Failed to load articles:", err);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <main className="grid-container">
      <section className="article-list">
        <h2 className="section-title">Latest Articles</h2>

        {articles.length === 0 && <p>No articles available.</p>}

        {articles.map((item) => {
          const { title, blogSummary, blogAuthor, blogImage, createDate } =
            item.fields;
          const imageUrl = blogImage?.fields?.file?.url;

          return (
            <article className="article-card" key={item.sys.id}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="article-image"
                  width="100%"
                />
              )}

              <div className="article-content">
                <h3>{title}</h3>
                <p className="meta">
                  <span>By {blogAuthor}</span> •{" "}
                  <span>{formatDate(createDate)}</span>
                </p>
                <p>{blogSummary}</p>

                <Link
                  to={`/blogDetails/${item.sys.id}`}
                  className="read-more-btn"
                >
                  Read More →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="page-footer">
        <a
          href="https://twitter.com/thecodeangle"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow us on Twitter
        </a>
      </footer>
    </main>
  );
};

export default ArticleList;
