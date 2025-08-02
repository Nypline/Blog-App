import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const contentfulClient = createClient({
    space: "9cbe8t5ezxep",
    accessToken: "nAs6nVtKP9k0ZKhD-M8PBRhrwd-UNxWLi6GciYQg0Cw",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const entry = await contentfulClient.getEntry(id);
        setArticle(entry);
      } catch (err) {
        setError("Article not found or failed to fetch.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateStr));
  };

  if (loading) return <p className="loading">Loading article...</p>;
  if (error) return <p className="error">{error}</p>;

  const { title, blogAuthor, blogImage, createDate, postContent } =
    article.fields;
  const imageUrl = blogImage?.fields?.file?.url;

  return (
    <main className="article-container">
      <div className="back-link">
        <Link to="/blogList">← Back to Articles</Link>
      </div>

      <article className="article-detail">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="article-cover" />
        )}
        <h1 className="article-title">{title}</h1>
        <p className="article-meta">
          <span>Author: {blogAuthor}</span> •{" "}
          <span>{formatDate(createDate)}</span>
        </p>
        <div className="article-body">
          <ReactMarkdown>{postContent}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
};

export default ArticleDetail;
