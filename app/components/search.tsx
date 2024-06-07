'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import styles from './search.module.css';

export function Search() {
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSearch = async (searchQuery: string) => {
        const level = "general"; // Set the level here
        const response = await fetch('https://autoreader-backend.ed-aisys.com/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: searchQuery, level: level }),
        });
        const data = await response.json();
        setResults(data.papers); // Based on your comment, the results are in the "papers" field
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>
                Semantic Search for arXiv Papers today
            </h1>
            <h2 className={styles.h2}>
                Subscription is coming soon! Next version will release in 48 hours!
            </h2>
            <h2 className={styles.h2}>
                (Subscribe your interested problem in one click)
            </h2>
            <header className={styles.header}>
                <input
                    className={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() => handleSearch(query)}
                >
                    Search
                </button>
            </header>
            {isClient && (
                <div className={styles.grid}>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={styles.card}
                        >
                            <h2 className={styles.title}>
                                <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    {result.title}
                                </a>
                            </h2>
                            <p className={styles.author}>{result.author}</p>
                            <p className={styles.abstract}>{result.abstract}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
